/**
 * Project repository. Persists to localStorage in demo mode; replace the
 * load/save functions with database calls (projects + project_files tables)
 * when a backend is connected.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Project } from "@/types";
import { demoProjects } from "@/data/demo-projects";

const KEY = "eduforge-projects";
const STATS_KEY = "eduforge-generations";

interface Store {
  projects: Project[];
  generations: number;
  get: (id: string) => Project | undefined;
  upsert: (p: Project) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => Project | undefined;
  recordGeneration: () => void;
}

const Ctx = createContext<Store | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => demoProjects());
  const [generations, setGenerations] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProjects(JSON.parse(raw));
      setGenerations(Number(localStorage.getItem(STATS_KEY) ?? 0));
    } catch {
      /* fall back to demo data */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(projects));
  }, [projects, loaded]);

  const upsert = useCallback((p: Project) => {
    setProjects((list) => {
      const i = list.findIndex((x) => x.id === p.id);
      if (i === -1) return [p, ...list];
      const next = [...list];
      next[i] = p;
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => setProjects((l) => l.filter((p) => p.id !== id)), []);

  const value = useMemo<Store>(
    () => ({
      projects,
      generations,
      get: (id) => projects.find((p) => p.id === id),
      upsert,
      remove,
      duplicate: (id) => {
        const src = projects.find((p) => p.id === id);
        if (!src) return;
        const now = new Date().toISOString();
        const copy = { ...src, id: crypto.randomUUID(), name: `${src.name} (copy)`, status: "Draft" as const, createdAt: now, updatedAt: now };
        upsert(copy);
        return copy;
      },
      recordGeneration: () =>
        setGenerations((g) => {
          localStorage.setItem(STATS_KEY, String(g + 1));
          return g + 1;
        }),
    }),
    [projects, generations, upsert, remove],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProjects() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProjects must be used inside ProjectsProvider");
  return c;
}
