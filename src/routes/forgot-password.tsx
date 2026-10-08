import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — EduForge AI" }, { name: "description", content: "Reset your EduForge AI password." }, { property: "og:title", content: "Reset password — EduForge AI" }, { property: "og:description", content: "Get a password reset link." }] }),
  component: Forgot,
});

function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a reset link." footer={<Link to="/login" className="font-medium text-ember">Back to sign in</Link>}>
      {sent ? (
        <div className="flex gap-3 rounded-lg bg-surface p-4 text-sm"><CheckCircle2 className="size-5 shrink-0 text-success" />If an account exists for {email}, a reset link is on its way. (Email sending is simulated in demo mode.)</div>
      ) : (
        <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setError(null); setLoading(true); try { await resetPassword(email); setSent(true); } catch (err) { setError((err as Error).message); } finally { setLoading(false); } }}>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
