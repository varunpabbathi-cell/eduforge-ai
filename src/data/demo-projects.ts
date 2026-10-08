import type { Project, ProjectType, ProjectStatus } from "@/types";
import { planProject } from "@/services/ai";
import { buildFiles } from "@/services/codegen";

const seeds: { id: string; prompt: string; type: ProjectType; status: ProjectStatus; created: string; updated: string }[] = [
  { id: "demo-attendance", prompt: "Create a college attendance system with student login, teacher login, attendance records, dashboard and reports.", type: "Web App", status: "Ready", created: "2026-09-02", updated: "2026-10-05" },
  { id: "demo-portfolio", prompt: "Create a student portfolio with about page, projects showcase and contact form.", type: "Portfolio", status: "Deployed", created: "2026-08-21", updated: "2026-10-01" },
  { id: "demo-events", prompt: "Create a college event management website with student registration, event listings, admin dashboard and notifications.", type: "Website", status: "Ready", created: "2026-09-14", updated: "2026-09-30" },
  { id: "demo-resume", prompt: "Build an AI resume builder with login, resume editor and PDF export.", type: "AI Tool", status: "Draft", created: "2026-09-25", updated: "2026-09-28" },
  { id: "demo-library", prompt: "Create a library management system with book catalog, member login, dashboard and overdue reminders.", type: "Student Project", status: "Ready", created: "2026-07-30", updated: "2026-09-18" },
  { id: "demo-quiz", prompt: "Build an online quiz platform with quizzes, student login, results dashboard and reports.", type: "Web App", status: "Draft", created: "2026-09-10", updated: "2026-09-12" },
];

export function demoProjects(): Project[] {
  return seeds.map((s) => {
    const plan = planProject(s.prompt, s.type);
    return {
      id: s.id,
      name: plan.name,
      description: plan.summary,
      prompt: s.prompt,
      type: s.type,
      status: s.status,
      createdAt: new Date(s.created).toISOString(),
      updatedAt: new Date(s.updated).toISOString(),
      plan,
      files: buildFiles(plan),
    };
  });
}
