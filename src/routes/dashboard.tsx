import { createFileRoute, Link } from "@tanstack/react-router";
import { AppWindow, BookOpen, FolderKanban, Globe, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EduForge AI" },
      { name: "description", content: "Your projects, AI generations and quick actions in one place." },
      { property: "og:title", content: "Dashboard — EduForge AI" },
      { property: "og:description", content: "Track your projects and start something new." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { projects, generations, remove } = useProjects();
  const month = new Date().toISOString().slice(0, 7);
  const stats = [
    { label: "Projects Created", value: projects.length },
    { label: "Projects This Month", value: projects.filter((p) => p.createdAt.startsWith(month)).length },
    { label: "AI Generations", value: generations },
    { label: "Saved Projects", value: projects.filter((p) => p.status !== "Draft").length },
  ];
  const quick = [
    { label: "Create Website", icon: Globe, toolId: null },
    { label: "Create App", icon: AppWindow, toolId: null },
    { label: "Generate Study Material", icon: BookOpen, toolId: "study-assistant" },
    { label: "Generate Project", icon: GraduationCap, toolId: "final-year-project" },
  ];
  return (
    <AppShell title="Dashboard">
      <h2 className="text-2xl font-semibold">Welcome back{user ? `, ${user.name}` : ""}</h2>
      <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off or start something new.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold" suppressHydrationWarning>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quick.map((q) => (
          q.toolId ? (
            <Link key={q.label} to="/tools/$toolId" params={{ toolId: q.toolId }} className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-sm font-medium transition-colors hover:border-ember/40">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground"><q.icon className="size-4" /></span>{q.label}
            </Link>
          ) : (
            <Link key={q.label} to="/builder" className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-sm font-medium transition-colors hover:border-ember/40">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground"><q.icon className="size-4" /></span>{q.label}
            </Link>
          )
        ))}
      </div>
      <div className="mt-10 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <Button asChild variant="ghost" size="sm"><Link to="/projects"><FolderKanban className="mr-1.5 size-4" />View all</Link></Button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3).map((p) => (
          <ProjectCard key={p.id} project={p} onDelete={() => remove(p.id)} />
        ))}
      </div>
    </AppShell>
  );
}
