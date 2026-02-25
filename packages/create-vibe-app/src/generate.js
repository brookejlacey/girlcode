/**
 * generate.js — File generation engine
 *
 * Takes the user's config from the prompts and writes the appropriate
 * files to the project directory.
 */

import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  claudeMd,
  envExample,
  contributingMd,
  gitignore,
} from './templates.js';

// ── ANSI helpers ────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

// ── Progress display ────────────────────────────────────────────────────

function fileCreated(name) {
  console.log(`  ${GREEN}+${RESET} ${CYAN}${name}${RESET} created`);
}

function fileSkipped(name, reason) {
  console.log(
    `  ${YELLOW}-${RESET} ${DIM}${name}${RESET} ${DIM}(${reason})${RESET}`
  );
}

/**
 * Try to write a file. Returns true on success, false on failure.
 * On failure, prints a user-friendly message and adds to skipped list.
 */
function safeWrite(filePath, content, filename, skipped) {
  try {
    writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (err) {
    if (err.code === 'EACCES') {
      console.log(
        `  ${RED}!${RESET} ${CYAN}${filename}${RESET} ${RED}Permission denied — try running as administrator or check folder permissions.${RESET}`
      );
    } else if (err.code === 'ENOSPC') {
      console.log(
        `  ${RED}!${RESET} ${CYAN}${filename}${RESET} ${RED}Disk is full — free up some space and try again.${RESET}`
      );
    } else {
      console.log(
        `  ${RED}!${RESET} ${CYAN}${filename}${RESET} ${RED}Could not write: ${err.message}${RESET}`
      );
    }
    skipped.push(filename);
    return false;
  }
}

// ── Main generator ──────────────────────────────────────────────────────

/**
 * Generate all project files based on user config.
 * Returns an object summarising what was created/skipped.
 *
 * @param {object} config — output from runPrompts()
 * @param {string} dir    — target directory (defaults to cwd)
 */
export function generateFiles(config, dir = process.cwd()) {
  const created = [];
  const skipped = [];

  console.log(`\n${BOLD}  Generating files...${RESET}\n`);

  // ── CLAUDE.md ───────────────────────────────────────────────────────
  const claudePath = join(dir, 'CLAUDE.md');
  if (existsSync(claudePath)) {
    fileSkipped('CLAUDE.md', 'already exists');
    skipped.push('CLAUDE.md');
  } else {
    if (safeWrite(claudePath, claudeMd(config), 'CLAUDE.md', skipped)) {
      fileCreated('CLAUDE.md');
      created.push('CLAUDE.md');
    }
  }

  // ── .env.example ────────────────────────────────────────────────────
  const envPath = join(dir, '.env.example');
  if (existsSync(envPath)) {
    fileSkipped('.env.example', 'already exists');
    skipped.push('.env.example');
  } else {
    if (safeWrite(envPath, envExample(config), '.env.example', skipped)) {
      fileCreated('.env.example');
      created.push('.env.example');
    }
  }

  // ── CONTRIBUTING.md ─────────────────────────────────────────────────
  const contribPath = join(dir, 'CONTRIBUTING.md');
  if (existsSync(contribPath)) {
    fileSkipped('CONTRIBUTING.md', 'already exists');
    skipped.push('CONTRIBUTING.md');
  } else {
    if (safeWrite(contribPath, contributingMd(config), 'CONTRIBUTING.md', skipped)) {
      fileCreated('CONTRIBUTING.md');
      created.push('CONTRIBUTING.md');
    }
  }

  // ── .gitignore ──────────────────────────────────────────────────────
  const giPath = join(dir, '.gitignore');
  if (existsSync(giPath)) {
    fileSkipped('.gitignore', 'already exists');
    skipped.push('.gitignore');
  } else {
    if (safeWrite(giPath, gitignore(config), '.gitignore', skipped)) {
      fileCreated('.gitignore');
      created.push('.gitignore');
    }
  }

  console.log('');
  return { created, skipped };
}
