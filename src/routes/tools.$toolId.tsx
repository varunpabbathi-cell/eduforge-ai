import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Copy, Download, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTool } from "@/data/tools";
import { runTool } from "@/services/ai";
import { downloadText } from "@/lib/download";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/tools/$toolId")({
  loader: ({ params }) => {
    const t = getTool(params.toolId);
    if (!t) throw notFound();
    return { id: t.id, name: t.name, description: t.description };
  },
  head: ({ loaderData }) =>
    loaderData
      ? { meta: [{ title: `${loaderData.name} — EduForge AI` }, { name: "description", content: loaderData.description }, { property: "og:title", content: `${loaderData.name} — EduForge AI` }, { property: "og:description", content: loaderData.description }] }
      : { meta: [{ title: "Tool not found" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <AppShell title="Tool not found"><p className="text-muted-foreground">This tool doesn't exist. <Link to="/tools" className="text-ember underline">See all tools</Link></p></AppShell>
  ),
  component: ToolPage,
});

function ToolPage() {
  const { id } = Route.useLoaderData();
  const tool = getTool(id)!;
  const { recordGeneration } = useProjects();
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<Record<string, string>>(() => Object.fromEntries(tool.options.map((o) => [o.key, o.choices[0] ?? ""])));
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function go() {
    if (input.trim().length < 3) return setError("Please enter a bit more detail.");
    setError(null);
    setLoading(true);
    try {
      setOut(await runTool(tool.id, input.slice(0, 8000), opts));
      recordGeneration();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title={tool.name}>
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground"><tool.icon className="size-5" /></div>
        <div><h2 className="text-2xl font-semibold">{tool.name}</h2><p className="text-sm text-muted-foreground">{tool.description}</p></div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4 rounded-2xl border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="tool-input">{tool.inputLabel}</Label>
            {tool.multiline ? <Textarea id="tool-input" rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool.placeholder} /> : <Input id="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool.placeholder} onKeyDown={(e) => e.key === "Enter" && go()} />}
          </div>
          {tool.options.map((o) => (
            <div key={o.key} className="space-y-2">
              <Label>{o.label}</Label>
              <Select value={opts[o.key] ?? ""} onValueChange={(v) => setOpts({ ...opts, [o.key]: v })}>
                <SelectTrigger aria-label={o.label}><SelectValue /></SelectTrigger>
                <SelectContent>{o.choices.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" onClick={go} disabled={loading}>{loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Wand2 className="mr-2 size-4" />}{loading ? "Generating…" : "Generate"}</Button>
          <p className="text-[11px] text-muted-foreground">Demo mode: results use built-in templates until an AI model is connected.</p>
        </div>
        <div className="flex min-h-80 flex-col rounded-2xl border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="text-sm font-medium">Output</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" disabled={!out} onClick={async () => { await navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>{copied ? <Check className="mr-1 size-3.5" /> : <Copy className="mr-1 size-3.5" />}{copied ? "Copied" : "Copy"}</Button>
              <Button size="sm" variant="ghost" disabled={!out} onClick={() => downloadText(out, `${tool.id}.md`)}><Download className="mr-1 size-3.5" />Download</Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-5">
            {loading ? (
              <div className="space-y-3">{[80, 60, 90, 70, 50].map((w, i) => <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />)}</div>
            ) : out ? (
              <pre className="animate-rise whitespace-pre-wrap font-sans text-sm leading-relaxed">{out}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">Your result will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
