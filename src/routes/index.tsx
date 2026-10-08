import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Code2, Download, Eye, Globe, AppWindow, Hammer, MessageSquareText, Rocket } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/data/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduForge AI — Build Websites, Apps & Projects With AI" },
      { name: "description", content: "Describe your idea in simple words and let EduForge AI help turn it into a real project." },
      { property: "og:title", content: "EduForge AI — Turn Your Ideas Into Working Projects" },
      { property: "og:description", content: "Plan, generate, preview and download websites, apps and student projects from one prompt." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { name: "AI Website Builder", icon: Globe, desc: "Multi-page websites from a single description.", to: "/builder" as const },
  { name: "AI App Builder", icon: AppWindow, desc: "Web apps with logins, dashboards and data.", to: "/builder" as const },
  ...TOOLS.filter((t) => ["final-year-project", "coding-assistant", "study-assistant", "question-paper", "notes-summarizer", "report-generator", "ppt-generator", "resume-builder"].includes(t.id)).map((t) => ({ name: t.short, icon: t.icon, desc: t.description, toolId: t.id })),
];

const STEPS = [
  { t: "Describe", d: "Explain what you want in plain words.", icon: MessageSquareText },
  { t: "Generate", d: "AI plans the project and builds the structure.", icon: Hammer },
  { t: "Preview", d: "See the result in a live, clickable preview.", icon: Eye },
  { t: "Export", d: "Save, download or deploy your project.", icon: Download },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Logo />
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/builder" className="hover:text-foreground">Builder</Link>
            <Link to="/tools" className="hover:text-foreground">Student Tools</Link>
            <Link to="/help" className="hover:text-foreground">Docs</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm"><Link to="/builder">Start Building</Link></Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 ember-glow" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-ember" /> Turn Your Ideas Into Working Projects
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Build Websites, Apps &amp; Projects <span className="text-ember">With AI</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">Describe your idea in simple words and let EduForge AI help turn it into a real project.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/builder">Start Building <ArrowRight className="ml-1.5 size-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/tools">Explore AI Tools</Link></Button>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold">Everything you need to create</h2>
        <p className="mt-2 text-muted-foreground">From full projects to everyday study help.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {FEATURES.map((f) => (
            <div key={f.name} className="flex flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground"><f.icon className="size-5" /></div>
              <h3 className="mt-4 font-semibold">{f.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{f.desc}</p>
              {"toolId" in f ? (
                <Link to="/tools/$toolId" params={{ toolId: f.toolId }} className="mt-4 inline-flex items-center text-sm font-medium text-ember hover:underline">Open Tool <ArrowRight className="ml-1 size-3.5" /></Link>
              ) : (
                <Link to={f.to} className="mt-4 inline-flex items-center text-sm font-medium text-ember hover:underline">Open Tool <ArrowRight className="ml-1 size-3.5" /></Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-semibold">How it works</h2>
          <ol className="relative mt-12 grid gap-8 md:grid-cols-4">
            <div className="absolute left-5 top-5 hidden h-px w-[calc(100%-40px)] bg-border md:block" />
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative">
                <div className="relative grid size-10 place-items-center rounded-full border bg-card text-ember"><s.icon className="size-4" /></div>
                <p className="mt-4 font-mono text-xs text-muted-foreground">0{i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">Your next project starts with a sentence.</h2>
        <Button asChild size="lg" className="mt-8"><Link to="/builder"><Rocket className="mr-2 size-4" />Start Building</Link></Button>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo />
          <div className="flex gap-6"><Link to="/help">Docs</Link><Link to="/tools">Tools</Link><Link to="/dashboard">Dashboard</Link></div>
        </div>
      </footer>
    </div>
  );
}

function HeroPreview() {
  const steps = ["Planning project", "Creating pages", "Creating components", "Creating database structure", "Preparing preview"];
  return (
    <div className="animate-rise rounded-2xl border bg-card p-2 shadow-xl [animation-delay:120ms]">
      <div className="flex items-center gap-1.5 border-b px-3 py-2">
        <span className="size-2.5 rounded-full bg-destructive/60" /><span className="size-2.5 rounded-full bg-ember/60" /><span className="size-2.5 rounded-full bg-success/60" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">eduforge.app/builder</span>
      </div>
      <div className="space-y-4 p-4">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">Create a student attendance management system.</div>
        <div className="rounded-xl border bg-surface p-4">
          <ul className="space-y-2 text-sm">
            {steps.map((s) => (<li key={s} className="flex items-center gap-2"><Check className="size-4 text-success" />{s}</li>))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-lg border bg-card p-3">
            <div><p className="text-sm font-semibold">Project Ready</p><p className="text-xs text-muted-foreground">5 pages · 12 files</p></div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline"><Link to="/builder" search={{ project: "demo-attendance", view: "preview" }}><Eye className="mr-1 size-3.5" />Preview</Link></Button>
              <Button asChild size="sm"><Link to="/builder" search={{ project: "demo-attendance" }}><Code2 className="mr-1 size-3.5" />Edit Project</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
