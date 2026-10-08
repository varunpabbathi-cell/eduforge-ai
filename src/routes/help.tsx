import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Documentation — EduForge AI" }, { name: "description", content: "Learn how to build, preview, save and download projects with EduForge AI." }, { property: "og:title", content: "Help & Documentation — EduForge AI" }, { property: "og:description", content: "Guides and answers for EduForge AI." }] }),
  component: Help,
});

const FAQ: [string, string][] = [
  ["How do I create a project?", "Open the AI Builder, choose a project type, describe your idea and press Build Project. You'll see each planning step, then a live preview and the generated files."],
  ["Is a real AI model connected?", "Not yet. This version runs in demo mode using built-in templates so the full workflow can be tried. The app is structured so a secure server-side AI service can be plugged in."],
  ["Where are my projects saved?", "In demo mode, projects are saved in your browser. Once a backend is connected they'll be stored in your account."],
  ["How do I download my project?", "Use Download in the Builder or on any project card. You'll get a ZIP containing every generated file and a README."],
  ["Can I deploy?", "One-click hosting isn't connected yet. Download the ZIP and deploy to any static host using the included README."],
  ["Can I edit the generated code?", "Yes — switch to Code, select a file, press Edit, then Apply. Remember to Save the project."],
];

function Help() {
  return (
    <AppShell title="Help & Documentation">
      <h2 className="text-2xl font-semibold">Help & Documentation</h2>
      <p className="mt-1 text-sm text-muted-foreground">Everything you need to go from idea to project.</p>
      <Accordion type="single" collapsible className="mt-6 rounded-2xl border bg-card px-5">
        {FAQ.map(([q, a]) => (
          <AccordionItem key={q} value={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>
        ))}
      </Accordion>
    </AppShell>
  );
}
