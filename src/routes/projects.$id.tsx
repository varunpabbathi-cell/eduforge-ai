import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { CopyPlus, Download, Eye, FolderOpen, FolderX, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ConfirmDelete } from "@/components/projects/ConfirmDelete";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { downloadProjectZip } from "@/lib/download";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/projects/$id")({
  head: () => ({
    meta: [
      { title: "Project — EduForge AI" },
      { name: "description", content: "Project details, files and actions." },
      { property: "og:title", content: "Project — EduForge AI" },
      { property: "og:description", content: "Open, preview, duplicate or download this project." },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { id } = Route.useParams();
  const { get, remove, duplicate } = useProjects();
  const navigate = useNavigate();
  const p = get(id);
  if (!p)
    return (
      <AppShell title="Project">
        <EmptyState icon={FolderX} title="Project not found" body="It may have been deleted." action={<Button asChild><Link to="/projects">Back to My Projects</Link></Button>} />
      </AppShell>
    );
  const meta = [
    ["Project type", p.type],
    ["Created", format(new Date(p.createdAt), "PP")],
    ["Last modified", format(new Date(p.updatedAt), "PP")],
    ["Files", String(p.files.length)],
  ];
  return (
    <AppShell title={p.name}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3"><h2 className="text-2xl font-semibold">{p.name}</h2><StatusBadge status={p.status} /></div>
          <p className="mt-2 max-w-2xl text-muted-foreground">{p.description}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => navigate({ to: "/builder", search: { project: p.id } })}><FolderOpen className="mr-1.5 size-4" />Open</Button>
        <Button variant="outline" onClick={() => navigate({ to: "/builder", search: { project: p.id, view: "preview" } })}><Eye className="mr-1.5 size-4" />Preview</Button>
        <Button variant="outline" onClick={() => navigate({ to: "/builder", search: { project: p.id, view: "code" } })}><Pencil className="mr-1.5 size-4" />Edit</Button>
        <Button variant="outline" onClick={() => { const c = duplicate(p.id); if (c) { toast.success("Project duplicated"); navigate({ to: "/projects/$id", params: { id: c.id } }); } }}><CopyPlus className="mr-1.5 size-4" />Duplicate</Button>
        <Button variant="outline" onClick={() => downloadProjectZip(p)}><Download className="mr-1.5 size-4" />Download</Button>
        <ConfirmDelete name={p.name} onConfirm={() => { remove(p.id); toast.success("Project deleted"); navigate({ to: "/projects" }); }}>
          <Button variant="outline" className="text-destructive"><Trash2 className="mr-1.5 size-4" />Delete</Button>
        </ConfirmDelete>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {meta.map(([k, v]) => <div key={k} className="rounded-xl border bg-card p-4"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-medium" suppressHydrationWarning>{v}</dd></div>)}
      </dl>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5"><h3 className="font-semibold">Pages</h3><ul className="mt-3 space-y-1 text-sm text-muted-foreground">{p.plan.pages.map((x) => <li key={x.slug}>{x.name}</li>)}</ul></div>
        <div className="rounded-2xl border bg-card p-5"><h3 className="font-semibold">Original prompt</h3><p className="mt-3 text-sm text-muted-foreground">{p.prompt}</p></div>
      </div>
    </AppShell>
  );
}
