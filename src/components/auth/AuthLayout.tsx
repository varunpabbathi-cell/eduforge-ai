import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 ember-glow" />
      <div className="relative w-full max-w-sm">
        <Logo className="justify-center" />
        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}
