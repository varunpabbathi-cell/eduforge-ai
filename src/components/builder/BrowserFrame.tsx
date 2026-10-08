import { Laptop, Lock, RefreshCw, Smartphone, Tablet } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Device = "desktop" | "tablet" | "mobile";
const WIDTH: Record<Device, string> = { desktop: "100%", tablet: "768px", mobile: "390px" };

export function BrowserFrame({ url, device, onDevice, children }: { url: string; device: Device; onDevice: (d: Device) => void; children: ReactNode }) {
  const [nonce, setNonce] = useState(0);
  const [spinning, setSpinning] = useState(false);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b bg-card px-3 py-2">
        <div className="hidden gap-1.5 sm:flex">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-ember/60" />
          <span className="size-2.5 rounded-full bg-success/60" />
        </div>
        <button
          aria-label="Refresh preview"
          onClick={() => {
            setSpinning(true);
            setTimeout(() => {
              setNonce((n) => n + 1);
              setSpinning(false);
            }, 450);
          }}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RefreshCw className={cn("size-3.5", spinning && "animate-spin")} />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
          <Lock className="size-3 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
        <div className="flex rounded-md border p-0.5" role="group" aria-label="Device">
          {([["desktop", Laptop], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
            <button
              key={d}
              aria-label={`${d} preview`}
              aria-pressed={device === d}
              onClick={() => onDevice(d)}
              className={cn("rounded px-1.5 py-1 text-muted-foreground", device === d && "bg-accent text-accent-foreground")}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-grid p-3">
        <div key={nonce} className={cn("mx-auto h-full overflow-auto rounded-lg border bg-card shadow-sm transition-[max-width] duration-300", spinning && "opacity-50")} style={{ maxWidth: WIDTH[device] }}>
          {children}
        </div>
      </div>
    </div>
  );
}
