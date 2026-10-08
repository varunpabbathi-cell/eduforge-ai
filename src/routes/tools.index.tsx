import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TOOLS } from "@/data/tools";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Student AI Tools — EduForge AI" },
      { name: "description", content: "Study assistant, notes summarizer, question papers, MCQs, reports, presentations and more." },
      { property: "og:title", content: "Student AI Tools — EduForge AI" },
      { property: "og:description", content: "Ten AI tools built for students." },
    ],
  }),
  component: Tools,
});

function Tools() {
  return (
    <AppShell title="Student AI Tools">
      <h2 className="text-2xl font-semibold">Student AI Tools</h2>
      <p className="mt-1 text-sm text-muted-foreground">Everyday help for studying, exams and projects.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.id} to="/tools/$toolId" params={{ toolId: t.id }} className="group flex flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground"><t.icon className="size-5" /></div>
            <h3 className="mt-4 font-semibold">{t.name}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-ember">Open Tool <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
