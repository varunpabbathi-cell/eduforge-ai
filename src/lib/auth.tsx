/**
 * Demo auth provider.
 *
 * Keeps only a non-sensitive profile (name + email) in localStorage to simulate
 * a session — passwords are validated for shape and then discarded, never
 * stored. Swap the bodies of signIn/signUp/resetPassword/signOut for your auth
 * backend (e.g. Lovable Cloud) without changing any page.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";

const KEY = "eduforge-session";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface AuthCtx {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "name">>) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore corrupt session */
    }
    setReady(true);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const value: AuthCtx = {
    user,
    ready,
    async signIn(email, password) {
      if (!emailOk(email)) throw new Error("Enter a valid email address.");
      if (password.length < 8) throw new Error("Password must be at least 8 characters.");
      await wait(700);
      const name = (email.split("@")[0] ?? "user").replace(/[._-]+/g, " ");
      persist({ id: crypto.randomUUID(), email: email.trim(), name: name.charAt(0).toUpperCase() + name.slice(1) });
    },
    async signUp(name, email, password) {
      if (name.trim().length < 2) throw new Error("Enter your name.");
      if (!emailOk(email)) throw new Error("Enter a valid email address.");
      if (password.length < 8) throw new Error("Password must be at least 8 characters.");
      await wait(800);
      persist({ id: crypto.randomUUID(), email: email.trim(), name: name.trim() });
    },
    async resetPassword(email) {
      if (!emailOk(email)) throw new Error("Enter a valid email address.");
      await wait(700);
    },
    updateProfile(patch) {
      if (user) persist({ ...user, ...patch });
    },
    signOut() {
      persist(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
