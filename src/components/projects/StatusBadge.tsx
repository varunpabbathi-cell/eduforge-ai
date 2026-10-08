import type { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        status === "Ready" && "border-success/30 text-success",
        status === "Deployed" && "border-ember/30 text-ember",
        status === "Draft" && "text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full bg-current")} />
      {status}
    </span>
  );
}
