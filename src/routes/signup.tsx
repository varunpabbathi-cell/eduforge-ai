import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — EduForge AI" }, { name: "description", content: "Create your free EduForge AI account." }, { property: "og:title", content: "Create account — EduForge AI" }, { property: "og:description", content: "Start turning ideas into projects." }] }),
  component: Signup,
});

function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout title="Create your account" subtitle="Start turning ideas into projects." footer={<>Already have an account? <Link to="/login" className="font-medium text-ember">Sign in</Link></>}>
      <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setError(null); setLoading(true); try { await signUp(f.name, f.email, f.password); navigate({ to: "/dashboard" }); } catch (err) { setError((err as Error).message); } finally { setLoading(false); } }}>
        <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></div>
        <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="new-password" minLength={8} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /><p className="text-xs text-muted-foreground">At least 8 characters.</p></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Create account</Button>
      </form>
    </AuthLayout>
  );
}
