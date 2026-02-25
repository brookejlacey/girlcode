/**
 * detect.js — Stack detection for vibecoded projects
 *
 * Scans the current working directory for configuration files and
 * dependency manifests to identify the project's tech stack.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Safely read and parse a JSON file. Returns null on any failure.
 */
function readJSON(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Safely read a text file and return its lines. Returns [] on failure.
 */
function readLines(filePath) {
  try {
    return readFileSync(filePath, 'utf-8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Check whether any of the given keys exist in an object (case-insensitive
 * match on the needle list, exact match on the object keys).
 */
function hasAny(obj, needles) {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj).map((k) => k.toLowerCase());
  return needles.some((n) => keys.includes(n.toLowerCase()));
}

/**
 * Return every matched needle that exists as a key in obj.
 */
function findAll(obj, needles) {
  if (!obj || typeof obj !== 'object') return [];
  const keys = Object.keys(obj).map((k) => k.toLowerCase());
  return needles.filter((n) => keys.includes(n.toLowerCase()));
}

// ── Detection rules ─────────────────────────────────────────────────────

const JS_FRAMEWORK_MAP = [
  { keys: ['next'], name: 'Next.js' },
  { keys: ['nuxt', 'nuxt3'], name: 'Nuxt' },
  { keys: ['@remix-run/react', '@remix-run/node'], name: 'Remix' },
  { keys: ['@sveltejs/kit'], name: 'SvelteKit' },
  { keys: ['svelte'], name: 'Svelte' },
  { keys: ['astro'], name: 'Astro' },
  { keys: ['gatsby'], name: 'Gatsby' },
  { keys: ['vite'], name: 'Vite' },
  { keys: ['vue'], name: 'Vue' },
  { keys: ['react'], name: 'React' },
  { keys: ['@angular/core'], name: 'Angular' },
  { keys: ['express'], name: 'Express' },
  { keys: ['fastify'], name: 'Fastify' },
  { keys: ['hono'], name: 'Hono' },
  { keys: ['expo'], name: 'Expo' },
  { keys: ['solid-js'], name: 'Solid.js' },
  { keys: ['electron'], name: 'Electron' },
];

const JS_TOOLS_MAP = [
  { keys: ['typescript', 'ts-node'], name: 'TypeScript' },
  { keys: ['tailwindcss', '@tailwindcss/postcss'], name: 'Tailwind CSS' },
  { keys: ['prisma', '@prisma/client'], name: 'Prisma' },
  { keys: ['drizzle-orm'], name: 'Drizzle' },
  { keys: ['@supabase/supabase-js', '@supabase/ssr'], name: 'Supabase' },
  { keys: ['firebase', 'firebase-admin'], name: 'Firebase' },
  { keys: ['stripe'], name: 'Stripe' },
  { keys: ['@clerk/nextjs', '@clerk/clerk-sdk-node'], name: 'Clerk Auth' },
  { keys: ['next-auth', '@auth/core'], name: 'NextAuth / Auth.js' },
  { keys: ['@trpc/server', '@trpc/client'], name: 'tRPC' },
  { keys: ['convex'], name: 'Convex' },
  { keys: ['zustand'], name: 'Zustand' },
];

const PY_FRAMEWORK_MAP = [
  { keys: ['django'], name: 'Django' },
  { keys: ['flask'], name: 'Flask' },
  { keys: ['fastapi'], name: 'FastAPI' },
  { keys: ['streamlit'], name: 'Streamlit' },
  { keys: ['gradio'], name: 'Gradio' },
];

const PY_TOOLS_MAP = [
  { keys: ['sqlalchemy'], name: 'SQLAlchemy' },
  { keys: ['celery'], name: 'Celery' },
  { keys: ['openai'], name: 'OpenAI SDK' },
  { keys: ['langchain'], name: 'LangChain' },
  { keys: ['supabase'], name: 'Supabase' },
];

// ── Main detection function ─────────────────────────────────────────────

/**
 * Detect the project stack in the given directory (defaults to cwd).
 *
 * Returns an object like:
 * {
 *   language: 'JavaScript' | 'Python' | 'Unknown',
 *   frameworks: ['Next.js'],
 *   tools: ['TypeScript', 'Tailwind CSS', 'Supabase'],
 *   packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun' | null,
 *   hasGit: true,
 *   hasEnv: false,
 *   hasDocker: false,
 *   raw: { ... }          // raw parsed manifests for downstream use
 * }
 */
export function detectStack(dir = process.cwd()) {
  const result = {
    language: 'Unknown',
    frameworks: [],
    tools: [],
    packageManager: null,
    hasGit: false,
    hasEnv: false,
    hasEnvExample: false,
    hasDocker: false,
    hasGitignore: false,
    hasClaude: false,
    hasContributing: false,
    raw: {},
  };

  // ── Existing config files ───────────────────────────────────────────
  result.hasGit = existsSync(join(dir, '.git'));
  result.hasEnv = existsSync(join(dir, '.env'));
  result.hasEnvExample =
    existsSync(join(dir, '.env.example')) ||
    existsSync(join(dir, '.env.local.example'));
  result.hasDocker =
    existsSync(join(dir, 'Dockerfile')) ||
    existsSync(join(dir, 'docker-compose.yml')) ||
    existsSync(join(dir, 'docker-compose.yaml'));
  result.hasGitignore = existsSync(join(dir, '.gitignore'));
  result.hasClaude =
    existsSync(join(dir, 'CLAUDE.md')) ||
    existsSync(join(dir, 'claude.md'));
  result.hasContributing =
    existsSync(join(dir, 'CONTRIBUTING.md')) ||
    existsSync(join(dir, 'contributing.md'));

  // ── JavaScript / TypeScript detection ───────────────────────────────
  const pkgPath = join(dir, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = readJSON(pkgPath);
    result.raw.packageJson = pkg;

    if (pkg) {
      result.language = 'JavaScript';

      // Merge deps + devDeps for scanning
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };

      // Detect frameworks (first match wins for primary)
      for (const rule of JS_FRAMEWORK_MAP) {
        if (hasAny(allDeps, rule.keys)) {
          result.frameworks.push(rule.name);
        }
      }

      // Detect tools
      for (const rule of JS_TOOLS_MAP) {
        if (hasAny(allDeps, rule.keys)) {
          result.tools.push(rule.name);
        }
      }

      // TypeScript via tsconfig
      if (
        existsSync(join(dir, 'tsconfig.json')) &&
        !result.tools.includes('TypeScript')
      ) {
        result.tools.push('TypeScript');
      }

      // shadcn/ui detection via components.json
      if (existsSync(join(dir, 'components.json'))) {
        result.tools.push('shadcn/ui');
      }
    }

    // Package manager detection
    if (existsSync(join(dir, 'bun.lockb')) || existsSync(join(dir, 'bun.lock'))) {
      result.packageManager = 'bun';
    } else if (existsSync(join(dir, 'pnpm-lock.yaml'))) {
      result.packageManager = 'pnpm';
    } else if (existsSync(join(dir, 'yarn.lock'))) {
      result.packageManager = 'yarn';
    } else if (existsSync(join(dir, 'package-lock.json'))) {
      result.packageManager = 'npm';
    }
  }

  // ── Python detection ────────────────────────────────────────────────
  const reqPath = join(dir, 'requirements.txt');
  const pyprojectPath = join(dir, 'pyproject.toml');
  const pipfilePath = join(dir, 'Pipfile');

  const hasPython =
    existsSync(reqPath) || existsSync(pyprojectPath) || existsSync(pipfilePath);

  if (hasPython) {
    // If we already detected JS, mark as "Full-Stack"; otherwise Python
    if (result.language === 'JavaScript') {
      result.language = 'Full-Stack (JS + Python)';
    } else {
      result.language = 'Python';
    }

    // Parse requirements.txt for packages
    let pyPkgs = [];
    if (existsSync(reqPath)) {
      pyPkgs = readLines(reqPath)
        .filter((l) => !l.startsWith('#') && !l.startsWith('-'))
        .map((l) => l.split(/[=<>!~]/)[0].trim().toLowerCase());
    }

    // Improved pyproject.toml dependency extraction (#9)
    // Only scan lines that look like dependency declarations,
    // skipping section headers, comments, and metadata fields.
    if (existsSync(pyprojectPath)) {
      try {
        const tomlRaw = readFileSync(pyprojectPath, 'utf-8');
        const depLines = tomlRaw.split(/\r?\n/).filter((line) => {
          const trimmed = line.trim();
          // Skip empty lines, section headers, and comments
          if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('[')) {
            return false;
          }
          return true;
        });

        // Known package names we care about
        const knownPyNames = [
          ...PY_FRAMEWORK_MAP.flatMap((r) => r.keys),
          ...PY_TOOLS_MAP.flatMap((r) => r.keys),
        ];

        for (const line of depLines) {
          for (const name of knownPyNames) {
            // Match patterns like: "flask>=2.0", flask = "^2.0", "flask",
            // flask = {version = "..."}
            const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(
              `(?:^|["'])${escaped}(?:["'\\s=<>!~,;\\[]|$)`,
              'i'
            );
            if (pattern.test(line)) {
              pyPkgs.push(name);
            }
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    const pyDepsObj = Object.fromEntries(pyPkgs.map((p) => [p, true]));

    for (const rule of PY_FRAMEWORK_MAP) {
      if (hasAny(pyDepsObj, rule.keys)) {
        result.frameworks.push(rule.name);
      }
    }
    for (const rule of PY_TOOLS_MAP) {
      if (hasAny(pyDepsObj, rule.keys)) {
        result.tools.push(rule.name);
      }
    }
  }

  // Deduplicate
  result.frameworks = [...new Set(result.frameworks)];
  result.tools = [...new Set(result.tools)];

  return result;
}

/**
 * Build a short human-readable summary string from detection results.
 */
export function summarizeStack(detection) {
  const parts = [];
  if (detection.language !== 'Unknown') {
    parts.push(detection.language);
  }
  if (detection.frameworks.length) {
    parts.push(detection.frameworks.join(', '));
  }
  if (detection.tools.length) {
    parts.push(detection.tools.join(', '));
  }
  return parts.length
    ? parts.join(' + ')
    : 'Could not auto-detect your stack';
}
