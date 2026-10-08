/**
 * AI service layer.
 *
 * Everything here is a MOCK that runs in the browser so the product flow can be
 * designed end to end. The function signatures match what a real server-side
 * AI endpoint should return (structured plan + files), so connecting a real
 * model means replacing these bodies with calls to a server function — never
 * call an AI provider directly from the browser.
 */
import type { GenerationStep, Project, ProjectFile, ProjectPage, ProjectPlan, ProjectType } from "@/types";
import { buildFiles } from "@/services/codegen";

export const AI_MODE = "demo" as const;

export const GENERATION_STEPS: GenerationStep[] = [
  { id: "analyze", label: "Analyzing request", done: "Understanding requirements" },
  { id: "plan", label: "Planning project", done: "Creating architecture" },
  { id: "ui", label: "Generating UI", done: "Creating components" },
  { id: "files", label: "Preparing project", done: "Creating files" },
  { id: "final", label: "Finalizing", done: "Project ready" },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const titleCase = (s: string) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.toLowerCase() === "ai" ? "AI" : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");

function extractName(prompt: string): string {
  const cleaned = prompt
    .replace(/^(please\s+)?(create|build|make|generate|design)\s+(me\s+)?(a|an|the)?\s*/i, "")
    .split(/\s+(with|that|for|which|including)\s+|[,.]/i)[0]
    ?.trim() ?? "";
  const words = cleaned.split(/\s+/).slice(0, 5).join(" ");
  return titleCase(words || "Untitled Project");
}

const RULES: { match: RegExp; page?: Omit<ProjectPage, "slug">; feature?: string; entity?: string }[] = [
  { match: /login|sign ?in|auth|account/i, page: { name: "Login", kind: "auth" }, feature: "Secure authentication" },
  { match: /dashboard|admin/i, page: { name: "Dashboard", kind: "dashboard" }, feature: "Role-based dashboard" },
  { match: /attendance/i, page: { name: "Attendance", kind: "table", entity: "Attendance" }, entity: "Attendance" },
  { match: /student/i, entity: "Students" },
  { match: /teacher|faculty/i, entity: "Teachers" },
  { match: /event/i, page: { name: "Events", kind: "table", entity: "Events" }, entity: "Events" },
  { match: /regist/i, page: { name: "Register", kind: "form" }, feature: "Online registration" },
  { match: /report|analytic/i, page: { name: "Reports", kind: "dashboard" }, feature: "Exportable reports" },
  { match: /notif|alert|remind/i, feature: "Notifications" },
  { match: /book|library/i, page: { name: "Catalog", kind: "table", entity: "Books" }, entity: "Books" },
  { match: /quiz|exam|test/i, page: { name: "Quizzes", kind: "table", entity: "Quizzes" }, entity: "Quizzes" },
  { match: /portfolio|showcase/i, page: { name: "Projects", kind: "content" }, feature: "Project gallery" },
  { match: /resume|cv/i, page: { name: "Resume", kind: "form" }, feature: "PDF export" },
  { match: /shop|store|product|e-?commerce|cart/i, page: { name: "Products", kind: "table", entity: "Products" }, entity: "Products", feature: "Cart & checkout" },
  { match: /contact/i, page: { name: "Contact", kind: "form" } },
  { match: /about/i, page: { name: "About", kind: "content" } },
];

/** Prompt → structured plan. Real version: server function calling an LLM with a JSON schema. */
export function planProject(prompt: string, type: ProjectType): ProjectPlan {
  const pages: ProjectPage[] = [{ name: "Home", slug: "home", kind: "home" }];
  const features = new Set<string>();
  const entities = new Set<string>();
  for (const r of RULES) {
    if (!r.match.test(prompt)) continue;
    if (r.page && !pages.some((p) => p.name === r.page!.name))
      pages.push({ ...r.page, slug: r.page.name.toLowerCase() });
    if (r.feature) features.add(r.feature);
    if (r.entity) entities.add(r.entity);
  }
  if (pages.length < 3) {
    if (!pages.some((p) => p.name === "About")) pages.push({ name: "About", slug: "about", kind: "content" });
    if (!pages.some((p) => p.name === "Contact")) pages.push({ name: "Contact", slug: "contact", kind: "form" });
  }
  features.add(type === "Mobile App" ? "Mobile-first layout" : "Responsive layout");
  const name = extractName(prompt);
  return {
    name,
    summary: `A ${type.toLowerCase()} with ${pages.length} pages${
      entities.size ? ` managing ${[...entities].join(", ").toLowerCase()}` : ""
    }.`,
    pages,
    features: [...features],
    entities: [...entities],
  };
}

export function validatePrompt(prompt: string): string | null {
  const p = prompt.trim();
  if (p.length < 12) return "Describe your idea in a little more detail (at least 12 characters).";
  if (p.length > 2000) return "Please keep your description under 2,000 characters.";
  return null;
}

export async function generateProject(
  prompt: string,
  type: ProjectType,
  onStep: (index: number) => void,
): Promise<{ plan: ProjectPlan; files: ProjectFile[] }> {
  const err = validatePrompt(prompt);
  if (err) throw new Error(err);
  for (let i = 0; i < GENERATION_STEPS.length; i++) {
    onStep(i);
    await wait(650 + Math.random() * 500);
  }
  const plan = planProject(prompt, type);
  return { plan, files: buildFiles(plan) };
}

export const QUICK_ACTIONS = [
  "Improve Design",
  "Add Feature",
  "Fix Error",
  "Make Responsive",
  "Explain Code",
  "Generate Documentation",
] as const;
export type QuickAction = (typeof QUICK_ACTIONS)[number];

export async function runQuickAction(
  action: QuickAction,
  project: Project,
  activeFile?: string,
): Promise<{ message: string; files?: ProjectFile[]; plan?: ProjectPlan }> {
  await wait(900 + Math.random() * 600);
  const { plan } = project;
  switch (action) {
    case "Improve Design":
      return { message: `Refined spacing, typography scale and card styles across ${plan.pages.length} pages.` };
    case "Add Feature": {
      if (plan.features.includes("Search & filters")) return { message: "Search & filters are already included." };
      const next = { ...plan, features: [...plan.features, "Search & filters"] };
      return { message: "Added search & filters to list pages.", plan: next, files: buildFiles(next) };
    }
    case "Fix Error":
      return { message: "Scanned all files — no type or import errors found." };
    case "Make Responsive":
      return { message: "Verified breakpoints for mobile (≤640px), tablet (≤1024px) and desktop." };
    case "Explain Code": {
      const f = activeFile ?? "src/App.tsx";
      return {
        message: `${f}: ${
          f.includes("pages/")
            ? "A page component rendered by the router. It composes shared components and reads data through the services layer."
            : f.includes("services/")
              ? "Data access functions. Swap the in-memory arrays for real database queries without touching the pages."
              : f.includes("components/")
                ? "A reusable UI component shared across pages."
                : "The app entry: sets up routes for every page in the plan and wraps them with the shared layout."
        }`,
      };
    }
    case "Generate Documentation": {
      const files = project.files.filter((f) => f.path !== "docs/ARCHITECTURE.md");
      files.push({
        path: "docs/ARCHITECTURE.md",
        content: `# ${plan.name} — Architecture\n\n## Pages\n${plan.pages
          .map((p) => `- **${p.name}** (${p.kind})`)
          .join("\n")}\n\n## Features\n${plan.features.map((f) => `- ${f}`).join("\n")}\n\n## Data\n${
          plan.entities.length ? plan.entities.map((e) => `- ${e}`).join("\n") : "- No persistent entities yet"
        }\n`,
      });
      return { message: "Created docs/ARCHITECTURE.md.", files };
    }
  }
}

/* ---------------------------- Student tools ---------------------------- */

export async function runTool(toolId: string, input: string, options: Record<string, string>): Promise<string> {
  await wait(1100 + Math.random() * 700);
  const topic = (input.trim().split("\n")[0] ?? "").slice(0, 80);
  const count = Number(options["count"] ?? 5);
  switch (toolId) {
    case "study-assistant":
      return `# ${topic}\n\n## Key idea\n${topic} is best learned by breaking it into core concepts, worked examples and practice.\n\n## Study plan (${options["level"] ?? "Beginner"})\n1. Read a short overview and note unfamiliar terms.\n2. Work through two solved examples step by step.\n3. Attempt 3 practice problems without notes.\n4. Review mistakes and summarise in your own words.\n\n## Quick check\n- Can you explain ${topic} to a friend in 2 minutes?\n- Can you list where it is used in practice?`;
    case "notes-summarizer": {
      const sentences = input.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
      const pick = sentences.slice(0, options["length"] === "Detailed" ? 8 : 4);
      return `# Summary\n\n${pick.length ? pick.map((s) => `- ${s.trim()}`).join("\n") : "- Paste longer notes to get a meaningful summary."}\n\n**Word count:** ${input.split(/\s+/).filter(Boolean).length} → ${pick.join(" ").split(/\s+/).filter(Boolean).length}`;
    }
    case "question-paper":
      return `# ${topic} — Question Paper\n**Difficulty:** ${options["difficulty"] ?? "Medium"} · **Marks:** ${count * 10}\n\n## Section A (Short answer)\n${Array.from({ length: Math.ceil(count / 2) }, (_, i) => `${i + 1}. Define a key term from ${topic} and give one example. (5 marks)`).join("\n")}\n\n## Section B (Long answer)\n${Array.from({ length: Math.floor(count / 2) || 1 }, (_, i) => `${i + 1}. Explain an important process in ${topic} with a labelled diagram. (15 marks)`).join("\n")}`;
    case "mcq-generator":
      return `# ${topic} — MCQs\n\n${Array.from({ length: count }, (_, i) => `**Q${i + 1}.** Which statement about ${topic} is correct?\n- A) Option one\n- B) Option two\n- C) Option three\n- D) Option four\n\n_Answer: ${"ABCD"[i % 4]}_`).join("\n\n")}`;
    case "coding-assistant":
      return `# Solution — ${options["language"] ?? "JavaScript"}\n\n**Approach:** Break the problem into small functions, validate inputs, then combine.\n\n\`\`\`\n// ${topic}\nfunction solve(input) {\n  if (!input) throw new Error("Input required");\n  // 1. parse  2. compute  3. return result\n  return input;\n}\n\`\`\`\n\n**Complexity:** O(n) time, O(1) extra space.`;
    case "final-year-project":
      return `# Final Year Project Ideas — ${topic}\n\n${Array.from({ length: 3 }, (_, i) => `## ${i + 1}. Smart ${topic} ${["Management System", "Analytics Platform", "Assistant"][i]}\n- **Problem:** Manual processes are slow and error-prone.\n- **Stack:** React, TypeScript, PostgreSQL\n- **Modules:** Authentication, dashboard, reports, notifications\n- **Outcome:** Working prototype with documentation`).join("\n\n")}`;
    case "report-generator":
      return `# ${topic}\n\n## Abstract\nThis report examines ${topic}, outlining objectives, methodology and findings.\n\n## 1. Introduction\nBackground and motivation for ${topic}.\n\n## 2. Objectives\n- Identify key requirements\n- Design a solution\n- Evaluate results\n\n## 3. Methodology\nDescribe tools, data sources and process.\n\n## 4. Results\nSummarise observations with tables or charts.\n\n## 5. Conclusion\nKey takeaways and future scope.\n\n## References\n1. Add your sources here.`;
    case "ppt-generator":
      return `# ${topic} — Slide outline (${count} slides)\n\n${Array.from({ length: count }, (_, i) => `### Slide ${i + 1}: ${["Title", "Introduction", "Problem", "Solution", "How it works", "Results", "Future scope", "Thank you"][i] ?? `Detail ${i}`}\n- Key point\n- Supporting visual idea`).join("\n\n")}`;
    case "resume-builder":
      return `# ${topic || "Your Name"}\n${options["role"] ?? "Software Developer"} · email@example.com\n\n## Summary\nMotivated ${(options["role"] ?? "developer").toLowerCase()} with hands-on project experience and a focus on clean, reliable work.\n\n## Skills\nReact · TypeScript · SQL · Git · Communication\n\n## Projects\n- **College Attendance System** — Built role-based dashboards for 500+ students.\n- **Online Quiz Platform** — Timed quizzes with instant results.\n\n## Education\nB.Tech, Computer Science — 2026`;
    case "assignment-helper":
      return `# Assignment: ${topic}\n\n## Understanding the question\nRestate what is being asked and identify keywords.\n\n## Outline\n1. Introduction — context and definition\n2. Main points — 3 arguments with evidence\n3. Conclusion — summary and your view\n\n## Tips\n- Cite every source you use.\n- Write in your own words; this is a guide, not a submission.`;
    default:
      return "This tool is not available yet.";
  }
}
