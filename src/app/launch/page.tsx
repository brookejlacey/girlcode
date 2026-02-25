"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProjectInfo {
  projectName: string;
  builtWith: string;
  appType: string;
  description: string;
}

interface StackInfo {
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  howTo: string;
  checked: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AI_TOOLS = [
  "Cursor",
  "Claude",
  "ChatGPT",
  "Bolt",
  "Lovable",
  "Replit",
  "Other",
];

const APP_TYPES = [
  "Web App",
  "Mobile App",
  "API / Backend",
  "Landing Page",
  "E-commerce",
  "Other",
];

const FRONTEND_OPTIONS = [
  "React",
  "Next.js",
  "Vue",
  "Svelte",
  "HTML / CSS",
  "React Native",
  "Expo",
  "Flutter",
  "I'm not sure",
];

const BACKEND_OPTIONS = ["Node.js", "Python", "Go", "Rust", "I'm not sure"];

const DATABASE_OPTIONS = [
  "None yet",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Supabase",
  "Firebase",
];

const HOSTING_OPTIONS = [
  "None yet",
  "Vercel",
  "Netlify",
  "AWS",
  "Railway",
  "Render",
];

const STEP_LABELS = [
  "Your Project",
  "Your Stack",
  "Setup Checklist",
  "Starter Kit",
];

/* ------------------------------------------------------------------ */
/*  Helpers: checklist generation                                      */
/* ------------------------------------------------------------------ */

function buildChecklist(
  project: ProjectInfo,
  stack: StackInfo
): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Always include GitHub
  items.push({
    id: "github",
    title: "Create a GitHub account & repository",
    description:
      "GitHub is where your code lives. It keeps a history of every change and makes collaboration easy.",
    howTo:
      '1. Go to github.com and sign up (it\'s free).\n2. Click the green "New" button to create a repository.\n3. Name it after your project (lowercase, dashes instead of spaces).\n4. Check "Add a README" and click "Create repository".\n5. In your terminal run: git remote add origin <your-repo-url> && git push -u origin main',
    checked: false,
  });

  // Database-specific
  if (stack.database === "Supabase") {
    items.push({
      id: "supabase",
      title: "Set up Supabase for your database",
      description:
        "Supabase gives you a Postgres database, auth, and real-time features out of the box.",
      howTo:
        "1. Go to supabase.com and sign in with GitHub.\n2. Click \"New Project\" and pick a name + password.\n3. Once it's ready, go to Settings > API and copy your URL and anon key.\n4. Install the client: npm install @supabase/supabase-js\n5. Create a file src/lib/supabase.ts and initialize the client with your URL and key.",
      checked: false,
    });
  } else if (stack.database === "Firebase") {
    items.push({
      id: "firebase",
      title: "Set up Firebase for your database",
      description:
        "Firebase provides a NoSQL database, auth, hosting, and more from Google.",
      howTo:
        '1. Go to console.firebase.google.com and create a project.\n2. Enable Firestore Database from the left menu.\n3. Install the SDK: npm install firebase\n4. Copy your config object from Project Settings > General.\n5. Create a file src/lib/firebase.ts and paste in the config with initializeApp().',
      checked: false,
    });
  } else if (
    stack.database === "PostgreSQL" ||
    stack.database === "MySQL"
  ) {
    items.push({
      id: "db-hosted",
      title: `Set up a hosted ${stack.database} database`,
      description: `You'll need a cloud-hosted ${stack.database} instance so your app can connect to it in production.`,
      howTo: `1. Easy options: Railway, Neon (free Postgres), or Supabase (free Postgres). For MySQL, try Railway or PlanetScale (paid only).\n2. Create an account and provision a new database.\n3. Copy the connection string (it looks like ${stack.database === "PostgreSQL" ? "postgresql://user:pass@host:5432/db" : "mysql://user:pass@host:3306/db"}).\n4. Add it to your .env file as DATABASE_URL.\n5. Make sure your ORM or query builder is configured to read from DATABASE_URL.`,
      checked: false,
    });
  } else if (stack.database === "MongoDB") {
    items.push({
      id: "mongodb",
      title: "Set up MongoDB Atlas",
      description:
        "MongoDB Atlas is the easiest way to get a cloud-hosted MongoDB database.",
      howTo:
        '1. Go to mongodb.com/atlas and sign up for a free cluster.\n2. Create a cluster (the free M0 tier is fine to start).\n3. Set up a database user and whitelist your IP (or 0.0.0.0/0 for development).\n   \u26a0\ufe0f Warning: Only use 0.0.0.0/0 for development. In production, restrict to your server\'s IP address.\n4. Click "Connect" and copy the connection string.\n5. Install the driver: npm install mongodb (or mongoose for an ODM).\n6. Add the connection string to your .env as MONGODB_URI.',
      checked: false,
    });
  }

  // Hosting-specific
  if (stack.hosting === "Vercel") {
    items.push({
      id: "vercel",
      title: "Deploy to Vercel",
      description:
        "Vercel is the easiest way to deploy Next.js, React, and other frontend frameworks.",
      howTo:
        "1. Go to vercel.com and sign in with GitHub.\n2. Click \"Import Project\" and select your GitHub repo.\n3. Vercel auto-detects your framework and builds it.\n4. Add your environment variables in Settings > Environment Variables.\n5. Every push to main auto-deploys. That's it!",
      checked: false,
    });
  } else if (stack.hosting === "Netlify") {
    items.push({
      id: "netlify",
      title: "Deploy to Netlify",
      description:
        "Netlify is great for static sites, JAMstack apps, and serverless functions.",
      howTo:
        '1. Go to netlify.com and sign in with GitHub.\n2. Click "New site from Git" and pick your repo.\n3. Set the build command (e.g., npm run build) and publish directory (e.g., out or .next).\n4. Add environment variables in Site Settings > Environment.\n5. Netlify auto-deploys on every push to your main branch.',
      checked: false,
    });
  } else if (stack.hosting === "Railway") {
    items.push({
      id: "railway",
      title: "Deploy to Railway",
      description:
        "Railway is great for full-stack apps, APIs, and databases all in one place.",
      howTo:
        '1. Go to railway.app and sign in with GitHub.\n2. Click "New Project" > "Deploy from GitHub repo".\n3. Select your repo and Railway will auto-detect the framework.\n4. Add environment variables in the Variables tab.\n5. Railway gives you a free .up.railway.app URL, or connect your own domain.',
      checked: false,
    });
  } else if (stack.hosting === "Render") {
    items.push({
      id: "render",
      title: "Deploy to Render",
      description:
        "Render is a modern cloud platform for web apps, APIs, and static sites.",
      howTo:
        '1. Go to render.com and sign in with GitHub.\n2. Click "New" and pick Web Service (for APIs) or Static Site.\n3. Connect your GitHub repo.\n4. Set the build command and start command.\n5. Add environment variables in the Environment tab.\n6. Render auto-deploys on push.',
      checked: false,
    });
  } else if (stack.hosting === "AWS") {
    items.push({
      id: "aws",
      title: "Deploy to AWS",
      description:
        "AWS is powerful but has a steeper learning curve. Consider AWS Amplify for the easiest path.",
      howTo:
        '1. For the easiest path, use AWS Amplify: go to console.aws.amazon.com/amplify.\n2. Click "New app" > "Host web app" and connect your GitHub repo.\n3. Amplify auto-detects your framework and builds it.\n4. Add environment variables in "Environment variables".\n5. For more control, look into Elastic Beanstalk, ECS, or Lambda.',
      checked: false,
    });
  }

  // Environment variables (always relevant)
  items.push({
    id: "env-vars",
    title: "Set up environment variables",
    description:
      "Environment variables keep your secrets (API keys, database passwords) safe and separate from your code.",
    howTo:
      "1. Create a file called .env.local in the root of your project (never commit this!).\n2. Add your secrets like: DATABASE_URL=your_connection_string\n3. Create a .env.example file (no real values) so others know which vars are needed.\n4. Add .env.local to your .gitignore file.\n5. In your hosting provider, add the same variables in their dashboard.",
    checked: false,
  });

  // CLAUDE.md (always)
  items.push({
    id: "claude-md",
    title: "Add a CLAUDE.md to your project",
    description:
      "CLAUDE.md tells AI coding assistants about your project. It makes every AI interaction better.",
    howTo:
      '1. Create a file called CLAUDE.md in the root of your project.\n2. Include: project description, tech stack, folder structure, coding conventions.\n3. Use the "Download Starter Kit" in the next step to get a tailored one!\n4. Commit it to your repo so any AI tool can read it.\n5. Update it as your project evolves.',
    checked: false,
  });

  // Git ignore
  items.push({
    id: "gitignore",
    title: "Verify your .gitignore",
    description:
      "A .gitignore file tells Git which files to ignore. This keeps secrets and junk out of your repo.",
    howTo:
      "1. Check that you have a .gitignore in your project root.\n2. Make sure it includes: node_modules/, .env, .env.local, .DS_Store, dist/, .next/\n3. If you're using a framework, it probably created one for you already.\n4. You can find templates at github.com/github/gitignore.\n5. Never commit node_modules or .env files!",
    checked: false,
  });

  // Domain (if they have hosting)
  if (stack.hosting !== "None yet") {
    items.push({
      id: "domain",
      title: "Connect a custom domain (optional)",
      description:
        "A custom domain makes your app look professional (e.g., myapp.com instead of myapp.vercel.app).",
      howTo:
        "1. Buy a domain from Namecheap, Cloudflare, or Squarespace Domains (about $10/year).\n2. In your hosting provider's dashboard, go to Domains or Custom Domains.\n3. Add your domain and follow their DNS instructions.\n4. Usually you need to add a CNAME or A record at your domain registrar.\n5. Wait up to 48 hours for DNS to propagate (usually much faster).",
      checked: false,
    });
  }

  // TypeScript config
  if (
    stack.frontend === "React" ||
    stack.frontend === "Next.js" ||
    stack.frontend === "Vue" ||
    stack.frontend === "Svelte"
  ) {
    items.push({
      id: "typescript",
      title: "Make sure TypeScript is set up",
      description:
        "TypeScript catches bugs before they happen. Most AI tools generate TypeScript by default.",
      howTo:
        '1. Check if you have a tsconfig.json in your project root. If yes, you\'re good!\n2. If not, run: npx tsc --init\n3. For Next.js: it sets up TypeScript automatically when you create the project.\n4. For React (Vite): run npm create vite@latest my-app -- --template react-ts\n5. Make sure your files use .tsx (for JSX) or .ts extensions.',
      checked: false,
    });
  }

  // Linting
  items.push({
    id: "linting",
    title: "Set up a linter (ESLint)",
    description:
      "A linter finds common mistakes and enforces consistent code style across your project.",
    howTo:
      "1. If you used create-next-app or Vite, ESLint may already be set up.\n2. Check for an eslint.config.js or .eslintrc file in your project.\n3. If not installed: npm install -D eslint && npx eslint --init\n4. Add a lint script to package.json: \"lint\": \"eslint .\"\n5. Run npm run lint to check for issues.",
    checked: false,
  });

  return items;
}

/* ------------------------------------------------------------------ */
/*  Helpers: file generation                                           */
/* ------------------------------------------------------------------ */

function generateClaudeMd(project: ProjectInfo, stack: StackInfo): string {
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
  lines.push(`**Type:** ${project.appType || "TBD"}`);
  lines.push(`**Built With:** ${project.builtWith || "TBD"}`);
  if (project.description) {
    lines.push("");
    lines.push(`**Description:** ${project.description}`);
  }
  lines.push("");

  lines.push("## Tech Stack");
  lines.push("");
  if (stack.frontend && stack.frontend !== "I'm not sure") {
    lines.push(`- **Frontend:** ${stack.frontend}`);
  }
  if (stack.backend && stack.backend !== "I'm not sure") {
    lines.push(`- **Backend:** ${stack.backend}`);
  }
  if (stack.database && stack.database !== "None yet") {
    lines.push(`- **Database:** ${stack.database}`);
  }
  if (stack.hosting && stack.hosting !== "None yet") {
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
  } else if (stack.frontend === "Vue") {
    lines.push("```");
    lines.push("├── src/");
    lines.push("│   ├── components/       # Vue components");
    lines.push("│   ├── views/            # Page-level views");
    lines.push("│   ├── router/           # Vue Router config");
    lines.push("│   ├── stores/           # Pinia stores");
    lines.push("│   └── App.vue           # Root component");
    lines.push("├── public/               # Static assets");
    lines.push("├── .env                  # Environment variables");
    lines.push("├── package.json          # Dependencies and scripts");
    lines.push("└── CLAUDE.md             # This file");
    lines.push("```");
  } else if (stack.frontend === "Svelte") {
    lines.push("```");
    lines.push("├── src/");
    lines.push("│   ├── lib/              # Shared components and utilities");
    lines.push("│   ├── routes/           # SvelteKit routes");
    lines.push("│   └── app.html          # HTML template");
    lines.push("├── static/               # Static assets");
    lines.push("├── .env                  # Environment variables");
    lines.push("├── package.json          # Dependencies and scripts");
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
  lines.push("```bash");
  lines.push("npm install          # Install dependencies");
  if (stack.frontend === "Next.js") {
    lines.push("npm run dev          # Start development server (localhost:3000)");
    lines.push("npm run build        # Build for production");
    lines.push("npm run start        # Start production server");
    lines.push("npm run lint         # Run ESLint");
  } else {
    lines.push("npm run dev          # Start development server");
    lines.push("npm run build        # Build for production");
    lines.push("npm run lint         # Run linter");
  }
  lines.push("```");
  lines.push("");

  lines.push("## Coding Conventions");
  lines.push("");
  lines.push("- Use TypeScript for all new files (.ts / .tsx)");
  lines.push("- Use functional components with hooks (no class components)");
  lines.push("- Keep components small and focused (under 150 lines ideally)");
  lines.push("- Use descriptive variable names (avoid single-letter names)");
  lines.push("- Put reusable logic in custom hooks or utility functions");
  lines.push("- Handle loading and error states in all data-fetching components");
  lines.push("- Use environment variables for all secrets and API keys");
  lines.push(
    '- Never hardcode URLs, keys, or secrets in source code'
  );
  lines.push("");

  if (stack.database && stack.database !== "None yet") {
    lines.push("## Database");
    lines.push("");
    lines.push(`This project uses **${stack.database}**.`);
    if (stack.database === "Supabase") {
      lines.push(
        "- Supabase client is initialized in src/lib/supabase.ts"
      );
      lines.push(
        "- Use the Supabase dashboard to manage tables and RLS policies"
      );
      lines.push("- Row Level Security (RLS) should be enabled on all tables");
    } else if (stack.database === "Firebase") {
      lines.push("- Firebase is initialized in src/lib/firebase.ts");
      lines.push(
        "- Use Firestore for document storage, Authentication for users"
      );
      lines.push("- Set up security rules in the Firebase console");
    }
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
  lines.push(
    "- Suggest tests when adding new features or fixing bugs"
  );
  lines.push(
    "- If unsure about a design decision, explain the trade-offs"
  );
  lines.push(
    "- Do not install new dependencies without explaining why they're needed"
  );
  lines.push("");

  return lines.join("\n");
}

function getPublicPrefix(stack: StackInfo): string {
  if (stack.frontend === "Next.js") return "NEXT_PUBLIC_";
  if (stack.frontend === "Vue" || stack.frontend === "Svelte") {
    // Nuxt/Vite use VITE_, SvelteKit uses PUBLIC_
    return stack.frontend === "Svelte" ? "PUBLIC_" : "VITE_";
  }
  return "";
}

function generateEnvExample(stack: StackInfo): string {
  const lines: string[] = [];
  const pub = getPublicPrefix(stack);

  lines.push("# ===========================================");
  lines.push("# Environment Variables");
  lines.push("# ===========================================");
  lines.push("# Copy this file to .env.local and fill in your values.");
  lines.push("# NEVER commit .env.local to version control!");
  lines.push("# ===========================================");
  lines.push("");

  lines.push("# App");
  lines.push(`${pub}APP_URL=http://localhost:3000`);
  lines.push("");

  if (stack.database === "Supabase") {
    lines.push("# Supabase");
    lines.push(`${pub}SUPABASE_URL=your_supabase_project_url`);
    lines.push(`${pub}SUPABASE_ANON_KEY=your_supabase_anon_key`);
    lines.push("SUPABASE_SERVICE_ROLE_KEY=your_service_role_key");
    lines.push("");
  }

  if (stack.database === "Firebase") {
    lines.push("# Firebase");
    lines.push(`${pub}FIREBASE_API_KEY=your_api_key`);
    lines.push(`${pub}FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com`);
    lines.push(`${pub}FIREBASE_PROJECT_ID=your_project_id`);
    lines.push(
      `${pub}FIREBASE_STORAGE_BUCKET=your_project.appspot.com`
    );
    lines.push(`${pub}FIREBASE_MESSAGING_SENDER_ID=your_sender_id`);
    lines.push(`${pub}FIREBASE_APP_ID=your_app_id`);
    lines.push("");
  }

  if (stack.database === "PostgreSQL" || stack.database === "MySQL") {
    lines.push("# Database");
    lines.push(
      `DATABASE_URL=${stack.database === "PostgreSQL" ? "postgresql" : "mysql"}://user:password@host:${stack.database === "PostgreSQL" ? "5432" : "3306"}/dbname`
    );
    lines.push("");
  }

  if (stack.database === "MongoDB") {
    lines.push("# MongoDB");
    lines.push(
      "MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname"
    );
    lines.push("");
  }

  lines.push("# Add additional API keys below");
  lines.push("# OPENAI_API_KEY=your_openai_key");
  lines.push("# STRIPE_SECRET_KEY=your_stripe_key");
  lines.push("");

  return lines.join("\n");
}

function generateContributing(
  project: ProjectInfo,
  stack: StackInfo
): string {
  const lines: string[] = [];

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
  const isPython = stack.backend === "Python";
  const isGo = stack.backend === "Go";
  const isRust = stack.backend === "Rust";
  const isNodeBased = !isPython && !isGo && !isRust;
  if (isNodeBased) {
    lines.push("- [Node.js](https://nodejs.org/) (v18 or later)");
  }
  if (isPython) {
    lines.push("- [Python](https://python.org/) (3.10 or later)");
  }
  if (isGo) {
    lines.push("- [Go](https://go.dev/) (1.21 or later)");
  }
  if (isRust) {
    lines.push("- [Rust](https://rustup.rs/) (latest stable)");
  }
  lines.push("- [Git](https://git-scm.com/)");
  lines.push(
    "- A code editor ([VS Code](https://code.visualstudio.com/) recommended)"
  );
  if (stack.database === "Supabase") {
    lines.push(
      "- A [Supabase](https://supabase.com) account (free tier is fine)"
    );
  } else if (stack.database === "Firebase") {
    lines.push(
      "- A [Firebase](https://firebase.google.com) account (free tier is fine)"
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
    lines.push("source venv/bin/activate  # On Windows: venv\\Scripts\\activate");
    lines.push("pip install -r requirements.txt");
  } else if (isGo) {
    lines.push("# 2. Install dependencies");
    lines.push("go mod download");
  } else if (isRust) {
    lines.push("# 2. Build the project");
    lines.push("cargo build");
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
    lines.push("python manage.py runserver  # Django");
    lines.push("# or: flask run             # Flask");
    lines.push("# or: uvicorn main:app      # FastAPI");
  } else if (isGo) {
    lines.push("# 4. Start the development server");
    lines.push("go run .");
  } else if (isRust) {
    lines.push("# 4. Start the development server");
    lines.push("cargo run");
  } else {
    lines.push("# 4. Start the development server");
    lines.push("npm run dev");
  }
  lines.push("```");
  lines.push("");

  lines.push("## Making Changes");
  lines.push("");
  lines.push("1. Create a new branch: `git checkout -b feature/your-feature`");
  lines.push("2. Make your changes");
  lines.push("3. Test your changes locally");
  lines.push("4. Commit with a clear message: `git commit -m \"Add: brief description\"`");
  lines.push("5. Push to your fork: `git push origin feature/your-feature`");
  lines.push("6. Open a Pull Request");
  lines.push("");

  lines.push("## Code Style");
  lines.push("");
  if (isPython) {
    lines.push("- Follow PEP 8 style guidelines");
    lines.push("- Run your linter before committing");
  } else if (isGo) {
    lines.push("- Run `go fmt` and `go vet` before committing");
  } else if (isRust) {
    lines.push("- Run `cargo fmt` and `cargo clippy` before committing");
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

function downloadAllAsZip(
  project: ProjectInfo,
  stack: StackInfo
) {
  // Build a minimal zip manually (store-only, no compression) so we avoid
  // pulling in a dependency. Works for the small text files we're creating.
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
      data: new TextEncoder().encode(generateContributing(project, stack)),
    },
  ];

  // Simple ZIP builder (store only, no compression)
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    // Local file header (30 + name length)
    const local = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0, true); // flags
    lv.setUint16(8, 0, true); // compression (store)
    lv.setUint16(10, 0, true); // mod time
    lv.setUint16(12, 0, true); // mod date
    // CRC-32 - compute simple
    lv.setUint32(14, crc32(file.data), true);
    lv.setUint32(18, file.data.length, true); // compressed size
    lv.setUint32(22, file.data.length, true); // uncompressed size
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true); // extra length
    local.set(nameBytes, 30);
    localHeaders.push(local);

    // Central directory header (46 + name length)
    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0, true); // flags
    cv.setUint16(10, 0, true); // compression
    cv.setUint16(12, 0, true); // mod time
    cv.setUint16(14, 0, true); // mod date
    cv.setUint32(16, crc32(file.data), true);
    cv.setUint32(20, file.data.length, true);
    cv.setUint32(24, file.data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); // extra length
    cv.setUint16(32, 0, true); // comment length
    cv.setUint16(34, 0, true); // disk number start
    cv.setUint16(36, 0, true); // internal attrs
    cv.setUint32(38, 0, true); // external attrs
    cv.setUint32(42, offset, true); // offset of local header
    central.set(nameBytes, 46);
    centralHeaders.push(central);

    offset += local.length + file.data.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const c of centralHeaders) centralDirSize += c.length;

  // End of central directory (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // signature
  ev.setUint16(4, 0, true); // disk number
  ev.setUint16(6, 0, true); // disk with CD
  ev.setUint16(8, files.length, true); // entries on disk
  ev.setUint16(10, files.length, true); // total entries
  ev.setUint32(12, centralDirSize, true); // CD size
  ev.setUint32(16, centralDirOffset, true); // CD offset
  ev.setUint16(20, 0, true); // comment length

  // Concatenate everything
  const totalSize =
    offset + centralDirSize + 22;
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
  const safeName = (project.projectName || "starter-kit")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "starter-kit";
  a.download = `${safeName}-starter-kit.zip`;
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

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-10">
      {/* Step labels */}
      <div className="mb-3 hidden gap-2 sm:flex">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 text-center text-xs font-medium transition-colors ${
              i <= step ? "text-accent" : "text-muted"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="mb-2 text-center text-xs font-medium text-accent sm:hidden">
        Step {step + 1} of {total}: {STEP_LABELS[step]}
      </div>
      {/* Bar */}
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function StepWrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="animate-fadeIn">
      <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="mb-8 text-muted">{subtitle}</p>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function StackOption({
  label,
  helperText,
  options,
  selected,
  onSelect,
}: {
  label: string;
  helperText?: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {helperText && (
        <p className="mb-2 text-xs text-muted">{helperText}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            aria-pressed={selected === opt}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              selected === opt
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChecklistItemCard({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border p-4 transition-all sm:p-5 ${
        item.checked
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(item.id)}
          role="checkbox"
          aria-checked={item.checked}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
            item.checked
              ? "border-accent bg-accent text-white"
              : "border-border hover:border-accent"
          }`}
          aria-label={item.checked ? "Uncheck item" : "Check item"}
        >
          {item.checked && (
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
        </button>
        <div className="flex-1">
          <p
            className={`font-medium transition-colors ${
              item.checked ? "text-accent" : "text-foreground"
            }`}
          >
            {item.title}
          </p>
          <p className="mt-1 text-sm text-muted">{item.description}</p>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-light"
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
            {expanded ? "Hide instructions" : "How to do this"}
          </button>
          {expanded && (
            <div className="mt-3 rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted">
              {item.howTo.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step Components                                                    */
/* ------------------------------------------------------------------ */

function Step1({
  project,
  setProject,
}: {
  project: ProjectInfo;
  setProject: React.Dispatch<React.SetStateAction<ProjectInfo>>;
}) {
  return (
    <StepWrapper
      title="What did you build?"
      subtitle="Tell us about the app you created with AI. No wrong answers here!"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="project-name" className="mb-1.5 block text-sm font-medium">
            Project Name <span className="text-accent">*</span>
          </label>
          <input
            id="project-name"
            type="text"
            value={project.projectName}
            onChange={(e) =>
              setProject((p) => ({ ...p, projectName: e.target.value }))
            }
            aria-required="true"
            required
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="My Awesome App"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            id="ai-tool"
            label="How did you build it?"
            value={project.builtWith}
            onChange={(v) => setProject((p) => ({ ...p, builtWith: v }))}
            options={AI_TOOLS}
            placeholder="Select your AI tool"
          />
          <SelectField
            id="app-type"
            label="What kind of app is it?"
            value={project.appType}
            onChange={(v) => setProject((p) => ({ ...p, appType: v }))}
            options={APP_TYPES}
            placeholder="Select app type"
          />
        </div>

        <div>
          <label htmlFor="project-description" className="mb-1.5 block text-sm font-medium">
            Brief Description
          </label>
          <textarea
            id="project-description"
            value={project.description}
            onChange={(e) =>
              setProject((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="What does your app do? Who is it for?"
          />
        </div>
      </div>
    </StepWrapper>
  );
}

function Step2({
  project,
  stack,
  setStack,
}: {
  project: ProjectInfo;
  stack: StackInfo;
  setStack: React.Dispatch<React.SetStateAction<StackInfo>>;
}) {
  // Auto-suggest based on project info
  const suggestion = useMemo(() => {
    const s: Partial<StackInfo> = {};
    if (
      project.appType === "Web App" ||
      project.appType === "Landing Page" ||
      project.appType === "E-commerce"
    ) {
      s.frontend = "Next.js";
      s.backend = "Node.js";
      s.hosting = "Vercel";
    } else if (project.appType === "API / Backend") {
      s.frontend = "I'm not sure";
      s.backend = "Node.js";
      s.hosting = "Railway";
    } else if (project.appType === "Mobile App") {
      s.frontend = "Expo";
      s.backend = "Node.js";
    }
    if (project.builtWith === "Bolt" || project.builtWith === "Lovable") {
      s.frontend = "React";
      s.hosting = "Netlify";
    }
    if (project.builtWith === "Replit") {
      s.backend = "Node.js";
      s.hosting = "Render";
    }
    return s;
  }, [project.appType, project.builtWith]);

  const hasSuggestion =
    suggestion.frontend || suggestion.backend || suggestion.hosting;

  const canAdvanceStep2 = stack.frontend !== "" || stack.backend !== "";

  return (
    <StepWrapper
      title="What's your app built with?"
      subtitle="Pick the technologies your app uses. We've made some suggestions based on your answers."
    >
      {hasSuggestion && (
        <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <p className="text-sm text-accent">
            <span className="font-semibold">Auto-suggestion:</span> Based on
            your project, we recommend{" "}
            {[suggestion.frontend, suggestion.backend, suggestion.hosting]
              .filter(Boolean)
              .join(" + ")}
            . Feel free to change anything!
          </p>
          <button
            type="button"
            onClick={() =>
              setStack((s) => ({
                ...s,
                frontend: suggestion.frontend || s.frontend,
                backend: suggestion.backend || s.backend,
                hosting: suggestion.hosting || s.hosting,
              }))
            }
            className="mt-3 rounded-lg border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Apply suggestions
          </button>
        </div>
      )}

      <div className="space-y-6">
        <StackOption
          label="Frontend"
          helperText="What users see in their browser"
          options={FRONTEND_OPTIONS}
          selected={stack.frontend}
          onSelect={(v) => setStack((s) => ({ ...s, frontend: v }))}
        />
        <StackOption
          label="Backend"
          helperText="The server that powers your app"
          options={BACKEND_OPTIONS}
          selected={stack.backend}
          onSelect={(v) => setStack((s) => ({ ...s, backend: v }))}
        />
        <StackOption
          label="Database"
          helperText="Where your app stores data"
          options={DATABASE_OPTIONS}
          selected={stack.database}
          onSelect={(v) => setStack((s) => ({ ...s, database: v }))}
        />
        <StackOption
          label="Hosting"
          helperText="Where your app lives on the internet"
          options={HOSTING_OPTIONS}
          selected={stack.hosting}
          onSelect={(v) => setStack((s) => ({ ...s, hosting: v }))}
        />
      </div>

      {!canAdvanceStep2 && (
        <p className="mt-4 text-sm text-muted">
          Pick at least a frontend or backend to continue
        </p>
      )}
    </StepWrapper>
  );
}

function Step3({
  checklist,
  toggleItem,
}: {
  checklist: ChecklistItem[];
  toggleItem: (id: string) => void;
}) {
  const completed = checklist.filter((i) => i.checked).length;

  return (
    <StepWrapper
      title="Your Setup Checklist"
      subtitle="Here's everything you need to get production-ready. Check items off as you go!"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-border">
          <div
            className="h-2 rounded-full bg-accent transition-all duration-500"
            style={{
              width: `${checklist.length > 0 ? (completed / checklist.length) * 100 : 0}%`,
            }}
          />
        </div>
        <span className="shrink-0 text-sm font-medium text-muted">
          {completed} / {checklist.length}
        </span>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => (
          <ChecklistItemCard
            key={item.id}
            item={item}
            onToggle={toggleItem}
          />
        ))}
      </div>
    </StepWrapper>
  );
}

function Step4({
  project,
  stack,
}: {
  project: ProjectInfo;
  stack: StackInfo;
}) {
  return (
    <StepWrapper
      title="Download Your Starter Kit"
      subtitle="We've generated files tailored to your project. Download them and drop them in your repo."
    >
      <div className="space-y-4">
        {/* CLAUDE.md */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="font-medium">CLAUDE.md</p>
            <p className="text-sm text-muted">
              Tells AI assistants everything about your project. Drop this in
              your project root.
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

        {/* .env.example */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="font-medium">.env.example</p>
            <p className="text-sm text-muted">
              Template for your environment variables. Copy to .env.local and
              fill in real values.
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

        {/* CONTRIBUTING.md */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="font-medium">CONTRIBUTING.md</p>
            <p className="text-sm text-muted">
              Guide for anyone who wants to contribute to your project. Great for
              open source!
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              downloadFile(
                "CONTRIBUTING.md",
                generateContributing(project, stack)
              )
            }
            className="shrink-0 rounded-lg border border-accent bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Download
          </button>
        </div>

        {/* Download All */}
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

        {/* CTA */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
          <p className="mb-1 text-xl font-bold">Need help getting to production?</p>
          <p className="mb-6 text-muted">
            Girl Code offers fractional CTO services and hands-on technical
            consulting. Let&apos;s get your vibe-coded app shipped properly.
          </p>
          <a
            href="/#intake"
            className="inline-block rounded-lg bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-light"
          >
            Book a Discovery Call
          </a>
        </div>
      </div>
    </StepWrapper>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function LaunchPage() {
  const [step, setStep] = useState(0);
  const [project, setProject] = useState<ProjectInfo>({
    projectName: "",
    builtWith: "",
    appType: "",
    description: "",
  });
  const [stack, setStack] = useState<StackInfo>({
    frontend: "",
    backend: "",
    database: "",
    hosting: "",
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastStackKeyRef = useRef("");

  const totalSteps = 4;

  const canAdvance = useMemo(() => {
    if (step === 0) return project.projectName.trim().length > 0;
    if (step === 1) return stack.frontend !== "" || stack.backend !== "";
    return true;
  }, [step, project.projectName, stack.frontend, stack.backend]);

  const goNext = useCallback(() => {
    if (step === 1) {
      // Only rebuild checklist if the stack actually changed
      const stackKey = JSON.stringify(stack);
      if (stackKey !== lastStackKeyRef.current) {
        const newItems = buildChecklist(project, stack);
        // Preserve checked state from previous checklist if items match
        const prevChecked = new Set(
          checklist.filter((i) => i.checked).map((i) => i.id)
        );
        setChecklist(
          newItems.map((item) => ({
            ...item,
            checked: prevChecked.has(item.id),
          }))
        );
        lastStackKeyRef.current = stackKey;
      }
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, project, stack, checklist]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {/* Nav */}
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
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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

      {/* Hero */}
      <section className="px-6 pt-28 pb-10 text-center sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
            Vibe to Production
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            You built it with AI.
            <br />
            <span className="text-muted">Now let&apos;s ship it for real.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            This free wizard walks you through everything you need to take your
            vibe-coded app from &ldquo;it works on my laptop&rdquo; to
            production-ready. No experience required.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <ProgressBar step={step} total={totalSteps} />

          {step === 0 && <Step1 project={project} setProject={setProject} />}
          {step === 1 && (
            <Step2 project={project} stack={stack} setStack={setStack} />
          )}
          {step === 2 && (
            <Step3 checklist={checklist} toggleItem={toggleChecklistItem} />
          )}
          {step === 3 && <Step4 project={project} stack={stack} />}

          {/* Navigation Buttons */}
          <div className="mt-10 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps - 1 && (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvance}
                className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
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
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Girl Code. All rights reserved.
          </p>
          <a href="https://girlcode.technology" className="font-mono text-sm text-muted hover:text-foreground transition-colors">girlcode.technology</a>
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
