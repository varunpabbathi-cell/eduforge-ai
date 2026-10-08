import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — EduForge AI" }, { name: "description", content: "Sign in to EduForge AI." }, { property: "og:title", content: "Sign in — EduForge AI" }, { property: "og:description", content: "Access your projects and tools." }] }),
  component: Login,
});

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue building." footer={<>New here? <Link to="/signup" className="font-medium text-ember">Create an account</Link></>}>
      <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setError(null); setLoading(true); try { await signIn(email, password); navigate({ to: "/dashboard" }); } catch (err) { setError((err as Error).message); } finally { setLoading(false); } }}>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="space-y-2">
          <div className="flex justify-between"><Label htmlFor="password">Password</Label><Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link></div>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Sign in</Button>
      </form>
    </AuthLayout>
  );
}
