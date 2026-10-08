import { Check, Copy, Download, Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ProjectFile } from "@/types";
import { highlight } from "./highlight";
import { downloadText } from "@/lib/download";
import { Button } from "@/components/ui/button";

export function CodeViewer({ file, onChange }: { file: ProjectFile; onChange?: (content: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(file.content);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(file.content);
    setEditing(false);
  }, [file.path, file.content]);

  const lines = file.content.split("\n");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-code text-code-foreground">
      <div className="flex items-center gap-2 border-b border-code-foreground/10 px-3 py-2">
        <span className="truncate font-mono text-xs">{file.path}</span>
        <div className="ml-auto flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-code-foreground hover:bg-code-foreground/10 hover:text-code-foreground"
            onClick={async () => {
              await navigator.clipboard.writeText(file.content);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span className="ml-1 hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-code-foreground hover:bg-code-foreground/10 hover:text-code-foreground" onClick={() => downloadText(file.content, file.path.split("/").pop()!)}>
            <Download className="size-3.5" />
            <span className="ml-1 hidden sm:inline">Download</span>
          </Button>
          {onChange && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-code-foreground hover:bg-code-foreground/10 hover:text-code-foreground"
              onClick={() => {
                if (editing) {
                  onChange(draft);
                  toast.success("File updated");
                }
                setEditing(!editing);
              }}
            >
              {editing ? <Save className="size-3.5" /> : <Pencil className="size-3.5" />}
              <span className="ml-1 hidden sm:inline">{editing ? "Apply" : "Edit"}</span>
            </Button>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          aria-label={`Edit ${file.path}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          className="flex-1 resize-none bg-transparent p-4 font-mono text-[12.5px] leading-relaxed outline-none"
        />
      ) : (
        <pre className="flex-1 overflow-auto py-3 font-mono text-[12.5px] leading-relaxed">
          <code className="grid grid-cols-[auto_1fr]">
            {lines.map((l, i) => (
              <span key={i} className="contents">
                <span className="select-none pr-4 pl-4 text-right text-tok-comment/70">{i + 1}</span>
                <span className="pr-4 whitespace-pre">{highlight(l)}</span>
              </span>
            ))}
          </code>
        </pre>
      )}
    </div>
  );
}
