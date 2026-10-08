import { Link, useNavigate } from "@tanstack/react-router";
import { FolderKanban, HelpCircle, LayoutDashboard, LogIn, LogOut, Menu, Hammer, Settings, Wrench } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/builder", label: "AI Builder", icon: Hammer },
  { to: "/projects", label: "My Projects", icon: FolderKanban },
  { to: "/tools", label: "Student Tools", icon: Wrench },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help & Docs", icon: HelpCircle },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          activeProps={{ className: "bg-sidebar-accent !text-foreground font-medium" }}
        >
          <n.icon className="size-4" />
          {n.label}
        </Link>
      ))}
    </nav>
  );
}

function UserBlock() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  if (!user)
    return (
      <Button asChild variant="outline" className="w-full justify-start">
        <Link to="/login">
          <LogIn className="mr-2 size-4" /> Sign in
        </Link>
      </Button>
    );
  return (
    <div className="flex items-center gap-3 rounded-lg p-2">
      <div className="grid size-8 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
        {user.name[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Sign out"
        onClick={() => {
          signOut();
          navigate({ to: "/" });
        }}
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}

export function AppShell({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r bg-sidebar p-4 lg:flex">
        <Logo to="/" className="mb-6 px-2" />
        <NavList />
        <div className="mt-auto space-y-2">
          <UserBlock />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col bg-sidebar p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo className="mb-6 px-2" />
              <NavList onNavigate={() => setOpen(false)} />
              <div className="mt-auto">
                <UserBlock />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="truncate text-base font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
