import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Plus, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/lib/projects-store";
import { PROJECT_TYPES } from "@/types";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "My Projects — EduForge AI" },
      { name: "description", content: "Search, filter and manage every project you've built with EduForge AI." },
      { property: "og:title", content: "My Projects — EduForge AI" },
      { property: "og:description", content: "All your generated projects in one place." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { projects, remove } = useProjects();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("updated");
  const list = useMemo(() => {
    const r = projects.filter((p) => (type === "all" || p.type === type) && p.name.toLowerCase().includes(q.toLowerCase()));
    return r.sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "created" ? b.createdAt.localeCompare(a.createdAt) : b.updatedAt.localeCompare(a.updatedAt)));
  }, [projects, q, type, sort]);
  const newBtn = <Button asChild size="sm"><Link to="/builder"><Plus className="mr-1 size-4" />New project</Link></Button>;
  return (
    <AppShell title="My Projects" actions={newBtn}>
      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="You haven't created a project yet." body="Describe an idea in the AI Builder and it will show up here." action={<Button asChild><Link to="/builder">Create Your First Project</Link></Button>} />
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="pl-9" aria-label="Search projects" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="sm:w-44" aria-label="Filter by type"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All types</SelectItem>{PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="sm:w-44" aria-label="Sort"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="updated">Last updated</SelectItem><SelectItem value="created">Newest</SelectItem><SelectItem value="name">Name</SelectItem></SelectContent>
            </Select>
          </div>
          {list.length === 0 ? (
            <div className="mt-6"><EmptyState icon={SearchX} title="No results" body="Try a different search or filter." /></div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map((p) => <ProjectCard key={p.id} project={p} onDelete={() => remove(p.id)} />)}</div>
          )}
        </>
      )}
    </AppShell>
  );
}
