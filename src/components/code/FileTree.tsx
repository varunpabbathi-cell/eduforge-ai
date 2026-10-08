import { ChevronRight, FileCode2, FileText, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProjectFile } from "@/types";
import { cn } from "@/lib/utils";

interface Node {
  name: string;
  path: string;
  children?: Node[] | undefined;
}

function build(files: ProjectFile[]): Node[] {
  const root: Node = { name: "", path: "", children: [] };
  for (const f of files) {
    const parts = f.path.split("/");
    let cur = root;
    parts.forEach((part, i) => {
      const path = parts.slice(0, i + 1).join("/");
      let next = cur.children!.find((c) => c.name === part);
      if (!next) {
        next = { name: part, path, children: i < parts.length - 1 ? [] : undefined };
        cur.children!.push(next);
      }
      cur = next;
    });
  }
  const sort = (n: Node[]): Node[] =>
    n.sort((a, b) => (!!b.children === !!a.children ? a.name.localeCompare(b.name) : a.children ? -1 : 1)).map((x) => (x.children ? { ...x, children: sort(x.children) } : x));
  return sort(root.children!);
}

export function FileTree({ files, active, onSelect }: { files: ProjectFile[]; active?: string | undefined; onSelect: (path: string) => void }) {
  const tree = useMemo(() => build(files), [files]);
  const [closed, setClosed] = useState<Set<string>>(new Set());

  const render = (nodes: Node[], depth: number) =>
    nodes.map((n) =>
      n.children ? (
        <div key={n.path}>
          <button
            onClick={() => setClosed((s) => { const x = new Set(s); x.has(n.path) ? x.delete(n.path) : x.add(n.path); return x; })}
            className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[13px] hover:bg-muted"
            style={{ paddingLeft: 6 + depth * 12 }}
          >
            <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", !closed.has(n.path) && "rotate-90")} />
            <Folder className="size-3.5 text-ember" />
            {n.name}
          </button>
          {!closed.has(n.path) && render(n.children, depth + 1)}
        </div>
      ) : (
        <button
          key={n.path}
          onClick={() => onSelect(n.path)}
          className={cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground", active === n.path && "bg-accent text-accent-foreground")}
          style={{ paddingLeft: 22 + depth * 12 }}
        >
          {/\.(tsx?|sql|json)$/.test(n.name) ? <FileCode2 className="size-3.5" /> : <FileText className="size-3.5" />}
          <span className="truncate">{n.name}</span>
        </button>
      ),
    );

  return <div className="space-y-px">{render(tree, 0)}</div>;
}
