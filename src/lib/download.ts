import type { Project } from "@/types";

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(content: string, filename: string) {
  save(new Blob([content], { type: "text/plain;charset=utf-8" }), filename);
}

export async function downloadProjectZip(project: Project) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const root = zip.folder(slugify(project.name))!;
  for (const f of project.files) root.file(f.path, f.content);
  save(await zip.generateAsync({ type: "blob" }), `${slugify(project.name)}.zip`);
}
