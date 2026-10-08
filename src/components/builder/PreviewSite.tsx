import type { ProjectPlan } from "@/types";
import { cn } from "@/lib/utils";

/** Renders a live, clickable approximation of the generated project from its plan. */
export function PreviewSite({ plan, page, onNavigate, compact }: { plan: ProjectPlan; page: string; onNavigate: (slug: string) => void; compact: boolean }) {
  const current = plan.pages.find((p) => p.slug === page) ?? plan.pages[0];
  if (!current) return null;
  const sample = (plan.entities[0] ?? "Record").replace(/s$/, "");
  return (
    <div className="min-h-full bg-card text-card-foreground">
      <header className="flex items-center justify-between border-b px-5 py-3">
        <span className="font-display text-sm font-semibold">{plan.name}</span>
        <nav className={cn("flex gap-4 text-xs", compact && "gap-2")}>
          {plan.pages.slice(0, compact ? 3 : 6).map((p) => (
            <button
              key={p.slug}
              onClick={() => onNavigate(p.slug)}
              className={cn("text-muted-foreground hover:text-foreground", p.slug === current.slug && "font-semibold text-foreground")}
            >
              {p.name}
            </button>
          ))}
        </nav>
      </header>

      <div key={current.slug} className="animate-rise p-6">
        {current.kind === "home" && (
          <div>
            <div className="rounded-xl bg-surface p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-ember">Welcome</p>
              <h2 className={cn("mt-2 font-semibold", compact ? "text-2xl" : "text-4xl")}>{plan.name}</h2>
              <p className="mt-3 max-w-lg text-sm text-muted-foreground">{plan.summary}</p>
              <div className="mt-5 flex gap-2">
                <button onClick={() => onNavigate(plan.pages[1]?.slug ?? "home")} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
                  Get started
                </button>
                <button className="rounded-md border px-4 py-2 text-xs">Learn more</button>
              </div>
            </div>
            <div className={cn("mt-5 grid gap-3", compact ? "grid-cols-1" : "grid-cols-3")}>
              {plan.features.slice(0, 3).map((f) => (
                <div key={f} className="rounded-lg border p-4">
                  <div className="mb-2 size-6 rounded-md bg-accent" />
                  <p className="text-sm font-medium">{f}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Built into {plan.name}.</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {current.kind === "auth" && (
          <div className="mx-auto max-w-xs space-y-3 py-6">
            <h2 className="text-xl font-semibold">Sign in</h2>
            <div className="flex gap-2 text-xs">
              {(plan.entities.includes("Teachers") ? ["Student", "Teacher"] : ["User", "Admin"]).map((r, i) => (
                <span key={r} className={cn("rounded-full border px-3 py-1", i === 0 && "bg-primary text-primary-foreground")}>{r}</span>
              ))}
            </div>
            <div className="h-9 rounded-md border bg-background px-3 text-xs leading-9 text-muted-foreground">email@college.edu</div>
            <div className="h-9 rounded-md border bg-background px-3 text-xs leading-9 text-muted-foreground">••••••••</div>
            <button className="h-9 w-full rounded-md bg-primary text-xs font-medium text-primary-foreground">Sign in</button>
          </div>
        )}

        {current.kind === "dashboard" && (
          <div>
            <h2 className="text-xl font-semibold">{current.name}</h2>
            <div className={cn("mt-4 grid gap-3", compact ? "grid-cols-2" : "grid-cols-4")}>
              {["Total", "This week", "Pending", "Completed"].map((l, i) => (
                <div key={l} className="rounded-lg border p-3">
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                  <p className="mt-1 text-xl font-semibold">{[128, 24, 7, 97][i]}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-32 items-end gap-2 rounded-lg border p-4">
              {[40, 65, 50, 80, 60, 90, 72].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-ember/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        )}

        {current.kind === "table" && (
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{current.name}</h2>
              <button className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">+ Add {sample}</button>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border text-xs">
              <div className="grid grid-cols-3 bg-surface px-3 py-2 font-medium"><span>Name</span><span>Status</span><span>Updated</span></div>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="grid grid-cols-3 border-t px-3 py-2">
                  <span>{sample} {n}</span>
                  <span className={n % 2 ? "text-success" : "text-ember"}>{n % 2 ? "Active" : "Pending"}</span>
                  <span className="text-muted-foreground">{n}d ago</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {current.kind === "form" && (
          <div className="mx-auto max-w-sm space-y-3 py-4">
            <h2 className="text-xl font-semibold">{current.name}</h2>
            {["Full name", "Email", "Message"].map((f) => (
              <div key={f} className={cn("rounded-md border bg-background px-3 text-xs text-muted-foreground", f === "Message" ? "h-20 pt-2" : "h-9 leading-9")}>{f}</div>
            ))}
            <button className="h-9 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground">Submit</button>
          </div>
        )}

        {current.kind === "content" && (
          <div className="max-w-xl space-y-3">
            <h2 className="text-2xl font-semibold">{current.name}</h2>
            <p className="text-sm text-muted-foreground">{plan.summary}</p>
            <div className={cn("grid gap-3", compact ? "grid-cols-1" : "grid-cols-2")}>
              {[1, 2].map((n) => (
                <div key={n} className="rounded-lg border p-3">
                  <div className="mb-2 h-16 rounded bg-surface" />
                  <p className="text-sm font-medium">Item {n}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
