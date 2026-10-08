import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  Check,
  Code2,
  Download,
  Eye,
  FileText,
  Hammer,
  Loader2,
  MessageSquareText,
  Paintbrush,
  Plus,
  Rocket,
  Save,
  Smartphone,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { LogoMark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BrowserFrame, type Device } from "@/components/builder/BrowserFrame";
import { PreviewSite } from "@/components/builder/PreviewSite";
import { CodeViewer } from "@/components/code/CodeViewer";
import { FileTree } from "@/components/code/FileTree";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GENERATION_STEPS, QUICK_ACTIONS, generateProject, runQuickAction, validatePrompt, type QuickAction } from "@/services/ai";
import { useProjects } from "@/lib/projects-store";
import { downloadProjectZip, slugify } from "@/lib/download";
import { cn } from "@/lib/utils";
import { PROJECT_TYPES, type Project, type ProjectType } from "@/types";

type Search = { project?: string | undefined; view?: "preview" | "code" | undefined; prompt?: string | undefined };

export const Route = createFileRoute("/builder")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    project: typeof s["project"] === "string" ? s["project"] : undefined,
    view: s["view"] === "code" || s["view"] === "preview" ? s["view"] : undefined,
    prompt: typeof s["prompt"] === "string" ? s["prompt"].slice(0, 2000) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Builder — EduForge AI" },
      { name: "description", content: "Describe your project and watch EduForge AI plan, generate and preview it in a live workspace." },
      { property: "og:title", content: "AI Builder — EduForge AI" },
      { property: "og:description", content: "Plan, generate, preview, edit and download projects from a single prompt." },
    ],
  }),
  component: Builder,
});

const EXAMPLE = "Create a college event management website with student registration, event listings, admin dashboard and notifications.";
const ACTION_ICONS: Record<QuickAction, typeof Wand2> = {
  "Improve Design": Paintbrush,
  "Add Feature": Plus,
  "Fix Error": Bug,
  "Make Responsive": Smartphone,
  "Explain Code": MessageSquareText,
  "Generate Documentation": FileText,
};

type Phase = "idle" | "generating" | "ready" | "error";
type Log = { id: number; text: string; tone: "info" | "done" | "error" };

function Builder() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const store = useProjects();

  const [type, setType] = useState<ProjectType>("Website");
  const [prompt, setPrompt] = useState(search.prompt ?? "");
  const [promptError, setPromptError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [dirty, setDirty] = useState(false);
  const [view, setView] = useState<"preview" | "code">(search.view ?? "preview");
  const [device, setDevice] = useState<Device>("desktop");
  const [page, setPage] = useState("home");
  const [activeFile, setActiveFile] = useState<string>();
  const [logs, setLogs] = useState<Log[]>([]);
  const [busy, setBusy] = useState<QuickAction | null>(null);
  const [mobilePanel, setMobilePanel] = useState<"build" | "preview" | "files">("build");
  const [deployOpen, setDeployOpen] = useState(false);
  const logId = useRef(0);

  const log = (text: string, tone: Log["tone"] = "info") => setLogs((l) => [...l, { id: ++logId.current, text, tone }]);

  // Open an existing project from ?project=
  const existing = search.project ? store.get(search.project) : undefined;
  useEffect(() => {
    if (!existing || project?.id === existing.id) return;
    setProject(existing);
    setType(existing.type);
    setPrompt(existing.prompt);
    setPhase("ready");
    setPage("home");
    setActiveFile(existing.files[0]?.path);
    setDirty(false);
    setLogs([{ id: ++logId.current, text: `Opened “${existing.name}”`, tone: "done" }]);
    if (search.view) setMobilePanel("preview");
  }, [existing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const file = useMemo(() => project?.files.find((f) => f.path === activeFile) ?? project?.files[0], [project, activeFile]);

  async function build() {
    const err = validatePrompt(prompt);
    setPromptError(err);
    if (err) return;
    setPhase("generating");
    setStep(0);
    setMobilePanel("preview");
    setLogs([]);
    log(`Prompt received · ${type}`);
    try {
      const { plan, files } = await generateProject(prompt, type, (i) => {
        setStep(i);
        const prev = GENERATION_STEPS[i - 1];
        if (i > 0 && prev) log(prev.done, "done");
      });
      log(GENERATION_STEPS.at(-1)!.done, "done");
      log(`${plan.pages.length} pages · ${files.length} files generated`);
      const now = new Date().toISOString();
      const next: Project = {
        id: project && project.prompt === prompt ? project.id : crypto.randomUUID(),
        name: plan.name,
        description: plan.summary,
        prompt,
        type,
        status: "Draft",
        createdAt: now,
        updatedAt: now,
        plan,
        files,
      };
      setProject(next);
      setActiveFile(files[0]?.path);
      setPage("home");
      setDirty(true);
      setPhase("ready");
      store.recordGeneration();
    } catch (e) {
      log(e instanceof Error ? e.message : "Generation failed", "error");
      setPhase("error");
    }
  }

  async function quick(action: QuickAction) {
    if (!project) {
      toast("Build a project first", { description: "Quick actions work on a generated project." });
      return;
    }
    setBusy(action);
    log(`${action}…`);
    try {
      const res = await runQuickAction(action, project, file?.path);
      if (res.files || res.plan) {
        setProject({ ...project, files: res.files ?? project.files, plan: res.plan ?? project.plan, updatedAt: new Date().toISOString() });
        setDirty(true);
      }
      log(res.message, "done");
    } catch {
      log(`${action} failed. Try again.`, "error");
    } finally {
      setBusy(null);
    }
  }

  function save() {
    if (!project) return;
    const saved = { ...project, status: project.status === "Draft" ? ("Ready" as const) : project.status, updatedAt: new Date().toISOString() };
    store.upsert(saved);
    setProject(saved);
    setDirty(false);
    toast.success("Project saved", { description: "Find it any time in My Projects." });
    navigate({ to: "/builder", search: { project: saved.id }, replace: true });
  }

  async function download() {
    if (!project) return;
    await downloadProjectZip(project);
    toast.success("Download started", { description: `${slugify(project.name)}.zip` });
  }

  const ready = phase === "ready" && project;

  /* ---------------- panels ---------------- */

  const left = (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Project type</p>
        <div className="flex flex-wrap gap-1.5">
          {PROJECT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                type === t ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="prompt" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          What do you want to build?
        </label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (promptError) setPromptError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) build();
          }}
          placeholder={EXAMPLE}
          rows={6}
          maxLength={2000}
          aria-invalid={!!promptError}
          className="resize-none bg-card text-sm"
        />
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
          {promptError ? <span className="text-destructive">{promptError}</span> : (
            <button className="hover:text-foreground" onClick={() => setPrompt(EXAMPLE)}>Use example</button>
          )}
          <span>{prompt.length}/2000</span>
        </div>
        <Button className="mt-3 w-full" size="lg" onClick={build} disabled={phase === "generating"}>
          {phase === "generating" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Hammer className="mr-2 size-4" />}
          {phase === "generating" ? "Building…" : project ? "Rebuild Project" : "Build Project"}
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">⌘/Ctrl + Enter</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick actions</p>
        <div className="grid grid-cols-2 gap-1.5">
          {QUICK_ACTIONS.map((a) => {
            const Icon = ACTION_ICONS[a];
            return (
              <button
                key={a}
                onClick={() => quick(a)}
                disabled={!!busy || phase === "generating"}
                className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-2 text-left text-xs transition-colors hover:border-ember/40 hover:bg-accent/50 disabled:opacity-50"
              >
                {busy === a ? <Loader2 className="size-3.5 animate-spin text-ember" /> : <Icon className="size-3.5 text-ember" />}
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-auto rounded-lg bg-surface p-3 text-[11px] leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Demo mode.</span> Generation uses built-in templates — no AI model is connected yet. The workspace is ready for a real AI backend.
      </p>
    </div>
  );

  const center = (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border bg-card p-0.5">
          {(["preview", "code"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn("flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium capitalize text-muted-foreground", view === v && "bg-primary text-primary-foreground")}
            >
              {v === "preview" ? <Eye className="size-3.5" /> : <Code2 className="size-3.5" />}
              {v}
            </button>
          ))}
        </div>
        {ready && <span className="truncate text-xs text-muted-foreground">{project.plan.pages.length} pages · {project.files.length} files</span>}
      </div>

      <div className="min-h-0 flex-1">
        {phase === "idle" && !project && <IdleCanvas onExample={() => setPrompt(EXAMPLE)} />}
        {phase === "generating" && <GeneratingCanvas step={step} />}
        {phase === "error" && <ErrorCanvas onRetry={build} onBack={() => { setPhase(project ? "ready" : "idle"); setMobilePanel("build"); }} />}
        {ready &&
          (view === "preview" ? (
            <BrowserFrame url={`https://${slugify(project.name)}.eduforge.app/${page === "home" ? "" : page}`} device={device} onDevice={setDevice}>
              <PreviewSite plan={project.plan} page={page} onNavigate={setPage} compact={device === "mobile"} />
            </BrowserFrame>
          ) : file ? (
            <CodeViewer
              file={file}
              onChange={(content) => {
                setProject({ ...project, files: project.files.map((f) => (f.path === file.path ? { ...f, content } : f)) });
                setDirty(true);
                log(`Edited ${file.path}`, "done");
              }}
            />
          ) : null)}
      </div>
    </div>
  );

  const right = (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto border-b p-3">
        <p className="mb-2 px-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Files</p>
        {project ? (
          <FileTree files={project.files} active={file?.path} onSelect={(p) => { setActiveFile(p); setView("code"); setMobilePanel("preview"); }} />
        ) : (
          <p className="px-1.5 text-xs text-muted-foreground">Files appear here after your first build.</p>
        )}
      </div>
      <div className="flex max-h-[45%] min-h-40 flex-col p-3">
        <p className="mb-2 px-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">AI activity</p>
        <ol className="flex-1 space-y-1.5 overflow-y-auto px-1.5 text-xs" aria-live="polite">
          {logs.length === 0 && <li className="text-muted-foreground">No activity yet.</li>}
          {logs.map((l) => (
            <li key={l.id} className="flex animate-rise gap-2">
              {l.tone === "done" ? <Check className="mt-0.5 size-3 shrink-0 text-success" /> : l.tone === "error" ? <AlertTriangle className="mt-0.5 size-3 shrink-0 text-destructive" /> : <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember" />}
              <span className={cn(l.tone === "error" && "text-destructive")}>{l.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
        <Link to="/dashboard" className="flex items-center gap-2" aria-label="EduForge AI dashboard">
          <LogoMark />
          <span className="hidden font-display font-semibold md:inline">EduForge <span className="text-ember">AI</span></span>
        </Link>
        <span className="hidden text-muted-foreground md:inline">/</span>
        <div className="min-w-0 flex-1 md:flex-none">
          <p className="truncate text-sm font-medium">{project?.name ?? "New project"}</p>
          {dirty && <p className="text-[10px] text-ember">Unsaved changes</p>}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="hidden items-center gap-1 lg:flex">
            <Button variant="ghost" size="sm" disabled={!ready} onClick={() => setView("preview")}><Eye className="mr-1.5 size-4" />Preview</Button>
            <Button variant="ghost" size="sm" disabled={!ready} onClick={() => setView("code")}><Code2 className="mr-1.5 size-4" />Code</Button>
          </div>
          <Button variant="ghost" size="sm" disabled={!ready} onClick={save} aria-label="Save"><Save className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">Save</span></Button>
          <Button variant="ghost" size="sm" disabled={!ready} onClick={download} aria-label="Download"><Download className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">Download</span></Button>
          <Button size="sm" disabled={!ready} onClick={() => setDeployOpen(true)}><Rocket className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">Deploy</span></Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop: three panes */}
      <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[320px_1fr_260px] xl:grid-cols-[340px_1fr_280px]">
        <aside className="min-h-0 border-r bg-sidebar">{left}</aside>
        <main className="min-h-0 bg-surface">{center}</main>
        <aside className="min-h-0 border-l bg-sidebar">{right}</aside>
      </div>

      {/* Mobile / tablet: one pane at a time */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <div className="min-h-0 flex-1 bg-surface">{mobilePanel === "build" ? left : mobilePanel === "preview" ? center : right}</div>
        <nav className="grid shrink-0 grid-cols-3 border-t bg-card" aria-label="Builder panels">
          {([["build", Hammer, "Build"], ["preview", Eye, "Preview"], ["files", Code2, "Files"]] as const).map(([k, Icon, label]) => (
            <button key={k} onClick={() => setMobilePanel(k)} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] text-muted-foreground", mobilePanel === k && "text-ember")}>
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <Dialog open={deployOpen} onOpenChange={setDeployOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy {project?.name}</DialogTitle>
            <DialogDescription>
              One-click hosting isn’t connected in this version. Download the project and deploy it to any static host — the included README has the steps.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployOpen(false)}>Close</Button>
            <Button onClick={() => { download(); setDeployOpen(false); }}><Download className="mr-1.5 size-4" />Download project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IdleCanvas({ onExample }: { onExample: () => void }) {
  return (
    <div className="grid h-full place-items-center rounded-xl border border-dashed bg-grid p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Hammer className="size-6" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">Your preview will appear here</h2>
        <p className="mt-2 text-sm text-muted-foreground">Pick a project type, describe your idea and press Build Project.</p>
        <Button variant="outline" size="sm" className="mt-5" onClick={onExample}>Try an example prompt</Button>
      </div>
    </div>
  );
}

function GeneratingCanvas({ step }: { step: number }) {
  return (
    <div className="grid h-full place-items-center rounded-xl border bg-card p-6">
      <div className="w-full max-w-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-ember">Building your project</p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-ember transition-all duration-500" style={{ width: `${((step + 0.5) / GENERATION_STEPS.length) * 100}%` }} />
        </div>
        <ol className="mt-6 space-y-4">
          {GENERATION_STEPS.map((s, i) => (
            <li key={s.id} className={cn("flex gap-3 transition-opacity", i > step && "opacity-40")}>
              <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border", i < step && "border-success bg-success text-success-foreground", i === step && "border-ember")}>
                {i < step ? <Check className="size-3" /> : i === step ? <Loader2 className="size-3 animate-spin text-ember" /> : null}
              </span>
              <div>
                <p className="text-sm font-medium">{s.label}{i === step && "…"}</p>
                {i < step && <p className="text-xs text-success">✓ {s.done}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ErrorCanvas({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return (
    <div className="grid h-full place-items-center rounded-xl border bg-card p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Something went wrong while creating your project.</h2>
        <p className="mt-1 text-sm text-muted-foreground">Check the activity log for details.</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={onRetry}>Try Again</Button>
          <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-1.5 size-4" />Return to Builder</Button>
        </div>
      </div>
    </div>
  );
}
