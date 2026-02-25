#!/usr/bin/env python3
"""
vibe-to-prod.py -- Get your AI-built project ready for production!

Powered by Girl Code | girlcode.technology
Fractional CTO & Tech Consulting by Brooke Lacey and Nicki Sanders

This script helps non-technical founders take their vibecoded projects
from prototype to production-ready. Just double-click and follow along!

Requirements: Python 3.7+ (no extra installs needed)
Works on: Windows, Mac, and Linux
"""

import json
import os
import sys
import time
import textwrap
import platform
import webbrowser
from pathlib import Path
from datetime import datetime


# ---------------------------------------------------------------------------
# Terminal colors (works on modern Windows 10+, Mac, and Linux)
# ---------------------------------------------------------------------------

def _enable_windows_ansi():
    """Enable ANSI escape codes on Windows 10+ terminals."""
    if platform.system() != "Windows":
        return
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        # STD_OUTPUT_HANDLE = -11
        handle = kernel32.GetStdHandle(-11)
        # ENABLE_VIRTUAL_TERMINAL_PROCESSING = 0x0004
        mode = ctypes.c_ulong()
        kernel32.GetConsoleMode(handle, ctypes.byref(mode))
        kernel32.SetConsoleMode(handle, mode.value | 0x0004)
    except Exception:
        pass  # Worst case: colors won't render, but text still works


_enable_windows_ansi()


class Colors:
    """ANSI color codes for pretty terminal output."""
    PINK = "\033[38;5;205m"
    MAGENTA = "\033[38;5;170m"
    PURPLE = "\033[38;5;141m"
    BLUE = "\033[38;5;75m"
    CYAN = "\033[38;5;87m"
    GREEN = "\033[38;5;114m"
    YELLOW = "\033[38;5;221m"
    ORANGE = "\033[38;5;209m"
    RED = "\033[38;5;203m"
    WHITE = "\033[97m"
    GRAY = "\033[38;5;245m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    UNDERLINE = "\033[4m"
    RESET = "\033[0m"


C = Colors


# ---------------------------------------------------------------------------
# Pretty-print helpers
# ---------------------------------------------------------------------------

def banner():
    """Print the Girl Code banner."""
    IW = 46
    border = "═" * IW
    empty = " " * IW
    art_lines = [
        "████ █ ████ █      ████ ████ ███  ████",
        "█    █ █  █ █      █    █  █ █  █ █   ",
        "█ ██ █ ████ █      █    █  █ █  █ ████",
        "█  █ █ █ █  █      █    █  █ █  █ █   ",
        "████ █ █  █ ████   ████ ████ ███  ████",
    ]
    ver = "vibe-to-prod v1.0.0"

    print()
    print(f"{C.PINK}{C.BOLD}  ╔{border}╗{C.RESET}")
    print(f"{C.PINK}{C.BOLD}  ║{empty}║{C.RESET}")
    for line in art_lines:
        pad = " " * (IW - 3 - len(line))
        print(f"{C.PINK}{C.BOLD}  ║{C.RESET}   {C.WHITE}{C.BOLD}{line}{C.RESET}{pad}{C.PINK}{C.BOLD}║{C.RESET}")
    print(f"{C.PINK}{C.BOLD}  ║{empty}║{C.RESET}")
    vpad = " " * (IW - 3 - len(ver))
    print(f"{C.PINK}{C.BOLD}  ║{C.RESET}   {C.CYAN}{ver}{C.RESET}{vpad}{C.PINK}{C.BOLD}║{C.RESET}")
    print(f"{C.PINK}{C.BOLD}  ║{empty}║{C.RESET}")
    print(f"{C.PINK}{C.BOLD}  ╚{border}╝{C.RESET}")
    print()
    print(f"  {C.GRAY}Get your vibecoded app production-ready.{C.RESET}")
    print(f"  {C.GRAY}Powered by Girl Code | girlcode.technology{C.RESET}")
    print()


def heading(text):
    """Print a big section heading."""
    width = min(70, max(len(text) + 6, 50))
    border = "=" * width
    print(f"\n{C.PINK}{C.BOLD}{border}{C.RESET}")
    print(f"{C.PINK}{C.BOLD}   {text}{C.RESET}")
    print(f"{C.PINK}{C.BOLD}{border}{C.RESET}\n")


def subheading(text):
    """Print a smaller heading."""
    print(f"\n{C.PURPLE}{C.BOLD}  >> {text}{C.RESET}\n")


def info(text):
    """Print an informational message."""
    print(f"  {C.CYAN}i{C.RESET}  {text}")


def success(text):
    """Print a success message."""
    print(f"  {C.GREEN}+{C.RESET}  {C.GREEN}{text}{C.RESET}")


def warn(text):
    """Print a warning."""
    print(f"  {C.YELLOW}!{C.RESET}  {C.YELLOW}{text}{C.RESET}")


def error(text):
    """Print an error message."""
    print(f"  {C.RED}x{C.RESET}  {C.RED}{text}{C.RESET}")


def bullet(text, indent=2):
    """Print a bulleted item."""
    pad = " " * indent
    print(f"{pad}{C.MAGENTA}-{C.RESET} {text}")


def link(label, url):
    """Print a clickable-looking link."""
    print(f"    {C.BLUE}{C.UNDERLINE}{url}{C.RESET}  ({label})")


def dim(text):
    """Print dimmed/muted text."""
    print(f"  {C.GRAY}{text}{C.RESET}")


def ask_yes_no(question, default_yes=True):
    """Ask a yes/no question. Returns True for yes."""
    hint = "Y/n" if default_yes else "y/N"
    try:
        answer = input(f"\n  {C.YELLOW}?{C.RESET}  {question} [{hint}]: ").strip().lower()
    except (EOFError, KeyboardInterrupt):
        print()
        return default_yes
    if not answer:
        return default_yes
    return answer in ("y", "yes")


def ask_text(question, default=""):
    """Ask for text input."""
    hint = f" [{default}]" if default else ""
    try:
        answer = input(f"\n  {C.YELLOW}?{C.RESET}  {question}{hint}: ").strip()
    except (EOFError, KeyboardInterrupt):
        print()
        return default
    return answer if answer else default


def pause(message="Press Enter to continue..."):
    """Pause and wait for the user."""
    try:
        input(f"\n  {C.GRAY}{message}{C.RESET}")
    except (EOFError, KeyboardInterrupt):
        print()


def typewrite(text, delay=0.01):
    """Print text character by character for effect."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()


def write_file(filepath, content, label=None):
    """Write content to a file safely. Returns True on success."""
    try:
        filepath = Path(filepath)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        filepath.write_text(content, encoding="utf-8")
        display = label or filepath.name
        success(f"Created {C.BOLD}{display}{C.RESET}{C.GREEN}!")
        return True
    except Exception as e:
        error(f"Could not write {filepath.name}: {e}")
        return False


# ---------------------------------------------------------------------------
# Stack detection
# ---------------------------------------------------------------------------

class ProjectStack:
    """Holds everything we learn about the user's project."""

    def __init__(self, project_dir):
        self.dir = Path(project_dir)
        self.name = self.dir.name or "my-project"
        self.languages = []       # e.g. ["javascript", "typescript"]
        self.frameworks = []      # e.g. ["Next.js", "React"]
        self.runtime = None       # e.g. "Node.js", "Python", "Rust", "Go"
        self.package_manager = None  # "npm", "yarn", "pnpm", "bun", "pip", "poetry", "cargo", "go"
        self.has_typescript = False
        self.has_tailwind = False
        self.has_supabase = False
        self.has_prisma = False
        self.has_drizzle = False
        self.has_docker = False
        self.database = None      # "supabase", "postgres", "sqlite", "mongodb", etc.
        self.dev_command = None
        self.build_command = None
        self.start_command = None
        self.env_vars = {}        # name -> description
        self.extra_gitignore = []
        self.detected_files = []  # Config files we found
        self.port = "3000"

    def detect(self):
        """Run all detection routines."""
        self._detect_node()
        self._detect_python()
        self._detect_rust()
        self._detect_go()
        self._detect_docker()
        self._detect_common()

        if not self.runtime:
            # Last-ditch: check for common source files
            for ext, lang, rt in [
                (".js", "JavaScript", "Node.js"),
                (".ts", "TypeScript", "Node.js"),
                (".py", "Python", "Python"),
                (".rs", "Rust", "Rust"),
                (".go", "Go", "Go"),
            ]:
                if list(self.dir.glob(f"*{ext}")) or list(self.dir.glob(f"**/*{ext}")):
                    self.languages.append(lang)
                    if not self.runtime:
                        self.runtime = rt
                    break

    def _read_json(self, filename):
        """Safely read and parse a JSON file."""
        filepath = self.dir / filename
        if not filepath.is_file():
            return None
        try:
            return json.loads(filepath.read_text(encoding="utf-8"))
        except Exception:
            return None

    def _file_exists(self, filename):
        """Check if a file exists in the project root."""
        return (self.dir / filename).is_file()

    def _detect_node(self):
        """Detect Node.js / JavaScript / TypeScript projects."""
        pkg = self._read_json("package.json")
        if not pkg:
            return

        self.detected_files.append("package.json")
        self.runtime = "Node.js"
        self.languages.append("JavaScript")

        # Package manager detection
        if self._file_exists("bun.lockb") or self._file_exists("bun.lock"):
            self.package_manager = "bun"
        elif self._file_exists("pnpm-lock.yaml"):
            self.package_manager = "pnpm"
        elif self._file_exists("yarn.lock"):
            self.package_manager = "yarn"
        else:
            self.package_manager = "npm"

        run_prefix = f"{self.package_manager} run " if self.package_manager in ("npm", "yarn", "pnpm") else f"{self.package_manager} "

        # Scripts
        scripts = pkg.get("scripts", {})
        if "dev" in scripts:
            self.dev_command = f"{run_prefix}dev"
        if "build" in scripts:
            self.build_command = f"{run_prefix}build"
        if "start" in scripts:
            self.start_command = f"{run_prefix}start"

        # Merge deps
        all_deps = {}
        all_deps.update(pkg.get("dependencies", {}))
        all_deps.update(pkg.get("devDependencies", {}))

        # TypeScript
        if "typescript" in all_deps or self._file_exists("tsconfig.json"):
            self.has_typescript = True
            if "TypeScript" not in self.languages:
                self.languages.append("TypeScript")
            self.detected_files.append("tsconfig.json")

        # Frameworks
        if "next" in all_deps:
            self.frameworks.append("Next.js")
            self.port = "3000"
        if "react" in all_deps and "Next.js" not in self.frameworks:
            self.frameworks.append("React")
        if "vue" in all_deps:
            self.frameworks.append("Vue")
        if "nuxt" in all_deps:
            self.frameworks.append("Nuxt")
            self.port = "3000"
        if "svelte" in all_deps or "@sveltejs/kit" in all_deps:
            self.frameworks.append("SvelteKit" if "@sveltejs/kit" in all_deps else "Svelte")
        if "express" in all_deps:
            self.frameworks.append("Express")
        if "fastify" in all_deps:
            self.frameworks.append("Fastify")
        if "hono" in all_deps:
            self.frameworks.append("Hono")
        if "remix" in all_deps or "@remix-run/node" in all_deps:
            self.frameworks.append("Remix")
        if "astro" in all_deps:
            self.frameworks.append("Astro")
        if "gatsby" in all_deps:
            self.frameworks.append("Gatsby")

        # CSS / UI
        if "tailwindcss" in all_deps:
            self.has_tailwind = True

        # Database / ORM
        if "@supabase/supabase-js" in all_deps or "@supabase/ssr" in all_deps:
            self.has_supabase = True
            self.database = "supabase"
            self.env_vars["NEXT_PUBLIC_SUPABASE_URL"] = "Your Supabase project URL (find in Supabase dashboard > Settings > API)"
            self.env_vars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "Your Supabase anon/public key (find in Supabase dashboard > Settings > API)"

        if "prisma" in all_deps or "@prisma/client" in all_deps:
            self.has_prisma = True
            self.env_vars["DATABASE_URL"] = "Your database connection string"

        if "drizzle-orm" in all_deps:
            self.has_drizzle = True
            self.env_vars["DATABASE_URL"] = "Your database connection string"

        if "mongoose" in all_deps or "mongodb" in all_deps:
            self.database = self.database or "mongodb"
            self.env_vars["MONGODB_URI"] = "Your MongoDB connection string"

        # Auth
        if "next-auth" in all_deps or "@auth/core" in all_deps:
            self.env_vars["NEXTAUTH_SECRET"] = "A random secret string (run: openssl rand -base64 32)"
            self.env_vars["NEXTAUTH_URL"] = "Your app URL (http://localhost:3000 for local dev)"

        if "@clerk/nextjs" in all_deps:
            self.env_vars["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] = "Your Clerk publishable key"
            self.env_vars["CLERK_SECRET_KEY"] = "Your Clerk secret key"

        # Payments
        if "stripe" in all_deps or "@stripe/stripe-js" in all_deps:
            self.env_vars["STRIPE_SECRET_KEY"] = "Your Stripe secret key (starts with sk_)"
            self.env_vars["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"] = "Your Stripe publishable key (starts with pk_)"
            self.env_vars["STRIPE_WEBHOOK_SECRET"] = "Your Stripe webhook signing secret (starts with whsec_)"

        # AI / LLM
        if "openai" in all_deps:
            self.env_vars["OPENAI_API_KEY"] = "Your OpenAI API key"
        if "@anthropic-ai/sdk" in all_deps:
            self.env_vars["ANTHROPIC_API_KEY"] = "Your Anthropic API key"

        # Email
        if "resend" in all_deps:
            self.env_vars["RESEND_API_KEY"] = "Your Resend API key"
        if "nodemailer" in all_deps:
            self.env_vars["SMTP_HOST"] = "Your email SMTP host"
            self.env_vars["SMTP_USER"] = "Your email SMTP username"
            self.env_vars["SMTP_PASS"] = "Your email SMTP password"

        # Analytics
        if "@vercel/analytics" in all_deps:
            pass  # Works automatically on Vercel

        # Common Node env vars
        self.env_vars.setdefault("NODE_ENV", "development (set to 'production' in production)")

    def _detect_python(self):
        """Detect Python projects."""
        has_requirements = self._file_exists("requirements.txt")
        has_pyproject = self._file_exists("pyproject.toml")
        has_setup = self._file_exists("setup.py")
        has_pipfile = self._file_exists("Pipfile")

        if not any([has_requirements, has_pyproject, has_setup, has_pipfile]):
            return

        self.runtime = self.runtime or "Python"
        if "Python" not in self.languages:
            self.languages.append("Python")

        if has_requirements:
            self.detected_files.append("requirements.txt")
        if has_pyproject:
            self.detected_files.append("pyproject.toml")

        # Package manager
        if has_pipfile:
            self.package_manager = self.package_manager or "pipenv"
        elif has_pyproject:
            self.package_manager = self.package_manager or "poetry"
        else:
            self.package_manager = self.package_manager or "pip"

        # Read requirements to detect frameworks
        deps_text = ""
        if has_requirements:
            try:
                deps_text = (self.dir / "requirements.txt").read_text(encoding="utf-8").lower()
            except Exception:
                pass

        if "django" in deps_text:
            self.frameworks.append("Django")
            self.port = "8000"
            self.dev_command = "python manage.py runserver"
            self.env_vars["SECRET_KEY"] = "Django secret key"
            self.env_vars["DEBUG"] = "True (set to False in production)"
            self.env_vars["ALLOWED_HOSTS"] = "localhost,127.0.0.1 (add your domain in production)"
        if "flask" in deps_text:
            self.frameworks.append("Flask")
            self.port = "5000"
            self.dev_command = "flask run"
            self.env_vars["FLASK_APP"] = "app.py (or your main file)"
            self.env_vars["FLASK_ENV"] = "development"
        if "fastapi" in deps_text:
            self.frameworks.append("FastAPI")
            self.port = "8000"
            self.dev_command = "uvicorn main:app --reload"
        if "streamlit" in deps_text:
            self.frameworks.append("Streamlit")
            self.port = "8501"
            self.dev_command = "streamlit run app.py"

        if "supabase" in deps_text:
            self.has_supabase = True
            self.database = "supabase"
            self.env_vars["SUPABASE_URL"] = "Your Supabase project URL"
            self.env_vars["SUPABASE_KEY"] = "Your Supabase anon key"

        if "sqlalchemy" in deps_text or "psycopg2" in deps_text:
            self.env_vars.setdefault("DATABASE_URL", "Your database connection string")

        if "openai" in deps_text:
            self.env_vars["OPENAI_API_KEY"] = "Your OpenAI API key"
        if "anthropic" in deps_text:
            self.env_vars["ANTHROPIC_API_KEY"] = "Your Anthropic API key"
        if "stripe" in deps_text:
            self.env_vars["STRIPE_SECRET_KEY"] = "Your Stripe secret key"

        # Gitignore additions for Python
        self.extra_gitignore.extend([
            "__pycache__/", "*.py[cod]", "*$py.class", "*.so",
            "venv/", ".venv/", "env/", ".env",
            "dist/", "build/", "*.egg-info/",
        ])

    def _detect_rust(self):
        """Detect Rust projects."""
        if not self._file_exists("Cargo.toml"):
            return
        self.detected_files.append("Cargo.toml")
        self.runtime = self.runtime or "Rust"
        if "Rust" not in self.languages:
            self.languages.append("Rust")
        self.package_manager = self.package_manager or "cargo"
        self.dev_command = self.dev_command or "cargo run"
        self.build_command = "cargo build --release"

        self.extra_gitignore.extend(["target/", "Cargo.lock"])

    def _detect_go(self):
        """Detect Go projects."""
        if not self._file_exists("go.mod"):
            return
        self.detected_files.append("go.mod")
        self.runtime = self.runtime or "Go"
        if "Go" not in self.languages:
            self.languages.append("Go")
        self.package_manager = self.package_manager or "go"
        self.dev_command = self.dev_command or "go run ."
        self.build_command = "go build -o app ."

        self.extra_gitignore.extend(["bin/", "*.exe"])

    def _detect_docker(self):
        """Check for Docker."""
        if self._file_exists("Dockerfile") or self._file_exists("docker-compose.yml") or self._file_exists("docker-compose.yaml"):
            self.has_docker = True
            self.detected_files.append("Dockerfile / docker-compose.yml")

    def _detect_common(self):
        """Detect common files and set defaults."""
        # Default env vars that almost every project needs
        # (only if we detected something)
        if self.runtime:
            self.env_vars.setdefault("NODE_ENV", "development") if self.runtime == "Node.js" else None

        # Supabase directory
        if (self.dir / "supabase").is_dir():
            self.has_supabase = True
            self.database = self.database or "supabase"

    def summary_string(self):
        """Return a human-readable summary."""
        parts = []
        if self.runtime:
            parts.append(f"Runtime: {self.runtime}")
        if self.languages:
            parts.append(f"Languages: {', '.join(self.languages)}")
        if self.frameworks:
            parts.append(f"Frameworks: {', '.join(self.frameworks)}")
        if self.package_manager:
            parts.append(f"Package manager: {self.package_manager}")
        if self.database:
            parts.append(f"Database: {self.database.title()}")
        if self.has_tailwind:
            parts.append("Styling: Tailwind CSS")
        if self.has_docker:
            parts.append("Docker: detected")
        return parts

    def stack_label(self):
        """Short label for the stack (e.g. 'Next.js + Supabase + Tailwind')."""
        parts = []
        if self.frameworks:
            parts.append(self.frameworks[0])
        elif self.runtime:
            parts.append(self.runtime)
        if self.has_supabase:
            parts.append("Supabase")
        elif self.database:
            parts.append(self.database.title())
        if self.has_tailwind:
            parts.append("Tailwind CSS")
        if self.has_typescript:
            parts.append("TypeScript")
        return " + ".join(parts) if parts else "Unknown Stack"


# ---------------------------------------------------------------------------
# File generators
# ---------------------------------------------------------------------------

def generate_claude_md(stack, project_name):
    """Generate CLAUDE.md content tailored to the project stack."""

    # Determine install command
    install_cmd = {
        "npm": "npm install",
        "yarn": "yarn",
        "pnpm": "pnpm install",
        "bun": "bun install",
        "pip": "pip install -r requirements.txt",
        "poetry": "poetry install",
        "pipenv": "pipenv install",
        "cargo": "cargo build",
        "go": "go mod download",
    }.get(stack.package_manager, "# install dependencies for your project")

    dev_cmd = stack.dev_command or "# start your dev server"
    build_cmd = stack.build_command or "# build for production"
    lint_cmd = (
        stack.package_manager + " run lint"
        if stack.package_manager in ("npm", "yarn", "pnpm", "bun")
        else "# run your linter"
    )

    # Build the document as a list of sections, then join at the end.
    # Each section is a plain string with NO leading indentation.
    sections = []

    # -- Header --
    sections.append(f"""\
# {project_name}

> Generated by Girl Code's Vibe to Prod tool | girlcode.technology

## Project Overview

- **Stack:** {stack.stack_label()}
- **Runtime:** {stack.runtime or "Not detected"}
- **Languages:** {", ".join(stack.languages) if stack.languages else "Not detected"}
- **Frameworks:** {", ".join(stack.frameworks) if stack.frameworks else "None detected"}""")

    # -- Getting Started --
    sections.append(f"""\
## Getting Started

### 1. Install dependencies

```bash
{install_cmd}
```

### 2. Set up environment variables

```bash
# Copy the example env file
cp .env.example .env

# Then open .env and fill in your real values
```

### 3. Run the development server

```bash
{dev_cmd}
```

Then open http://localhost:{stack.port} in your browser.""")

    # -- Framework-specific notes --
    if "Next.js" in stack.frameworks:
        sections.append("""\
## Next.js Notes

- Pages/routes live in `src/app/` (App Router) or `pages/` (Pages Router)
- API routes go in `src/app/api/` or `pages/api/`
- Static assets go in `public/`
- Shared components go in `src/components/`
- Use server components by default; add `"use client"` only when you need
  browser features (onClick, useState, useEffect, etc.)""")
    elif "Django" in stack.frameworks:
        sections.append("""\
## Django Notes

- Run migrations: `python manage.py migrate`
- Create superuser: `python manage.py createsuperuser`
- Static files: `python manage.py collectstatic`""")
    elif "Flask" in stack.frameworks:
        sections.append("""\
## Flask Notes

- Main app file is typically `app.py` or `main.py`
- Templates go in `templates/`
- Static files go in `static/`""")
    elif "FastAPI" in stack.frameworks:
        sections.append("""\
## FastAPI Notes

- API docs automatically available at `/docs` (Swagger) and `/redoc`
- Main app typically in `main.py`""")

    # -- Database section --
    if stack.has_supabase:
        sections.append("""\
## Database (Supabase)

This project uses **Supabase** for the database (PostgreSQL).

- Dashboard: https://supabase.com/dashboard
- The SQL schema lives in `supabase/schema.sql` (if present)
- Run schema changes through the Supabase SQL Editor in the dashboard
- Connection details are stored in environment variables (see `.env.example`)
- Supabase provides authentication, storage, and real-time features too

**Important:** Never commit your Supabase keys to git! They should only
be in your `.env` file (which is git-ignored) or in your hosting
platform's environment variable settings.""")
    elif stack.database:
        sections.append(f"""\
## Database

This project uses **{stack.database}** for the database.
Connection details are stored in environment variables (see `.env.example`).

**Important:** Never commit database credentials to git!""")

    # -- Deployment section --
    if "Next.js" in stack.frameworks or "React" in stack.frameworks:
        sections.append("""\
## Deployment (Vercel)

This project is designed to deploy on **Vercel**.

1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Vercel will auto-detect Next.js and configure the build
4. Add your environment variables in Vercel's project settings
5. Every push to `main` will auto-deploy!

**Preview deployments:** Every pull request gets its own preview URL
so you can test changes before they go live.""")
    elif "Django" in stack.frameworks or "Flask" in stack.frameworks or "FastAPI" in stack.frameworks:
        sections.append("""\
## Deployment

Common deployment options for Python projects:
- **Railway** (https://railway.app) -- easiest for beginners
- **Render** (https://render.com) -- good free tier
- **Fly.io** (https://fly.io) -- great for global apps

Make sure to set all environment variables on your hosting platform!""")

    # -- Environment variables section --
    if stack.env_vars:
        env_lines = "\n".join(
            f"- `{name}` -- {desc}" for name, desc in sorted(stack.env_vars.items())
        )
        sections.append(f"""\
## Environment Variables

This project needs these environment variables to work. Copy `.env.example`
to `.env` and fill in your values:

{env_lines}

**Never commit `.env` to git!** The `.env.example` file shows what's needed
without exposing real values.""")

    # -- Git Workflow --
    sections.append("""\
## Git Workflow

**Golden rules for this project:**

1. **Never push directly to `main`** -- main is the live/production branch
2. **Always create a new branch** for your changes
3. **Always create a Pull Request (PR)** so changes can be reviewed
4. **Write clear commit messages** that describe what you changed

### How to make changes:

```bash
# 1. Make sure you're up to date
git checkout main
git pull

# 2. Create a new branch for your work
git checkout -b your-name/what-youre-changing

# 3. Make your changes...

# 4. Stage and commit
git add .
git commit -m "Describe what you changed"

# 5. Push your branch
git push -u origin your-name/what-youre-changing

# 6. Go to GitHub and create a Pull Request!
```""")

    # -- Common Commands --
    sections.append(f"""\
## Common Commands

| What you want to do | Command |
|---|---|
| Install dependencies | `{install_cmd}` |
| Start dev server | `{dev_cmd}` |
| Build for production | `{build_cmd}` |
| Check for errors | `{lint_cmd}` |""")

    # -- Need Help --
    sections.append("""\
## Need Help?

This project is supported by **Girl Code** (girlcode.technology).
If something breaks or you need guidance, reach out to your Girl Code team!""")

    return "\n\n".join(sections) + "\n"


def generate_env_example(stack):
    """Generate .env.example content."""
    if not stack.env_vars:
        return None

    lines = [
        "# ============================================",
        f"# Environment Variables for {stack.name}",
        "# ============================================",
        "#",
        "# Copy this file to .env and fill in your real values:",
        f"#   cp .env.example .env",
        "#",
        "# IMPORTANT: Never commit .env to git! It contains secrets.",
        "#",
        f"# Generated by Girl Code's Vibe to Prod tool",
        "# girlcode.technology",
        "# ============================================",
        "",
    ]

    # Group env vars by category
    categories = {
        "App": [],
        "Database": [],
        "Auth": [],
        "Payments": [],
        "AI / LLM": [],
        "Email": [],
        "Other": [],
    }

    for name, desc in sorted(stack.env_vars.items()):
        cat = "Other"
        name_lower = name.lower()
        if any(k in name_lower for k in ("database", "supabase", "mongo", "redis", "postgres")):
            cat = "Database"
        elif any(k in name_lower for k in ("auth", "clerk", "secret_key", "nextauth")):
            cat = "Auth"
        elif "stripe" in name_lower:
            cat = "Payments"
        elif any(k in name_lower for k in ("openai", "anthropic", "ai")):
            cat = "AI / LLM"
        elif any(k in name_lower for k in ("smtp", "resend", "email", "mail")):
            cat = "Email"
        elif any(k in name_lower for k in ("node_env", "flask", "debug", "allowed", "port")):
            cat = "App"
        categories[cat].append((name, desc))

    for cat_name, vars_list in categories.items():
        if not vars_list:
            continue
        lines.append(f"# --- {cat_name} ---")
        for name, desc in vars_list:
            lines.append(f"# {desc}")
            lines.append(f"{name}=")
            lines.append("")

    return "\n".join(lines)


def generate_gitignore(stack):
    """Generate .gitignore content tailored to the stack."""
    sections = []

    sections.append("# Dependencies")
    if stack.runtime == "Node.js":
        sections.extend([
            "node_modules/",
            ".pnp.*",
            ".yarn/*",
            "!.yarn/patches",
            "!.yarn/plugins",
            "!.yarn/releases",
        ])
    sections.append("")

    sections.append("# Environment variables (NEVER commit these!)")
    sections.extend([".env", ".env.local", ".env.*.local"])
    sections.append("")

    sections.append("# Build output")
    if "Next.js" in stack.frameworks:
        sections.extend(["/.next/", "/out/", "/build/"])
    elif "React" in stack.frameworks:
        sections.extend(["/build/", "/dist/"])
    sections.append("")

    sections.append("# IDE / Editor")
    sections.extend([
        ".vscode/",
        ".idea/",
        "*.swp",
        "*.swo",
        "*~",
    ])
    sections.append("")

    sections.append("# OS files")
    sections.extend([
        ".DS_Store",
        "Thumbs.db",
        "desktop.ini",
    ])
    sections.append("")

    sections.append("# Debug logs")
    sections.extend([
        "npm-debug.log*",
        "yarn-debug.log*",
        "yarn-error.log*",
        ".pnpm-debug.log*",
    ])
    sections.append("")

    if stack.has_typescript:
        sections.append("# TypeScript")
        sections.extend(["*.tsbuildinfo", "next-env.d.ts"])
        sections.append("")

    if "Next.js" in stack.frameworks:
        sections.append("# Vercel")
        sections.append(".vercel")
        sections.append("")

    sections.append("# Testing")
    sections.append("/coverage/")
    sections.append("")

    # Stack-specific extras
    if stack.extra_gitignore:
        sections.append("# Stack-specific")
        sections.extend(stack.extra_gitignore)
        sections.append("")

    sections.append("# Misc")
    sections.append("*.pem")

    return "\n".join(sections) + "\n"


def generate_contributing_md(stack, project_name):
    """Generate a beginner-friendly CONTRIBUTING.md."""

    branch_example = "your-name/add-contact-form"

    # Install command
    install_cmd = {
        "npm": "npm install",
        "yarn": "yarn",
        "pnpm": "pnpm install",
        "bun": "bun install",
        "pip": "pip install -r requirements.txt",
        "poetry": "poetry install",
        "pipenv": "pipenv install",
        "cargo": "cargo build",
        "go": "go mod download",
    }.get(stack.package_manager, "# install your dependencies")

    dev_cmd = stack.dev_command or "# start your dev server"

    content = textwrap.dedent(f"""\
    # Contributing to {project_name}

    > A beginner-friendly guide to making changes to this project.
    > Powered by Girl Code | girlcode.technology

    Welcome! This guide will walk you through how to make changes to this
    project, even if you've never used Git or GitHub before. Don't worry --
    it's easier than it sounds!

    ---

    ## Before You Start

    Make sure you have:

    1. **Git** installed on your computer
       - Download: https://git-scm.com/downloads
       - Not sure? Open a terminal and type `git --version`

    2. **A code editor** (we recommend VS Code)
       - Download: https://code.visualstudio.com

    3. **A GitHub account**
       - Sign up: https://github.com/join

    {"4. **Node.js** installed (version 18 or higher)" if stack.runtime == "Node.js" else ""}
    {"   - Download: https://nodejs.org" if stack.runtime == "Node.js" else ""}
    {"4. **Python** installed (version 3.8 or higher)" if stack.runtime == "Python" else ""}
    {"   - Download: https://www.python.org/downloads/" if stack.runtime == "Python" else ""}

    ---

    ## Making Changes with AI (Claude, ChatGPT, Cursor, etc.)

    If you're using AI tools to help write code, that's great! Here's how
    to do it safely:

    1. **Always work on a branch** (never edit `main` directly)
    2. **Test your changes locally** before pushing
    3. **Review what the AI generated** -- make sure it looks reasonable
    4. **Create a Pull Request** so someone can review before it goes live
    5. **Ask your Girl Code team** if you're unsure about anything

    ---

    ## Step-by-Step: How to Make a Change

    ### Step 1: Get the Latest Code

    Open your terminal (or Git Bash on Windows) and run:

    ```bash
    cd {project_name}
    git checkout main
    git pull origin main
    ```

    ### Step 2: Create a Branch

    A branch is like a safe copy of the project where you can experiment.
    Name it something descriptive:

    ```bash
    git checkout -b {branch_example}
    ```

    Good branch names:
    - `brooke/fix-header-color`
    - `nicki/add-pricing-page`
    - `feature/email-notifications`

    ### Step 3: Install Dependencies (if needed)

    ```bash
    {install_cmd}
    ```

    ### Step 4: Start the Dev Server

    ```bash
    {dev_cmd}
    ```

    Open http://localhost:{stack.port} in your browser to see the project.

    ### Step 5: Make Your Changes

    Edit the files you need to change. If you're using AI:
    - Paste the relevant code into your AI tool
    - Describe what you want to change
    - Copy the AI's code back into your files
    - **Check that it works locally!**

    ### Step 6: Save Your Changes to Git

    ```bash
    # See what files you changed
    git status

    # Add all your changes
    git add .

    # Save with a message describing what you did
    git commit -m "Add contact form to homepage"
    ```

    Write clear commit messages! Good examples:
    - "Fix broken link on about page"
    - "Add email signup form"
    - "Update pricing to new rates"
    - "Fix mobile layout on homepage"

    ### Step 7: Push Your Branch

    ```bash
    git push -u origin {branch_example}
    ```

    ### Step 8: Create a Pull Request (PR)

    1. Go to your repository on GitHub
    2. You'll see a banner saying your branch was recently pushed
    3. Click **"Compare & pull request"**
    4. Write a short description of what you changed and why
    5. Click **"Create pull request"**
    6. Let your team know so they can review it!

    ### Step 9: After Your PR is Merged

    ```bash
    git checkout main
    git pull origin main
    ```

    And you're back to an up-to-date main branch, ready for the next change!

    ---

    ## What To Do If Something Breaks

    **Don't panic!** Here are your options:

    ### The dev server won't start
    - Make sure you installed dependencies: `{install_cmd}`
    - Check that your `.env` file exists and has the right values
    - Try deleting `node_modules` (or your dependencies folder) and reinstalling

    ### Your changes broke something
    - If you haven't committed yet: `git checkout .` (undoes all changes)
    - If you committed but haven't pushed: `git reset HEAD~1` (undoes last commit)
    - If you pushed: don't worry! Your changes are on a branch, not on the live
      site. Just ask for help.

    ### Git is showing confusing errors
    - Take a screenshot of the error
    - Reach out to your Girl Code team
    - We're here to help!

    ### The live site is broken
    - Check Vercel (or your hosting dashboard) for deployment status
    - Recent deployments can be rolled back with one click
    - Contact your Girl Code team immediately

    ---

    ## Quick Reference

    | What you want to do | Command |
    |---|---|
    | See what branch you're on | `git branch` |
    | Switch to main | `git checkout main` |
    | Create a new branch | `git checkout -b branch-name` |
    | See what files changed | `git status` |
    | Save your changes | `git add . && git commit -m "message"` |
    | Push to GitHub | `git push` |
    | Get latest changes | `git pull` |
    | Undo uncommitted changes | `git checkout .` |
    | Install dependencies | `{install_cmd}` |
    | Start dev server | `{dev_cmd}` |

    ---

    ## Need Help?

    This project is supported by **Girl Code** (girlcode.technology).

    - Having trouble? Reach out to your Girl Code team
    - Found a bug? Create a GitHub Issue
    - Not sure about something? Ask before you push!

    We're here to help you succeed. No question is too basic!
    """)

    return content


# ---------------------------------------------------------------------------
# Account setup walkthrough
# ---------------------------------------------------------------------------

def walkthrough_accounts(stack):
    """Walk the user through setting up the accounts they need."""
    heading("Account Setup")

    print(textwrap.dedent(f"""\
    {C.WHITE}  To get your project deployed and running properly, you'll need a few
      free accounts. Don't worry -- we'll walk through each one!{C.RESET}
    """))

    # -- GitHub --
    subheading("1. GitHub (where your code lives)")
    info("GitHub is like Google Drive for code. It keeps your code safe and")
    info("lets you collaborate with others (or with AI tools like Claude).")
    print()
    bullet("If you don't have a GitHub account yet, create one (it's free):")
    link("Sign up for GitHub", "https://github.com/join")
    print()
    bullet("Then create a new repository for this project:")
    link("Create a new repo", "https://github.com/new")
    print()
    dim("  Tip: Name it something like your project name, keep it Private,")
    dim("  and DON'T check 'Add a README' (you already have one).")

    if ask_yes_no("Open GitHub in your browser?", default_yes=False):
        try:
            webbrowser.open("https://github.com/new")
        except Exception:
            info("Could not open browser. Visit https://github.com/new")

    # -- Supabase --
    if stack.has_supabase or stack.database in (None, "supabase"):
        subheading("2. Supabase (your database)")
        info("Supabase gives you a free PostgreSQL database with a nice dashboard.")
        info("It also handles authentication, file storage, and more!")
        print()
        bullet("Create a free Supabase account:")
        link("Sign up for Supabase", "https://supabase.com/dashboard")
        print()
        bullet("Then create a new project:")
        link("New Supabase project", "https://supabase.com/dashboard/new/_")
        print()
        dim("  Tip: Choose a strong database password and save it somewhere safe.")
        dim("  Pick the region closest to your users.")
        print()
        bullet("After creating your project, find your API keys:")
        dim("  Supabase Dashboard > Your Project > Settings > API")
        dim("  You'll need the 'URL' and the 'anon public' key.")

        if ask_yes_no("Open Supabase in your browser?", default_yes=False):
            try:
                webbrowser.open("https://supabase.com/dashboard")
            except Exception:
                info("Could not open browser. Visit https://supabase.com/dashboard")

    # -- Vercel --
    if "Next.js" in stack.frameworks or "React" in stack.frameworks or not stack.frameworks:
        step_num = "3" if stack.has_supabase else "2"
        subheading(f"{step_num}. Vercel (hosting / deployment)")
        info("Vercel makes deploying your app as easy as pushing to GitHub.")
        info("Every time you push code, it automatically updates your live site!")
        print()
        bullet("Create a free Vercel account (use 'Continue with GitHub'):")
        link("Sign up for Vercel", "https://vercel.com/signup")
        print()
        bullet("After signing up, import your GitHub repository:")
        link("Import project", "https://vercel.com/new")
        print()
        dim("  Tip: Vercel will auto-detect your framework and settings.")
        dim("  Just make sure to add your environment variables before deploying!")
        dim("  Go to your project > Settings > Environment Variables")

        if ask_yes_no("Open Vercel in your browser?", default_yes=False):
            try:
                webbrowser.open("https://vercel.com/signup")
            except Exception:
                info("Could not open browser. Visit https://vercel.com/signup")


# ---------------------------------------------------------------------------
# Main flow
# ---------------------------------------------------------------------------

def detect_project_directory():
    """Figure out which directory to scan.

    Strategy:
    1. If this script is inside a project (not in a `tools/` subfolder of a
       different project), use the current working directory.
    2. Otherwise ask the user.
    """
    cwd = Path.cwd()
    script_dir = Path(__file__).resolve().parent

    # If they double-clicked the script, cwd might be the script's folder
    # or the project root. We try a few heuristics.
    candidates = [cwd, script_dir, script_dir.parent]

    for candidate in candidates:
        marker_files = [
            "package.json", "requirements.txt", "pyproject.toml",
            "Cargo.toml", "go.mod", "setup.py", "Pipfile",
        ]
        if any((candidate / f).is_file() for f in marker_files):
            return candidate

    # Fall back: ask
    warn("Could not auto-detect a project in the current directory.")
    print()
    info("Please drag your project folder into this window, or type the path:")
    path = ask_text("Project folder path", default=str(cwd))
    p = Path(path.strip().strip('"').strip("'"))
    if p.is_dir():
        return p
    error(f"'{p}' is not a valid directory.")
    return cwd


def main():
    """Main entry point."""
    try:
        banner()
        typewrite(
            f"  {C.WHITE}Hey there! Let's get your project ready for the real world.{C.RESET}",
            delay=0.015,
        )
        print()
        info("This tool will scan your project and set up everything you need")
        info("to deploy it properly -- git workflow, environment files, docs, and more.")
        print()
        dim("  (You can press Ctrl+C at any time to exit.)")

        pause("Ready? Press Enter to get started!")

        # -- Step 1: Find the project --
        heading("Step 1: Finding Your Project")

        project_dir = detect_project_directory()
        info(f"Scanning: {C.BOLD}{project_dir}{C.RESET}")
        print()

        # -- Step 2: Detect the stack --
        heading("Step 2: Detecting Your Stack")

        stack = ProjectStack(project_dir)
        stack.detect()

        if not stack.runtime:
            warn("Hmm, I couldn't detect a known project type in this directory.")
            info("I'll generate generic files that should still be helpful.")
            info(f"Looked in: {project_dir}")
            # Set some defaults so generation still works
            stack.runtime = "Unknown"
            stack.languages = ["Unknown"]
        else:
            success(f"Detected a {C.BOLD}{stack.stack_label()}{C.RESET}{C.GREEN} project!")
            print()
            for line in stack.summary_string():
                bullet(line)
            if stack.detected_files:
                print()
                dim(f"  Config files found: {', '.join(stack.detected_files)}")

        # -- Step 3: Ask for project name --
        project_name = ask_text(
            "What's your project called?",
            default=stack.name,
        )

        # -- Step 4: Account setup walkthrough --
        if ask_yes_no("Want me to walk you through setting up accounts (GitHub, Supabase, Vercel)?"):
            walkthrough_accounts(stack)
        else:
            info("Skipping account setup. You can set those up anytime!")

        # -- Step 5: Generate files --
        heading("Step 3: Generating Your Files")

        files_created = []

        # CLAUDE.md
        subheading("CLAUDE.md")
        info("This file tells AI tools (like Claude) about your project.")
        info("It helps them give better, more accurate suggestions.")
        claude_path = project_dir / "CLAUDE.md"
        if claude_path.exists():
            if ask_yes_no(f"CLAUDE.md already exists. Overwrite it?", default_yes=False):
                content = generate_claude_md(stack, project_name)
                if write_file(claude_path, content, "CLAUDE.md"):
                    files_created.append("CLAUDE.md")
            else:
                info("Keeping your existing CLAUDE.md.")
        else:
            content = generate_claude_md(stack, project_name)
            if write_file(claude_path, content, "CLAUDE.md"):
                files_created.append("CLAUDE.md")

        # .env.example
        subheading(".env.example")
        info("This file shows what environment variables your project needs,")
        info("without containing any real secrets.")
        env_content = generate_env_example(stack)
        if env_content:
            env_path = project_dir / ".env.example"
            if env_path.exists():
                if ask_yes_no(f".env.example already exists. Overwrite it?", default_yes=False):
                    if write_file(env_path, env_content, ".env.example"):
                        files_created.append(".env.example")
                else:
                    info("Keeping your existing .env.example.")
            else:
                if write_file(env_path, env_content, ".env.example"):
                    files_created.append(".env.example")

            # Offer to create .env from example
            env_file = project_dir / ".env"
            if not env_file.exists():
                if ask_yes_no("You don't have a .env file yet. Create one from the example?"):
                    if write_file(env_file, env_content, ".env"):
                        files_created.append(".env")
                    info("Remember to fill in your real values in .env!")
        else:
            info("No environment variables detected. Skipping .env.example.")

        # .gitignore
        subheading(".gitignore")
        info("This file tells Git which files to ignore (secrets, build output, etc.).")
        gitignore_path = project_dir / ".gitignore"
        if gitignore_path.exists():
            info(".gitignore already exists -- great!")
            # Check if .env is covered
            try:
                existing = gitignore_path.read_text(encoding="utf-8")
                if ".env" not in existing:
                    warn("Your .gitignore doesn't seem to ignore .env files!")
                    if ask_yes_no("Add .env to your .gitignore?"):
                        new_content = existing.rstrip() + "\n\n# Environment variables\n.env\n.env.local\n.env.*.local\n"
                        if write_file(gitignore_path, new_content, ".gitignore"):
                            files_created.append(".gitignore (updated)")
                else:
                    success(".env files are properly ignored.")
            except Exception:
                pass
        else:
            content = generate_gitignore(stack)
            if write_file(gitignore_path, content, ".gitignore"):
                files_created.append(".gitignore")

        # CONTRIBUTING.md
        subheading("CONTRIBUTING.md")
        info("This file explains how to make changes -- perfect for non-technical")
        info("team members or anyone new to the project.")
        contrib_path = project_dir / "CONTRIBUTING.md"
        if contrib_path.exists():
            if ask_yes_no(f"CONTRIBUTING.md already exists. Overwrite it?", default_yes=False):
                content = generate_contributing_md(stack, project_name)
                if write_file(contrib_path, content, "CONTRIBUTING.md"):
                    files_created.append("CONTRIBUTING.md")
            else:
                info("Keeping your existing CONTRIBUTING.md.")
        else:
            content = generate_contributing_md(stack, project_name)
            if write_file(contrib_path, content, "CONTRIBUTING.md"):
                files_created.append("CONTRIBUTING.md")

        # -- Summary --
        heading("All Done!")

        if files_created:
            typewrite(
                f"  {C.GREEN}{C.BOLD}Here's what we set up for you:{C.RESET}",
                delay=0.015,
            )
            print()
            for f in files_created:
                bullet(f"{C.GREEN}{f}{C.RESET}")
        else:
            info("No new files were created (everything was already in place).")

        print()
        print(textwrap.dedent(f"""\
        {C.WHITE}  Next steps:{C.RESET}

          {C.CYAN}1.{C.RESET} Fill in your {C.BOLD}.env{C.RESET} file with real values (API keys, etc.)
          {C.CYAN}2.{C.RESET} Push your code to GitHub
          {C.CYAN}3.{C.RESET} Connect your repo to Vercel (or your hosting platform)
          {C.CYAN}4.{C.RESET} Add environment variables to your hosting platform
          {C.CYAN}5.{C.RESET} Deploy and celebrate!
        """))

        print(textwrap.dedent(f"""\
        {C.GRAY}  -------------------------------------------------------
          {C.PINK}{C.BOLD}Powered by Girl Code{C.RESET}{C.GRAY} | girlcode.technology
          Fractional CTO & Tech Consulting
          by Brooke Lacey and Nicki Sanders

          Questions? Need help deploying? Reach out to your
          Girl Code team -- we're here to help!
          -------------------------------------------------------{C.RESET}
        """))

        pause("Press Enter to close.")

    except KeyboardInterrupt:
        print(f"\n\n  {C.PINK}Bye! Come back anytime.{C.RESET}")
        print(f"  {C.GRAY}Powered by Girl Code | girlcode.technology{C.RESET}\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n  {C.RED}Oops! Something went wrong:{C.RESET}")
        print(f"  {C.RED}{e}{C.RESET}")
        print(f"\n  {C.GRAY}If this keeps happening, reach out to your Girl Code team.{C.RESET}")
        print(f"  {C.GRAY}girlcode.technology{C.RESET}\n")
        pause("Press Enter to close.")
        sys.exit(1)


if __name__ == "__main__":
    main()
