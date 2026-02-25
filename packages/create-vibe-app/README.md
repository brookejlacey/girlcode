# create-vibe-app

> Set up your vibecoded app for production — powered by [Girl Code](https://girlcode.technology)

You built something with AI. Now let's ship it.

**create-vibe-app** is a zero-dependency CLI that helps non-technical "vibecoders" prepare their AI-built projects for real-world deployment. It scans your project, asks a few friendly questions, and generates the config files you need to go live.

## Quick Start

```bash
npx create-vibe-app
```

Or run it locally from the repo:

```bash
node packages/create-vibe-app/bin/cli.js
```

## What It Does

1. **Scans your project** — auto-detects your framework, language, and tools (Next.js, Supabase, Tailwind, etc.)
2. **Asks a few questions** — project name, database, deploy target, auth
3. **Generates files:**
   - `CLAUDE.md` — instructions for AI coding assistants
   - `.env.example` — environment variable template for your stack
   - `CONTRIBUTING.md` — beginner-friendly contributor guide
   - `.gitignore` — keeps secrets and junk out of your repo
4. **Shows next steps** — numbered checklist with links to set up GitHub, Supabase, Vercel, etc.

## Requirements

- Node.js 18 or later
- No other dependencies (everything is built with Node.js built-ins)

## Supported Stacks

**JavaScript / TypeScript:**
Next.js, Nuxt, Remix, SvelteKit, Astro, Gatsby, Vite, Vue, React, Angular, Express, Fastify, Hono

**Python:**
Django, Flask, FastAPI, Streamlit, Gradio

**Databases:**
Supabase, PlanetScale, Neon, MongoDB Atlas, Firebase

**Auth:**
Supabase Auth, Clerk, NextAuth / Auth.js, Firebase Auth

**Deploy Targets:**
Vercel, Netlify, Railway, Fly.io, AWS

## Zero Dependencies

This CLI uses only Node.js built-in modules:
- `readline` for interactive prompts
- `fs` for file operations
- `path` for cross-platform paths

No chalk, no inquirer, no commander. Just Node.

## Development

```bash
# From the repo root
cd packages/create-vibe-app
node bin/cli.js
```

## License

MIT

---

*Powered by Girl Code | [girlcode.technology](https://girlcode.technology)*
