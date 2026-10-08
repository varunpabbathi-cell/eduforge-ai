import type { ReactNode } from "react";

const RE =
  /(\/\/.*$|--.*$|#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*)|\b(import|from|export|default|function|return|const|let|if|else|for|new|throw|interface|type|create|table|alter|enable|primary|key|not|null|references|true|false)\b|\b(\d+)\b/gm;

/** Tiny regex highlighter — good enough for display, no dependency. */
export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of code.matchAll(RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(code.slice(last, idx));
    const cls = m[1] ? "text-tok-comment italic" : m[2] ? "text-tok-string" : m[3] ? "text-tok-tag" : m[4] ? "text-tok-keyword" : "text-tok-number";
    out.push(
      <span key={i++} className={cls}>
        {m[0]}
      </span>,
    );
    last = idx + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
