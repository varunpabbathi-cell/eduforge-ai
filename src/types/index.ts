export const PROJECT_TYPES = [
  "Website",
  "Web App",
  "Mobile App",
  "Student Project",
  "Dashboard",
  "Portfolio",
  "E-commerce",
  "AI Tool",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type ProjectStatus = "Draft" | "Ready" | "Deployed";

export interface ProjectFile {
  path: string;
  content: string;
}

export interface ProjectPage {
  name: string;
  slug: string;
  kind: "home" | "auth" | "dashboard" | "table" | "form" | "content";
  entity?: string;
}

/** Structured plan returned by the AI planner (mock today, real API later). */
export interface ProjectPlan {
  name: string;
  summary: string;
  pages: ProjectPage[];
  features: string[];
  entities: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  prompt: string;
  type: ProjectType;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  plan: ProjectPlan;
  files: ProjectFile[];
}

export interface GenerationStep {
  id: string;
  label: string;
  done: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
