import { createFileRoute, Link } from "@tanstack/react-router";
import { Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useTheme, type ThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — EduForge AI" }, { name: "description", content: "Manage your profile, appearance, notifications and security." }, { property: "og:title", content: "Settings — EduForge AI" }, { property: "og:description", content: "Account and app preferences." }] }),
  component: Settings,
});

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-card p-6"><h3 className="font-semibold">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function Settings() {
  const { user, updateProfile } = useAuth();
  const { mode, setMode } = useTheme();
  const [name, setName] = useState("");
  useEffect(() => setName(user?.name ?? ""), [user?.name]);
  return (
    <AppShell title="Settings">
      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          {["profile", "account", "appearance", "notifications", "security"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card title="Profile">
            {user ? (
              <form className="max-w-sm space-y-4" onSubmit={(e) => { e.preventDefault(); if (name.trim().length < 2) { toast.error("Enter your name"); return; } updateProfile({ name: name.trim() }); toast.success("Profile updated"); }}>
                <div className="space-y-2"><Label htmlFor="name">Display name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <Button>Save changes</Button>
              </form>
            ) : <p className="text-sm text-muted-foreground"><Link to="/login" className="text-ember underline">Sign in</Link> to edit your profile.</p>}
          </Card>
        </TabsContent>
        <TabsContent value="account" className="mt-6"><Card title="Account"><p className="text-sm text-muted-foreground">Email: {user?.email ?? "Not signed in"}</p></Card></TabsContent>
        <TabsContent value="appearance" className="mt-6">
          <Card title="Appearance">
            <div className="grid max-w-md grid-cols-3 gap-2">
              {([["light", Sun], ["dark", Moon], ["system", Laptop]] as const).map(([m, Icon]) => (
                <button key={m} onClick={() => setMode(m as ThemeMode)} aria-pressed={mode === m} className={cn("flex flex-col items-center gap-2 rounded-xl border p-4 text-sm capitalize", mode === m && "border-ember bg-accent text-accent-foreground")}><Icon className="size-5" />{m}</button>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <Card title="Notifications">
            {["Project ready emails", "Product updates", "Weekly study digest"].map((n, i) => (
              <div key={n} className="flex items-center justify-between"><Label htmlFor={`n${i}`}>{n}</Label><Switch id={`n${i}`} defaultChecked={i === 0} /></div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <Card title="Security">
            <p className="text-sm text-muted-foreground">Passwords are never stored by this app. Password changes will be handled by the authentication service once connected.</p>
            <Button variant="outline" asChild><Link to="/forgot-password">Reset password</Link></Button>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
