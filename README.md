# IdeaForge AI

Build a production-quality AI web application called **EduForge AI**.

## PRODUCT VISION

EduForge AI is an AI-powered creation platform for students, developers, teachers, entrepreneurs, and general users.

The user describes what they want in natural language, and EduForge AI helps create the project.

Core workflow:

USER IDEA
→ AI PLANNER
→ PROJECT GENERATION
→ LIVE PREVIEW
→ EDIT
→ SAVE
→ DOWNLOAD
→ DEPLOY

Example:

"Create a college attendance management website with student login, teacher login, attendance records, dashboard and reports."

The application should turn this request into a structured project experience.

Do NOT build this as a simple chatbot. It should feel like a professional AI product similar to a modern AI development platform.

---

# BRAND

Name: EduForge AI

Tagline:
"Turn Your Ideas Into Working Projects."

Alternative headline:
"Build Websites, Apps & Projects With AI."

Visual style:

* Premium modern SaaS
* Clean
* Professional
* Futuristic but not excessive
* Student friendly
* Responsive
* Excellent desktop and mobile experience
* Smooth animations
* Strong typography
* Modern cards
* Subtle gradients
* Dark and light mode

Do not make the design look like a generic AI template.

---

# TECHNOLOGY

Use:

* React
* TypeScript
* Vite
* Tailwind CSS
* Modern component architecture
* Supabase-ready architecture
* Secure server-side AI integration
* GitHub-ready project structure

Keep the code clean, modular and maintainable.

Never expose API keys or secrets in frontend code.

Use environment variables for all secrets.

---

# APPLICATION STRUCTURE

Create these major areas:

1. Landing Page
2. AI Builder
3. Student AI Tools
4. My Projects
5. Project Workspace
6. Dashboard
7. Authentication
8. Settings
9. Help / Documentation

---

# LANDING PAGE

Create a highly polished landing page.

Hero:

Headline:

"Build Websites, Apps & Projects With AI"

Subtitle:

"Describe your idea in simple words and let EduForge AI help turn it into a real project."

Buttons:

"Start Building"
"Explore AI Tools"

Add a visual AI builder preview beside the hero.

Show an example:

User:
"Create a student attendance management system."

AI:

✓ Planning project
✓ Creating pages
✓ Creating components
✓ Creating database structure
✓ Preparing preview

Then show:

"Project Ready"

Buttons:

"Preview"
"Edit Project"

---

# FEATURES

Create feature cards for:

AI Website Builder
AI App Builder
Student Project Generator
Coding Assistant
Study Assistant
Question Paper Generator
Notes Summarizer
Report Generator
Presentation Generator
Resume Builder

Each card should have:

* Icon
* Title
* Description
* Open Tool button

---

# HOW IT WORKS

Show 4 steps:

1. Describe
   User explains what they want.

2. Generate
   AI plans the project and generates the required structure.

3. Preview
   User sees the result in a live preview.

4. Export
   User can save, download or deploy the project.

Use an attractive visual timeline.

---

# AI BUILDER

This is the MAIN feature of the application.

Create a professional IDE-like workspace.

Layout:

LEFT:
Project controls

CENTER:
Live preview

RIGHT:
Files / AI activity

Top navigation:

EduForge AI
Project name
Preview
Code
Save
Download
Deploy

---

# BUILDER LEFT PANEL

Include:

Project Type:

* Website
* Web App
* Mobile App
* Student Project
* Dashboard
* Portfolio
* E-commerce
* AI Tool

Prompt box:

"What do you want to build?"

Example:

"Create a college event management website with student registration, event listings, admin dashboard and notifications."

Add:

Build Project button.

Also add quick actions:

Improve Design
Add Feature
Fix Error
Make Responsive
Explain Code
Generate Documentation

---

# AI GENERATION EXPERIENCE

When the user clicks Build Project, show a professional generation process.

Example:

Analyzing request...
✓ Understanding requirements

Planning project...
✓ Creating architecture

Generating UI...
✓ Creating components

Preparing project...
✓ Creating files

Finalizing...
✓ Project ready

Then show:

"Your project is ready."

Buttons:

Preview
Edit
View Code
Download

Use realistic loading states.

---

# LIVE PREVIEW

Create a browser-style preview panel.

Include:

URL/address bar
Refresh button
Desktop preview
Tablet preview
Mobile preview

Allow the user to switch:

Desktop
Tablet
Mobile

The preview should look like a real browser.

---

# CODE VIEW

Create a professional code editor-style interface.

Show:

src/
components/
pages/
services/
hooks/
utils/

Files such as:

App.tsx
Home.tsx
Dashboard.tsx
Navbar.tsx
Footer.tsx

Include:

Copy
Download
Edit

Use syntax highlighting styling.

For the initial version, sample generated code can be displayed, but structure the application so a real AI backend can later generate and modify files.

---

# PROJECT WORKSPACE

Each project should have:

Project name
Description
Created date
Last modified
Project type
Status

Actions:

Open
Preview
Edit
Duplicate
Download
Delete

---

# MY PROJECTS

Create a professional project management page.

Cards should display:

Project name
Project type
Last updated
Status

Buttons:

Open
Preview
Download
Delete

Add:

Search
Filter
Sort

Empty state:

"You haven't created a project yet."

Button:

"Create Your First Project"

---

# DASHBOARD

Create a student-friendly dashboard.

Show:

Projects Created
Projects This Month
AI Generations
Saved Projects

Quick actions:

Create Website
Create App
Generate Study Material
Generate Project

Recent projects section.

---

# STUDENT AI TOOLS

Create separate tool cards/pages for:

1. AI Study Assistant
2. Notes Summarizer
3. Question Paper Generator
4. MCQ Generator
5. Coding Assistant
6. Final Year Project Generator
7. Report Generator
8. PPT Generator
9. Resume Builder
10. Assignment Helper

Each tool should have:

Input
Options
Generate button
Output area
Copy button
Download button

Use realistic mock functionality initially.

Structure the code so AI APIs can be connected later.

---

# AUTHENTICATION

Create:

Login
Signup
Forgot Password

Use Supabase-ready authentication architecture.

After login:

redirect to Dashboard.

Do not store passwords manually.

Do not expose authentication secrets.

---

# DATABASE ARCHITECTURE

Prepare the application for Supabase.

Tables should conceptually include:

users
profiles
projects
project_files
ai_generations
saved_tools

Projects should belong to authenticated users.

Use secure row-level access policies when implementing Supabase.

---

# SETTINGS

Create settings page with:

Profile
Account
Appearance
Notifications
Security

Add:

Dark mode
Light mode
System mode

---

# RESPONSIVE DESIGN

The application must work correctly on:

Desktop
Laptop
Tablet
Mobile

The Builder should adapt intelligently on smaller screens.

Do not simply shrink desktop UI.

Use mobile navigation and collapsible panels.

---

# ERROR HANDLING

Implement professional states:

Loading
Empty
Error
Success
No results

Example error:

"Something went wrong while creating your project."

Buttons:

Try Again
Return to Builder

---

# SECURITY

Security is extremely important.

Never put:

API keys
Secret keys
Database service-role keys
Private credentials

inside frontend source code.

Use environment variables and secure server-side functions.

Validate user input.

Do not execute arbitrary generated code directly on the main application server.

Generated code should be sandboxed when actual code execution is implemented.

---

# GITHUB READINESS

Organize the repository professionally.

Recommended structure:

src/
components/
pages/
layouts/
hooks/
services/
lib/
types/
data/
utils/

public/

supabase/

README.md

.env.example

.gitignore

Create a clear README explaining:

Project
Features
Technology
Installation
Environment variables
Development
Build
Deployment
GitHub setup

Never commit .env files or secrets.

---

# SAMPLE DATA

Use realistic demo projects:

College Attendance System
Student Portfolio
College Event Management
AI Resume Builder
Library Management System
Online Quiz Platform

---

# UI QUALITY REQUIREMENTS

The website should feel like a real startup product.

Use:

* Consistent spacing
* Strong typography
* Professional buttons
* Beautiful cards
* Subtle hover effects
* Smooth transitions
* Good empty states
* Good loading states
* Accessible contrast
* Keyboard-friendly controls

Avoid:

* Excessive gradients
* Random colors
* Huge unnecessary animations
* Clutter
* Fake statistics
* Broken buttons
* Placeholder lorem ipsum

---

# IMPORTANT FUNCTIONALITY RULE

Do not pretend that a real AI model is connected if it is not.

For the first version:

Use realistic mock generation responses where necessary.

Clearly structure the application so a secure AI backend can be connected later.

The interface should already be ready for:

Prompt
→ AI API
→ Structured project plan
→ Generated files
→ Preview

---

# FINAL QUALITY CHECK

Before finishing:

Check every route.

Check navigation.

Check responsive layouts.

Check buttons.

Check forms.

Check loading states.

Check error states.

Check authentication flow.

Check project creation flow.

Check that no secrets are exposed.

Remove console errors.

Remove unused components.

Remove unnecessary dependencies.

Ensure the application builds successfully.

Make the final result look like a polished production SaaS application rather than a basic college demo.

The most important screen is the AI Builder. Make that experience excellent.

Build the complete frontend first with clean architecture and mock AI responses where backend functionality is not yet connected.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ideafabricate-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0150ba52-4a89-471f-8f83-a78a88be4a07).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
