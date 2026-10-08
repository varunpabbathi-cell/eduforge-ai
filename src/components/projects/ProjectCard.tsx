import { Link, useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Download, Eye, FolderOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { downloadProjectZip } from "@/lib/download";
import { ConfirmDelete } from "./ConfirmDelete";

export function ProjectCard({ project, onDelete }: { project: Project; onDelete: () => void }) {
  const navigate = useNavigate();
  return (
    <article className="group flex flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/projects/$id" params={{ id: project.id }} className="block truncate font-display text-base font-semibold hover:text-ember">
            {project.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">{project.type}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      <p className="mt-4 text-xs text-muted-foreground" suppressHydrationWarning>
        Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-4">
        <Button size="sm" onClick={() => navigate({ to: "/builder", search: { project: project.id } })}>
          <FolderOpen className="mr-1 size-3.5" /> Open
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: "/builder", search: { project: project.id, view: "preview" } })}>
          <Eye className="mr-1 size-3.5" /> Preview
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Download"
          onClick={async () => {
            await downloadProjectZip(project);
            toast.success("Download started");
          }}
        >
          <Download className="size-3.5" />
        </Button>
        <ConfirmDelete name={project.name} onConfirm={onDelete}>
          <Button size="sm" variant="ghost" aria-label="Delete" className="ml-auto text-muted-foreground hover:text-destructive">
            <Trash2 className="size-3.5" />
          </Button>
        </ConfirmDelete>
      </div>
    </article>
  );
}
