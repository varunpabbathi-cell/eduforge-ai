import {
  BookOpen,
  Bot,
  Code2,
  FileText,
  GraduationCap,
  ListChecks,
  NotebookPen,
  Presentation,
  ScrollText,
  UserSquare,
  type LucideIcon,
} from "lucide-react";

export interface ToolOption {
  key: string;
  label: string;
  choices: string[];
}

export interface Tool {
  id: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  inputLabel: string;
  placeholder: string;
  multiline: boolean;
  options: ToolOption[];
}

export const TOOLS: Tool[] = [
  { id: "study-assistant", name: "AI Study Assistant", short: "Study Assistant", description: "Get a clear explanation and a study plan for any topic.", icon: Bot, inputLabel: "Topic", placeholder: "e.g. Normalization in DBMS", multiline: false, options: [{ key: "level", label: "Level", choices: ["Beginner", "Intermediate", "Advanced"] }] },
  { id: "notes-summarizer", name: "Notes Summarizer", short: "Notes Summarizer", description: "Turn long lecture notes into crisp bullet points.", icon: NotebookPen, inputLabel: "Your notes", placeholder: "Paste your notes here…", multiline: true, options: [{ key: "length", label: "Length", choices: ["Short", "Detailed"] }] },
  { id: "question-paper", name: "Question Paper Generator", short: "Question Papers", description: "Create balanced exam papers with sections and marks.", icon: ScrollText, inputLabel: "Subject or topic", placeholder: "e.g. Operating Systems — Unit 2", multiline: false, options: [{ key: "difficulty", label: "Difficulty", choices: ["Easy", "Medium", "Hard"] }, { key: "count", label: "Questions", choices: ["4", "6", "8", "10"] }] },
  { id: "mcq-generator", name: "MCQ Generator", short: "MCQ Generator", description: "Generate multiple-choice questions with answers.", icon: ListChecks, inputLabel: "Topic", placeholder: "e.g. Photosynthesis", multiline: false, options: [{ key: "count", label: "Questions", choices: ["5", "10", "15"] }] },
  { id: "coding-assistant", name: "Coding Assistant", short: "Coding Assistant", description: "Explain, debug and solve programming problems.", icon: Code2, inputLabel: "Problem or code", placeholder: "Describe the problem or paste code…", multiline: true, options: [{ key: "language", label: "Language", choices: ["JavaScript", "Python", "Java", "C++"] }] },
  { id: "final-year-project", name: "Final Year Project Generator", short: "Project Ideas", description: "Discover project ideas with modules and tech stack.", icon: GraduationCap, inputLabel: "Domain", placeholder: "e.g. Healthcare", multiline: false, options: [] },
  { id: "report-generator", name: "Report Generator", short: "Report Generator", description: "Draft a structured project or lab report.", icon: FileText, inputLabel: "Report title", placeholder: "e.g. Smart Parking System", multiline: false, options: [] },
  { id: "ppt-generator", name: "PPT Generator", short: "Presentation Generator", description: "Get a slide-by-slide outline for your presentation.", icon: Presentation, inputLabel: "Presentation topic", placeholder: "e.g. Renewable Energy", multiline: false, options: [{ key: "count", label: "Slides", choices: ["5", "8", "10"] }] },
  { id: "resume-builder", name: "Resume Builder", short: "Resume Builder", description: "Build a clean, ATS-friendly resume draft.", icon: UserSquare, inputLabel: "Your name", placeholder: "e.g. Priya Sharma", multiline: false, options: [{ key: "role", label: "Target role", choices: ["Software Developer", "Data Analyst", "UI Designer"] }] },
  { id: "assignment-helper", name: "Assignment Helper", short: "Assignment Helper", description: "Understand the question and outline your answer.", icon: BookOpen, inputLabel: "Assignment question", placeholder: "Paste the question…", multiline: true, options: [] },
];

export const getTool = (id: string) => TOOLS.find((t) => t.id === id);
