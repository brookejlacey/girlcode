#!/usr/bin/env node

/**
 * create-vibe-app CLI
 * Set up your vibecoded app for production — powered by Girl Code
 *
 * Usage:
 *   npx create-vibe-app
 *   node bin/cli.js
 */

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
