"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BuildTool =
  | "cursor"
  | "bolt-lovable"
  | "chatgpt-claude"
  | "replit"
  | "someone-else"
  | "other";

type AppStatus =
  | "localhost"
  | "github-not-live"
  | "live-needs-changes"
  | "not-sure";

type ExperienceKey =
  | "git"
  | "deployed"
  | "database"
  | "domain"
  | "terminal"
  | "env-vars";

type ResultPath = "beginner" | "getting-there" | "ready";

interface VibeAnswers {
  buildTool: BuildTool | null;
  appStatus: AppStatus | null;
  experience: Set<ExperienceKey>;
}

/* Simplified types for Path C file generation */
interface SimpleProject {
  projectName: string;
}

interface SimpleStack {
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const BUILD_TOOL_OPTIONS: { key: BuildTool; label: string; icon: string }[] = [
  { key: "cursor", label: "I used Cursor", icon: "//)" },
  { key: "bolt-lovable", label: "I used Bolt or Lovable", icon: "{*}" },
  { key: "chatgpt-claude", label: "I used ChatGPT or Claude", icon: ">_<" },
  { key: "replit", label: "I used Replit", icon: "<R>" },
  { key: "someone-else", label: "Someone built it for me", icon: "[?]" },
  { key: "other", label: "Other", icon: "..." },
];

const APP_STATUS_OPTIONS: { key: AppStatus; label: string }[] = [
  { key: "localhost", label: "It works on my computer but that's it" },
  { key: "github-not-live", label: "It's on GitHub but not live" },
  { key: "live-needs-changes", label: "It's live somewhere but I need changes" },
  { key: "not-sure", label: "I'm not sure honestly" },
];

const EXPERIENCE_OPTIONS: { key: ExperienceKey; label: string }[] = [
  { key: "git", label: "Used GitHub or Git" },
  { key: "deployed", label: "Deployed a website to the internet" },
  { key: "database", label: "Set up a database" },
  { key: "domain", label: "Bought a domain name" },
  { key: "terminal", label: "Used a terminal / command line" },
  { key: "env-vars", label: "Set up environment variables or API keys" },
];

type Difficulty = "Easy" | "Medium" | "Technical" | "Advanced";

interface LaunchStep {
  number: number;
  title: string;
  explanation: string;
  difficulty: Difficulty;
  relatedExperience: ExperienceKey[];
  howTo: string[];
}

const LAUNCH_STEPS: LaunchStep[] = [
  {
    number: 1,
    title: "Put your code somewhere safe",
    explanation:
      "Right now your code only lives on your computer. If your laptop dies, it's gone. You need to back it up to GitHub.",
    difficulty: "Easy",
    relatedExperience: ["git"],
    howTo: [
      "Create a free account at github.com",
      "Download GitHub Desktop (easier than the terminal)",
      "Create a new repository and push your code",
      "Now your code is safe in the cloud and you have version history",
    ],
  },
  {
    number: 2,
    title: "Separate your secrets",
    explanation:
      "Your app probably has passwords and API keys hardcoded in it. Those need to be pulled out and stored separately before anyone sees your code.",
    difficulty: "Technical",
    relatedExperience: ["env-vars"],
    howTo: [
      "Look for any API keys, passwords, or URLs hardcoded in your files",
      "Create a file called .env.local and move those values there",
      "Replace the hardcoded values with process.env.YOUR_VARIABLE_NAME",
      "Add .env.local to your .gitignore so it never gets committed",
    ],
  },
  {
    number: 3,
    title: "Set up a real database",
    explanation:
      "If your app stores any data (users, posts, orders), you need a database that lives on the internet, not just your computer.",
    difficulty: "Technical",
    relatedExperience: ["database"],
    howTo: [
      "Supabase is the easiest option -- free tier, no credit card needed",
      "Create an account at supabase.com and start a new project",
      "Copy your project URL and API key into your .env.local",
      "Your data now lives in the cloud and persists between deploys",
    ],
  },
  {
    number: 4,
    title: "Choose where your app will live",
    explanation:
      "Your app needs a home on the internet. Services like Vercel or Railway can host it, but they need to be configured.",
    difficulty: "Medium",
    relatedExperience: ["deployed"],
    howTo: [
      "Vercel is the easiest for Next.js apps -- sign in with GitHub",
      "Click 'Import Project' and select your repository",
      "Vercel auto-detects your framework and builds it",
      "You get a free .vercel.app URL immediately",
    ],
  },
  {
    number: 5,
    title: "Connect your domain",
    explanation:
      "Want yourapp.com instead of some-random-url.vercel.app? You need to buy a domain and point it to your host.",
    difficulty: "Medium",
    relatedExperience: ["domain"],
    howTo: [
      "Buy a domain from Namecheap or Cloudflare (~$10/year)",
      "In your hosting dashboard, add the domain under Custom Domains",
      "Update your domain's DNS settings to point to your host",
      "HTTPS is usually set up automatically -- just wait a few minutes",
    ],
  },
  {
    number: 6,
    title: "Set up environment variables",
    explanation:
      "Those secrets from step 2? They need to be added to your hosting platform so your app can use them in production.",
    difficulty: "Technical",
    relatedExperience: ["env-vars"],
    howTo: [
      "Go to your hosting provider's dashboard (e.g., Vercel)",
      "Find Settings > Environment Variables",
      "Add each variable from your .env.local file",
      "Redeploy your app so it picks up the new values",
    ],
  },
  {
    number: 7,
    title: "Make it secure",
    explanation:
      "HTTPS, authentication, input validation, rate limiting -- there's a checklist of security basics before real users touch your app.",
    difficulty: "Advanced",
    relatedExperience: [],
    howTo: [
      "HTTPS is usually automatic with Vercel/Netlify -- verify the padlock icon",
      "Add authentication if users need to log in (Supabase Auth is free)",
      "Never trust user input -- validate and sanitize everything on the server",
      "Set up rate limiting to prevent abuse of your API endpoints",
    ],
  },
  {
    number: 8,
    title: "Set up a safe way to make changes",
    explanation:
      "You can't just edit code and hope for the best. You need a workflow (branches, pull requests, reviews) so changes don't break things.",
    difficulty: "Technical",
    relatedExperience: ["git"],
    howTo: [
      "Never push directly to your main branch",
      "Create a new branch for each change: git checkout -b feature/my-change",
      "Push the branch and open a Pull Request on GitHub",
      "Review the changes, then merge -- your hosting auto-deploys the update",
    ],
  },
  {
    number: 9,
    title: "Test it for real",
    explanation:
      "Does it work on phones? Different browsers? What happens when 100 people use it at once? You need to find out before launch.",
    difficulty: "Medium",
    relatedExperience: [],
    howTo: [
      "Open your deployed app on your phone -- does it look right?",
      "Try it in Chrome, Safari, and Firefox",
      "Ask 3-5 friends to use it and report any issues",
      "Check your hosting dashboard for error logs after testing",
    ],
  },
  {
    number: 10,
    title: "Monitor and maintain",
    explanation:
      "Once it's live, you need to know when things break. Error tracking, uptime monitoring, backups -- production apps need babysitting.",
    difficulty: "Advanced",
    relatedExperience: [],
    howTo: [
      "Set up a free Sentry account for error tracking",
      "Use UptimeRobot (free) to alert you if your site goes down",
      "Enable automatic database backups in Supabase (it's on by default)",
      "Check your error logs weekly -- don't wait for users to report bugs",
    ],
  },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Technical: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

/* Simplified stack options for Path C */
const SIMPLE_FRAMEWORK_OPTIONS = ["Next.js", "React", "Python", "Other"];
const SIMPLE_DATABASE_OPTIONS = ["Supabase", "None"];

/* ------------------------------------------------------------------ */
/*  Helpers: scoring & path calculation                                */
/* ------------------------------------------------------------------ */

function calculatePath(answers: VibeAnswers): ResultPath {
  let score = 0;

  // App status scoring
  if (answers.appStatus === "github-not-live") score += 2;
  if (answers.appStatus === "live-needs-changes") score += 4;
  // "localhost" and "not-sure" add 0

  // Experience scoring
  score += answers.experience.size;

  if (score >= 4) return "ready";
  if (score >= 2) return "getting-there";
  return "beginner";
}

function getCompletedStepIds(answers: VibeAnswers): Set<number> {
  const completed = new Set<number>();

  // If they've used git, step 1 (code backup) and step 8 (branching) are partially done
  if (answers.experience.has("git")) {
    completed.add(1);
  }

  // If they've set up env vars, step 2 (secrets) and step 6 (production env vars) done
  if (answers.experience.has("env-vars")) {
    completed.add(2);
    completed.add(6);
  }

  // If they've set up a database, step 3 done
  if (answers.experience.has("database")) {
    completed.add(3);
  }

  // If they've deployed before, step 4 done
  if (answers.experience.has("deployed")) {
    completed.add(4);
  }

  // If they've bought a domain, step 5 done
  if (answers.experience.has("domain")) {
    completed.add(5);
  }

  // If app is already live, mark hosting and deployment as done
  if (answers.appStatus === "live-needs-changes") {
    completed.add(4);
  }

  // If on GitHub, mark code backup done
  if (
    answers.appStatus === "github-not-live" ||
    answers.appStatus === "live-needs-changes"
  ) {
    completed.add(1);
  }

  return completed;
}

/* ------------------------------------------------------------------ */
/*  Helpers: file generation (adapted from original)                   */
/* ------------------------------------------------------------------ */

function getPublicPrefix(framework: string): string {
  if (framework === "Next.js") return "NEXT_PUBLIC_";
  if (framework === "React") return "VITE_";
  if (framework === "Python") return "";
  return "";
}

function generateClaudeMd(project: SimpleProject, stack: SimpleStack): string {
  const lines: string[] = [];

  lines.push(`# CLAUDE.md - ${project.projectName || "My Project"}`);
  lines.push("");
  lines.push(
    "This file provides context to AI coding assistants (Claude, Cursor, ChatGPT, etc.)."
  );
  lines.push(
    "It helps them understand your project so they give better, more relevant help."
  );
  lines.push("");

  lines.push("## Project Overview");
  lines.push("");
  lines.push(`**Project Name:** ${project.projectName || "TBD"}`);
  lines.push(`**Framework:** ${stack.frontend || "TBD"}`);
  if (stack.database && stack.database !== "None") {
    lines.push(`**Database:** ${stack.database}`);
  }
  if (stack.hosting) {
    lines.push(`**Hosting:** ${stack.hosting}`);
  }
  lines.push("");

  lines.push("## Tech Stack");
  lines.push("");
  if (stack.frontend === "Next.js") {
    lines.push("- **Framework:** Next.js (App Router)");
    lines.push("- **Language:** TypeScript");
    lines.push("- **Styling:** Tailwind CSS");
  } else if (stack.frontend === "React") {
    lines.push("- **Framework:** React (Vite)");
    lines.push("- **Language:** TypeScript");
    lines.push("- **Styling:** Tailwind CSS");
  } else if (stack.frontend === "Python") {
    lines.push("- **Language:** Python");
    lines.push("- **Framework:** FastAPI / Flask (update as needed)");
  } else {
    lines.push(`- **Framework:** ${stack.frontend || "TBD"}`);
  }
  if (stack.database === "Supabase") {
    lines.push("- **Database:** Supabase (PostgreSQL)");
    lines.push("- **Auth:** Supabase Auth");
  }
  if (stack.hosting) {
    lines.push(`- **Hosting:** ${stack.hosting}`);
  }
  lines.push("");

  lines.push("## Project Structure");
  lines.push("");
  if (stack.frontend === "Next.js") {
    lines.push("```");
    lines.push("├── src/");
    lines.push("│   ├── app/              # Next.js App Router pages");
    lines.push("│   ├── components/       # Reusable React components");
    lines.push("│   └── lib/              # Utility functions and configs");
    lines.push("├── public/               # Static assets (images, fonts)");
    lines.push("├── .env.local            # Environment variables (not committed)");
    lines.push("├── .env.example          # Template for environment variables");
    lines.push("├── package.json          # Dependencies and scripts");
    lines.push("├── tsconfig.json         # TypeScript configuration");
    lines.push("└── CLAUDE.md             # This file");
    lines.push("```");
  } else if (stack.frontend === "React") {
    lines.push("```");
    lines.push("├── src/");
    lines.push("│   ├── components/       # Reusable React components");
    lines.push("│   ├── pages/            # Page-level components");
    lines.push("│   ├── hooks/            # Custom React hooks");
    lines.push("│   ├── utils/            # Utility functions");
    lines.push("│   └── App.tsx           # Root component");
    lines.push("├── public/               # Static assets");
    lines.push("├── .env.local            # Environment variables (not committed)");
    lines.push("├── package.json          # Dependencies and scripts");
    lines.push("└── CLAUDE.md             # This file");
    lines.push("```");
  } else if (stack.frontend === "Python") {
    lines.push("```");
    lines.push("├── app/");
    lines.push("│   ├── main.py           # Application entry point");
    lines.push("│   ├── routes/           # API route handlers");
    lines.push("│   ├── models/           # Data models");
    lines.push("│   └── utils/            # Utility functions");
    lines.push("├── requirements.txt      # Python dependencies");
    lines.push("├── .env                  # Environment variables (not committed)");
    lines.push("├── .env.example          # Template for environment variables");
    lines.push("└── CLAUDE.md             # This file");
    lines.push("```");
  } else {
    lines.push("```");
    lines.push("├── src/                  # Source code");
    lines.push("├── public/               # Static assets");
    lines.push("├── .env.example          # Environment variable template");
    lines.push("├── package.json          # Dependencies and scripts");
    lines.push("└── CLAUDE.md             # This file");
    lines.push("```");
  }
  lines.push("");

  lines.push("## Development Commands");
  lines.push("");
  if (stack.frontend === "Python") {
    lines.push("```bash");
    lines.push("pip install -r requirements.txt   # Install dependencies");
    lines.push("python -m uvicorn app.main:app --reload  # Start dev server");
    lines.push("```");
  } else {
    lines.push("```bash");
    lines.push("npm install          # Install dependencies");
    lines.push("npm run dev          # Start development server");
    lines.push("npm run build        # Build for production");
    lines.push("npm run lint         # Run linter");
    lines.push("```");
  }
  lines.push("");

  lines.push("## Coding Conventions");
  lines.push("");
  if (stack.frontend === "Python") {
    lines.push("- Follow PEP 8 style guidelines");
    lines.push("- Use type hints for function parameters and return values");
    lines.push("- Keep functions small and focused");
    lines.push("- Use descriptive variable names");
    lines.push("- Handle errors with try/except and return meaningful messages");
    lines.push("- Use environment variables for all secrets and API keys");
    lines.push("- Never hardcode URLs, keys, or secrets in source code");
  } else {
    lines.push("- Use TypeScript for all new files (.ts / .tsx)");
    lines.push("- Use functional components with hooks (no class components)");
    lines.push(
      "- Keep components small and focused (under 150 lines ideally)"
    );
    lines.push("- Use descriptive variable names (avoid single-letter names)");
    lines.push("- Put reusable logic in custom hooks or utility functions");
    lines.push(
      "- Handle loading and error states in all data-fetching components"
    );
    lines.push("- Use environment variables for all secrets and API keys");
    lines.push("- Never hardcode URLs, keys, or secrets in source code");
  }
  lines.push("");

  if (stack.database === "Supabase") {
    lines.push("## Database");
    lines.push("");
    lines.push("This project uses **Supabase** (PostgreSQL).");
    lines.push("- Supabase client is initialized in src/lib/supabase.ts");
    lines.push(
      "- Use the Supabase dashboard to manage tables and RLS policies"
    );
    lines.push("- Row Level Security (RLS) should be enabled on all tables");
    lines.push("");
  }

  lines.push("## Environment Variables");
  lines.push("");
  lines.push("Copy `.env.example` to `.env.local` and fill in the values:");
  lines.push("");
  lines.push("```bash");
  lines.push("cp .env.example .env.local");
  lines.push("```");
  lines.push("");
  lines.push(
    "See `.env.example` for all required variables and their descriptions."
  );
  lines.push("");

  lines.push("## Important Notes for AI Assistants");
  lines.push("");
  lines.push(
    "- Always check existing code patterns before generating new code"
  );
  lines.push("- Follow the established project structure and conventions");
  lines.push(
    "- When modifying files, preserve existing functionality and imports"
  );
  lines.push("- Suggest tests when adding new features or fixing bugs");
  lines.push(
    "- If unsure about a design decision, explain the trade-offs"
  );
  lines.push(
    "- Do not install new dependencies without explaining why they're needed"
  );
  lines.push("");

  return lines.join("\n");
}

function generateEnvExample(stack: SimpleStack): string {
  const lines: string[] = [];
  const pub = getPublicPrefix(stack.frontend);

  lines.push("# ===========================================");
  lines.push("# Environment Variables");
  lines.push("# ===========================================");
  lines.push("# Copy this file to .env.local and fill in your values.");
  lines.push("# NEVER commit .env.local to version control!");
  lines.push("# ===========================================");
  lines.push("");

  if (stack.frontend !== "Python") {
    lines.push("# App");
    lines.push(`${pub}APP_URL=http://localhost:3000`);
    lines.push("");
  }

  if (stack.database === "Supabase") {
    lines.push("# Supabase");
    lines.push(`${pub}SUPABASE_URL=your_supabase_project_url`);
    lines.push(`${pub}SUPABASE_ANON_KEY=your_supabase_anon_key`);
    lines.push("SUPABASE_SERVICE_ROLE_KEY=your_service_role_key");
    lines.push("");
  }

  lines.push("# Add additional API keys below");
  lines.push("# OPENAI_API_KEY=your_openai_key");
  lines.push("# STRIPE_SECRET_KEY=your_stripe_key");
  lines.push("");

  return lines.join("\n");
}

function generateContributingMd(
  project: SimpleProject,
  stack: SimpleStack
): string {
  const lines: string[] = [];
  const isPython = stack.frontend === "Python";

  lines.push(`# Contributing to ${project.projectName || "This Project"}`);
  lines.push("");
  lines.push(
    "Thank you for your interest in contributing! Here's how to get started."
  );
  lines.push("");

  lines.push("## Getting Started");
  lines.push("");
  lines.push("### Prerequisites");
  lines.push("");
  if (isPython) {
    lines.push("- [Python](https://python.org/) (3.10 or later)");
  } else {
    lines.push("- [Node.js](https://nodejs.org/) (v18 or later)");
  }
  lines.push("- [Git](https://git-scm.com/)");
  lines.push(
    "- A code editor ([VS Code](https://code.visualstudio.com/) recommended)"
  );
  if (stack.database === "Supabase") {
    lines.push(
      "- A [Supabase](https://supabase.com) account (free tier is fine)"
    );
  }
  lines.push("");

  lines.push("### Setup");
  lines.push("");
  lines.push("```bash");
  lines.push("# 1. Fork and clone the repo");
  lines.push("git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git");
  lines.push("cd YOUR_REPO");
  lines.push("");
  if (isPython) {
    lines.push("# 2. Create a virtual environment and install dependencies");
    lines.push("python -m venv venv");
    lines.push(
      "source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
    );
    lines.push("pip install -r requirements.txt");
  } else {
    lines.push("# 2. Install dependencies");
    lines.push("npm install");
  }
  lines.push("");
  lines.push("# 3. Set up environment variables");
  lines.push("cp .env.example .env.local");
  lines.push("# Then edit .env.local with your actual values");
  lines.push("");
  if (isPython) {
    lines.push("# 4. Start the development server");
    lines.push("python -m uvicorn app.main:app --reload");
  } else {
    lines.push("# 4. Start the development server");
    lines.push("npm run dev");
  }
  lines.push("```");
  lines.push("");

  lines.push("## Making Changes");
  lines.push("");
  lines.push(
    "1. Create a new branch: `git checkout -b feature/your-feature`"
  );
  lines.push("2. Make your changes");
  lines.push("3. Test your changes locally");
  lines.push(
    '4. Commit with a clear message: `git commit -m "Add: brief description"`'
  );
  lines.push("5. Push to your fork: `git push origin feature/your-feature`");
  lines.push("6. Open a Pull Request");
  lines.push("");

  lines.push("## Code Style");
  lines.push("");
  if (isPython) {
    lines.push("- Follow PEP 8 style guidelines");
    lines.push("- Run your linter before committing");
  } else {
    lines.push("- Use TypeScript for all new files");
    lines.push("- Run `npm run lint` before committing");
  }
  lines.push("- Keep components small and focused");
  lines.push("- Write descriptive commit messages");
  lines.push("");

  lines.push("## Questions?");
  lines.push("");
  lines.push(
    "Open an issue or reach out to the team. We're happy to help!"
  );
  lines.push("");

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Helpers: download                                                  */
/* ------------------------------------------------------------------ */

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Simple CRC-32 implementation
function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function downloadAllAsZip(project: SimpleProject, stack: SimpleStack) {
  const files: { name: string; data: Uint8Array }[] = [
    {
      name: "CLAUDE.md",
      data: new TextEncoder().encode(generateClaudeMd(project, stack)),
    },
    {
      name: ".env.example",
      data: new TextEncoder().encode(generateEnvExample(stack)),
    },
    {
      name: "CONTRIBUTING.md",
      data: new TextEncoder().encode(generateContributingMd(project, stack)),
    },
  ];

  // Simple ZIP builder (store only, no compression)
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const local = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc32(file.data), true);
    lv.setUint32(18, file.data.length, true);
    lv.setUint32(22, file.data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    local.set(nameBytes, 30);
    localHeaders.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc32(file.data), true);
    cv.setUint32(20, file.data.length, true);
    cv.setUint32(24, file.data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralHeaders.push(central);

    offset += local.length + file.data.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const c of centralHeaders) centralDirSize += c.length;

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralDirSize, true);
  ev.setUint32(16, centralDirOffset, true);
  ev.setUint16(20, 0, true);

  const totalSize = offset + centralDirSize + 22;
  const result = new Uint8Array(totalSize);
  let pos = 0;
  for (let i = 0; i < files.length; i++) {
    result.set(localHeaders[i], pos);
    pos += localHeaders[i].length;
    result.set(files[i].data, pos);
    pos += files[i].data.length;
  }
  for (const c of centralHeaders) {
    result.set(c, pos);
    pos += c.length;
  }
  result.set(eocd, pos);

  const blob = new Blob([result], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName =
    (project.projectName || "starter-kit")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "starter-kit";
  a.download = `${safeName}-starter-kit.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function VibeQuizProgress({ step }: { step: number }) {
  return (
    <div className="mb-8 flex justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-2 w-16 rounded-full transition-all duration-500 sm:w-24 ${
            i <= step ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function BuildToolCard({
  option,
  selected,
  onSelect,
}: {
  option: (typeof BUILD_TOOL_OPTIONS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all sm:p-6 ${
        selected
          ? "border-accent bg-accent/10 shadow-md shadow-accent/10"
          : "border-border bg-card hover:border-accent/40 hover:shadow-sm"
      }`}
    >
      <span className="font-mono text-2xl text-accent">{option.icon}</span>
      <span
        className={`text-sm font-medium sm:text-base ${
          selected ? "text-accent" : "text-foreground"
        }`}
      >
        {option.label}
      </span>
    </button>
  );
}

function AppStatusCard({
  option,
  selected,
  onSelect,
}: {
  option: (typeof APP_STATUS_OPTIONS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-xl border-2 px-5 py-4 text-left transition-all ${
        selected
          ? "border-accent bg-accent/10 shadow-md shadow-accent/10"
          : "border-border bg-card hover:border-accent/40 hover:shadow-sm"
      }`}
    >
      <span
        className={`text-sm font-medium sm:text-base ${
          selected ? "text-accent" : "text-foreground"
        }`}
      >
        {option.label}
      </span>
    </button>
  );
}

function ExperienceCheckbox({
  option,
  checked,
  onToggle,
}: {
  option: (typeof EXPERIENCE_OPTIONS)[number];
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      className={`flex w-full items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all ${
        checked
          ? "border-accent bg-accent/10"
          : "border-border bg-card hover:border-accent/40"
      }`}
    >
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-accent bg-accent text-white"
            : "border-border"
        }`}
      >
        {checked && (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-sm font-medium sm:text-base ${
          checked ? "text-accent" : "text-foreground"
        }`}
      >
        {option.label}
      </span>
    </button>
  );
}

function LaunchStepCard({
  step,
  completed,
  expandable,
  showHelpLink,
}: {
  step: LaunchStep;
  completed: boolean;
  expandable: boolean;
  showHelpLink: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all ${
        completed
          ? "border-accent/20 bg-accent/5 opacity-60"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-4 p-5 sm:p-6">
        {/* Number badge */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${
            completed
              ? "bg-accent/20 text-accent"
              : "bg-accent text-white"
          }`}
        >
          {completed ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            step.number
          )}
        </div>

        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold ${
                completed
                  ? "text-muted line-through"
                  : "text-foreground"
              }`}
            >
              {step.title}
            </h3>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                DIFFICULTY_COLORS[step.difficulty]
              }`}
            >
              {step.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted">{step.explanation}</p>

          {expandable && !completed && (
            <>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-light"
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {expanded ? "Hide steps" : "How to do this"}
              </button>
              {expanded && (
                <div className="mt-3 space-y-2 rounded-lg border border-border bg-background p-4">
                  {step.howTo.map((instruction, i) => (
                    <p key={i} className="text-sm text-muted">
                      <span className="mr-2 font-mono text-accent">
                        {i + 1}.
                      </span>
                      {instruction}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}

          {showHelpLink &&
            !completed &&
            (step.difficulty === "Technical" ||
              step.difficulty === "Advanced") && (
              <a
                href="/#intake"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-light"
              >
                Need help with this step?
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            )}
        </div>
      </div>
    </div>
  );
}

function StarterKitSection({
  project,
  stack,
  setProject,
  setStack,
  ctaHeading,
  ctaText,
}: {
  project: SimpleProject;
  stack: SimpleStack;
  setProject: React.Dispatch<React.SetStateAction<SimpleProject>>;
  setStack: React.Dispatch<React.SetStateAction<SimpleStack>>;
  ctaHeading: string;
  ctaText: string;
}) {
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!project.projectName.trim()) return;
    setGenerated(true);
  };

  // Auto-set hosting based on framework
  const updateFramework = (fw: string) => {
    const hosting =
      fw === "Next.js"
        ? "Vercel"
        : fw === "React"
          ? "Vercel"
          : fw === "Python"
            ? "Railway"
            : "Vercel";
    setStack((s) => ({ ...s, frontend: fw, hosting }));
  };

  return (
    <div className="animate-fadeIn">
      {!generated ? (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="kit-project-name"
              className="mb-1.5 block text-sm font-medium"
            >
              Project Name <span className="text-accent">*</span>
            </label>
            <input
              id="kit-project-name"
              type="text"
              value={project.projectName}
              onChange={(e) =>
                setProject((p) => ({ ...p, projectName: e.target.value }))
              }
              aria-required="true"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="My Awesome App"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Framework
            </label>
            <div className="flex flex-wrap gap-2">
              {SIMPLE_FRAMEWORK_OPTIONS.map((fw) => (
                <button
                  key={fw}
                  type="button"
                  onClick={() => updateFramework(fw)}
                  aria-pressed={stack.frontend === fw}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    stack.frontend === fw
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Database
            </label>
            <div className="flex flex-wrap gap-2">
              {SIMPLE_DATABASE_OPTIONS.map((db) => (
                <button
                  key={db}
                  type="button"
                  onClick={() => setStack((s) => ({ ...s, database: db }))}
                  aria-pressed={stack.database === db}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    stack.database === db
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {db}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!project.projectName.trim()}
            className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Starter Kit
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-medium">CLAUDE.md</p>
              <p className="text-sm text-muted">
                Tells AI assistants everything about your project. Drop this
                in your project root.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                downloadFile("CLAUDE.md", generateClaudeMd(project, stack))
              }
              className="shrink-0 rounded-lg border border-accent bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Download
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-medium">.env.example</p>
              <p className="text-sm text-muted">
                Template for your environment variables. Copy to .env.local
                and fill in real values.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                downloadFile(".env.example", generateEnvExample(stack))
              }
              className="shrink-0 rounded-lg border border-accent bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Download
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-medium">CONTRIBUTING.md</p>
              <p className="text-sm text-muted">
                Guide for anyone who wants to contribute to your project.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                downloadFile(
                  "CONTRIBUTING.md",
                  generateContributingMd(project, stack)
                )
              }
              className="shrink-0 rounded-lg border border-accent bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Download
            </button>
          </div>

          <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center">
            <p className="mb-1 font-semibold">Download Everything</p>
            <p className="mb-4 text-sm text-muted">
              Get all three files in a single zip.
            </p>
            <button
              type="button"
              onClick={() => downloadAllAsZip(project, stack)}
              className="rounded-lg bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-light"
            >
              Download Starter Kit (.zip)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setGenerated(false)}
            className="mt-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Change settings and regenerate
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <p className="mb-1 text-xl font-bold">{ctaHeading}</p>
        <p className="mb-6 text-muted">{ctaText}</p>
        <a
          href="/#intake"
          className="inline-block rounded-lg bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-light"
        >
          Book a Free Call
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Path result pages                                                  */
/* ------------------------------------------------------------------ */

function PathBeginner({
  answers,
  onShowKit,
}: {
  answers: VibeAnswers;
  onShowKit: () => void;
}) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-10 text-center">
        <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
          Your Results
        </p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-4xl">
          Real talk: here&apos;s what stands between you and a live app
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          You built something &mdash; that&apos;s huge. But getting it from
          your computer to the internet takes a few more steps. Here&apos;s
          what&apos;s involved:
        </p>
      </div>

      <div className="space-y-3">
        {LAUNCH_STEPS.map((step) => (
          <LaunchStepCard
            key={step.number}
            step={step}
            completed={false}
            expandable={false}
            showHelpLink={false}
          />
        ))}
      </div>

      {/* Primary CTA */}
      <div className="mt-12 rounded-2xl border-2 border-accent/30 bg-accent/5 p-8 text-center sm:p-10">
        <h3 className="mb-3 text-2xl font-bold">
          Let us handle all of this.
        </h3>
        <p className="mx-auto mb-6 max-w-xl text-muted">
          Girl Code specializes in taking vibecoded apps from localhost to
          production. We&apos;ve done it dozens of times. Book a free
          discovery call and we&apos;ll map out exactly what your app needs.
        </p>
        <a
          href="/#intake"
          className="inline-block rounded-lg bg-accent px-10 py-4 text-lg font-medium text-white transition-colors hover:bg-accent-light"
        >
          Book a Discovery Call
        </a>
      </div>

      {/* Secondary CTA */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onShowKit}
          className="text-sm font-medium text-accent transition-colors hover:text-accent-light"
        >
          I want to try some of this myself
          <svg
            className="ml-1 inline h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PathGettingThere({
  answers,
  onShowKit,
}: {
  answers: VibeAnswers;
  onShowKit: () => void;
}) {
  const completedSteps = useMemo(
    () => getCompletedStepIds(answers),
    [answers]
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-10 text-center">
        <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
          Your Results
        </p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-4xl">
          You&apos;ve got a head start &mdash; here&apos;s what&apos;s left
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          You already know some of the basics. Here&apos;s a personalized
          checklist of what you still need:
        </p>
      </div>

      <div className="space-y-3">
        {LAUNCH_STEPS.map((step) => (
          <LaunchStepCard
            key={step.number}
            step={step}
            completed={completedSteps.has(step.number)}
            expandable={true}
            showHelpLink={true}
          />
        ))}
      </div>

      {/* Primary CTA */}
      <div className="mt-12 rounded-2xl border-2 border-accent/30 bg-accent/5 p-8 text-center sm:p-10">
        <h3 className="mb-3 text-2xl font-bold">
          Want us to handle the tricky parts?
        </h3>
        <p className="mx-auto mb-6 max-w-xl text-muted">
          You&apos;ve got the basics down. Let Girl Code handle the
          technical and advanced steps so you can focus on your product.
        </p>
        <a
          href="/#intake"
          className="inline-block rounded-lg bg-accent px-10 py-4 text-lg font-medium text-white transition-colors hover:bg-accent-light"
        >
          Book a Discovery Call
        </a>
      </div>

      {/* Secondary CTA */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onShowKit}
          className="text-sm font-medium text-accent transition-colors hover:text-accent-light"
        >
          Download your starter kit
          <svg
            className="ml-1 inline h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PathReady() {
  return (
    <div className="animate-fadeIn">
      <div className="mb-10 text-center">
        <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
          Your Results
        </p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-4xl">
          You know what you&apos;re doing &mdash; here&apos;s your starter
          kit
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Select your stack and download production-ready config files.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function LaunchPage() {
  /* --- state --- */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Vibe check quiz state
  const [quizStep, setQuizStep] = useState(0); // 0, 1, 2
  const [answers, setAnswers] = useState<VibeAnswers>({
    buildTool: null,
    appStatus: null,
    experience: new Set<ExperienceKey>(),
  });
  const [showResults, setShowResults] = useState(false);
  const [showStarterKit, setShowStarterKit] = useState(false);

  // Path C file generation state
  const [kitProject, setKitProject] = useState<SimpleProject>({
    projectName: "",
  });
  const [kitStack, setKitStack] = useState<SimpleStack>({
    frontend: "Next.js",
    backend: "Node.js",
    database: "Supabase",
    hosting: "Vercel",
  });

  const starterKitRef = useRef<HTMLDivElement>(null);

  /* --- derived --- */
  const resultPath = useMemo(() => calculatePath(answers), [answers]);

  /* --- handlers --- */
  const selectBuildTool = useCallback((tool: BuildTool) => {
    setAnswers((prev) => ({ ...prev, buildTool: tool }));
    // Auto-advance after a brief pause so the selection feels acknowledged
    setTimeout(() => setQuizStep(1), 300);
  }, []);

  const selectAppStatus = useCallback((status: AppStatus) => {
    setAnswers((prev) => ({ ...prev, appStatus: status }));
    setTimeout(() => setQuizStep(2), 300);
  }, []);

  const toggleExperience = useCallback((key: ExperienceKey) => {
    setAnswers((prev) => {
      const next = new Set(prev.experience);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return { ...prev, experience: next };
    });
  }, []);

  const finishQuiz = useCallback(() => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleShowKit = useCallback(() => {
    setShowStarterKit(true);
    setTimeout(() => {
      starterKitRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizStep(0);
    setAnswers({ buildTool: null, appStatus: null, experience: new Set() });
    setShowResults(false);
    setShowStarterKit(false);
    setKitProject({ projectName: "" });
    setKitStack({
      frontend: "Next.js",
      backend: "Node.js",
      database: "Supabase",
      hosting: "Vercel",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* --- render --- */
  return (
    <div className="min-h-screen font-sans">
      {/* ============================================================ */}
      {/*  Nav (matches homepage)                                       */}
      {/* ============================================================ */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="text-lg font-semibold tracking-tight">
            girl code<span className="text-accent">.</span>
          </a>
          <div className="hidden items-center gap-8 text-sm sm:flex">
            <a
              href="/#services"
              className="text-muted transition-colors hover:text-foreground"
            >
              Services
            </a>
            <a
              href="/#about"
              className="text-muted transition-colors hover:text-foreground"
            >
              About
            </a>
            <a
              href="/launch"
              className="font-medium text-accent transition-colors hover:text-accent-light"
            >
              Launch
            </a>
            <a
              href="/#intake"
              className="rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-light"
            >
              Work With Us
            </a>
          </div>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-foreground sm:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-6 py-4 sm:hidden">
            <div className="flex flex-col gap-4 text-sm">
              <a
                href="/#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted transition-colors hover:text-foreground"
              >
                Services
              </a>
              <a
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted transition-colors hover:text-foreground"
              >
                About
              </a>
              <a
                href="/launch"
                onClick={() => setMobileMenuOpen(false)}
                className="font-medium text-accent transition-colors hover:text-accent-light"
              >
                Launch
              </a>
              <a
                href="/#intake"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-accent px-4 py-2 text-center text-white transition-colors hover:bg-accent-light"
              >
                Work With Us
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/*  Hero                                                         */}
      {/* ============================================================ */}
      <section className="px-6 pt-28 pb-10 text-center sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
            Vibe to Production
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            You built it with AI.
            <br />
            <span className="text-muted">
              Now let&apos;s ship it for real.
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Take the vibe check and we&apos;ll show you exactly what it
            takes to get your app from &ldquo;it works on my laptop&rdquo;
            to live on the internet.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Quiz OR Results                                              */}
      {/* ============================================================ */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          {!showResults ? (
            /* ============================== */
            /*  THE VIBE CHECK QUIZ            */
            /* ============================== */
            <div>
              <VibeQuizProgress step={quizStep} />

              {/* Q1: Build Tool */}
              {quizStep === 0 && (
                <div className="animate-fadeIn">
                  <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                    Let&apos;s see where you&apos;re at
                  </h2>
                  <p className="mb-8 text-center text-muted">
                    Quick vibe check &mdash; three questions, no wrong
                    answers.
                  </p>
                  <p className="mb-4 font-medium">
                    How did you build your app?
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {BUILD_TOOL_OPTIONS.map((opt) => (
                      <BuildToolCard
                        key={opt.key}
                        option={opt}
                        selected={answers.buildTool === opt.key}
                        onSelect={() => selectBuildTool(opt.key)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Q2: App Status */}
              {quizStep === 1 && (
                <div className="animate-fadeIn">
                  <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                    Where is your app right now?
                  </h2>
                  <p className="mb-8 text-center text-muted">
                    No judgment &mdash; most people start right here.
                  </p>
                  <div className="space-y-3">
                    {APP_STATUS_OPTIONS.map((opt) => (
                      <AppStatusCard
                        key={opt.key}
                        option={opt}
                        selected={answers.appStatus === opt.key}
                        onSelect={() => selectAppStatus(opt.key)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuizStep(0)}
                    className="mt-6 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    Back
                  </button>
                </div>
              )}

              {/* Q3: Experience */}
              {quizStep === 2 && (
                <div className="animate-fadeIn">
                  <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                    Have you done any of these before?
                  </h2>
                  <p className="mb-8 text-center text-muted">
                    Check all that apply. It&apos;s totally fine if
                    it&apos;s none of them.
                  </p>
                  <div className="space-y-3">
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <ExperienceCheckbox
                        key={opt.key}
                        option={opt}
                        checked={answers.experience.has(opt.key)}
                        onToggle={() => toggleExperience(opt.key)}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setQuizStep(1)}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={finishQuiz}
                      className="flex items-center gap-2 rounded-lg bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-light"
                    >
                      See My Results
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ============================== */
            /*  RESULTS                        */
            /* ============================== */
            <div>
              {/* Reset button */}
              <div className="mb-8 text-center">
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Retake the vibe check
                </button>
              </div>

              {/* Path A: Beginner */}
              {resultPath === "beginner" && (
                <PathBeginner
                  answers={answers}
                  onShowKit={handleShowKit}
                />
              )}

              {/* Path B: Getting There */}
              {resultPath === "getting-there" && (
                <PathGettingThere
                  answers={answers}
                  onShowKit={handleShowKit}
                />
              )}

              {/* Path C: Ready */}
              {resultPath === "ready" && <PathReady />}

              {/* Starter Kit section (always visible for Path C, toggled for A/B) */}
              {(resultPath === "ready" || showStarterKit) && (
                <div ref={starterKitRef} className="mt-8">
                  <StarterKitSection
                    project={kitProject}
                    stack={kitStack}
                    setProject={setKitProject}
                    setStack={setKitStack}
                    ctaHeading={
                      resultPath === "ready"
                        ? "Want a second opinion on your architecture?"
                        : "Need help getting to production?"
                    }
                    ctaText={
                      resultPath === "ready"
                        ? "Even experienced builders benefit from a fresh perspective. Book a free call and we'll review your setup."
                        : "Girl Code offers fractional CTO services and hands-on technical consulting. Let's get your vibe-coded app shipped properly."
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Footer (matches homepage)                                    */}
      {/* ============================================================ */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Girl Code. All rights reserved.
          </p>
          <a
            href="https://girlcode.technology"
            className="font-mono text-sm text-muted transition-colors hover:text-foreground"
          >
            girlcode.technology
          </a>
        </div>
      </footer>

      {/* Inline styles for animation (Tailwind v4 compatible) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
