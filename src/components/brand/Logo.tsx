import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path d="M8 12h16l-3 4h-4v6h4v2H11v-2h4v-6h-4z" className="fill-primary-foreground" />
      <circle cx="23.5" cy="8.5" r="2.5" className="fill-ember" />
    </svg>
  );
}

export function Logo({ className, to = "/" }: { className?: string; to?: "/" | "/dashboard" }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2 font-display text-[17px] font-semibold tracking-tight", className)}>
      <LogoMark />
      <span>
        EduForge <span className="text-ember">AI</span>
      </span>
    </Link>
  );
}
