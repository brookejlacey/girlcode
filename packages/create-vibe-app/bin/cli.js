#!/usr/bin/env node

/**
 * create-vibe-app CLI
 * Set up your vibecoded app for production — powered by Girl Code
 *
 * Usage:
 *   npx create-vibe-app
 *   node bin/cli.js
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

// ── Handle --help / -h ────────────────────────────────────────────────

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
  create-vibe-app v${pkg.version}

  Set up your vibecoded app for production — powered by Girl Code

  Usage:
    npx create-vibe-app
    node bin/cli.js

  Options:
    -h, --help      Show this help message and exit
    -v, --version   Print the version number and exit

  Run this command inside your project directory.
  It will scan your stack and generate production-ready config files.

  Learn more: https://girlcode.technology
`);
  process.exit(0);
}

// ── Handle --version / -v ─────────────────────────────────────────────

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(`create-vibe-app v${pkg.version}`);
  process.exit(0);
}

// ── Run the CLI ───────────────────────────────────────────────────────

import { run } from '../src/index.js';

run().catch((err) => {
  if (err.message === 'USER_EXIT') {
    // User pressed Ctrl+C or chose to quit — exit silently
    process.exit(0);
  }
  console.error('\n\x1b[31mSomething went wrong:\x1b[0m', err.message);
  console.error(
    '\x1b[33mIf you need help, visit https://girlcode.technology\x1b[0m\n'
  );
  process.exit(1);
});
