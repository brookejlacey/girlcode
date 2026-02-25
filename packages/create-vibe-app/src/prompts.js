/**
 * prompts.js — Interactive prompts using Node.js readline
 *
 * Zero-dependency prompt helpers that work on Windows, Mac, and Linux.
 */

import { createInterface } from 'node:readline';

// ── ANSI helpers ────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const WHITE = '\x1b[37m';

const PROMPT_PREFIX = `${MAGENTA}${BOLD}?${RESET} `;

// ── Readline singleton ──────────────────────────────────────────────────

let _rl = null;

/**
 * When true, a close event means the user (or the pipe) ended input
 * before we finished — we reject any pending prompt.
 * When false, close was called intentionally via closePrompts().
 */
let _closedIntentionally = false;

/**
 * Keep a reference to the reject function of the currently pending prompt
 * so the close handler can reject it cleanly.
 */
let _pendingReject = null;

function getRL() {
  if (!_rl) {
    _rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Handle Ctrl+C / unexpected EOF gracefully
    _rl.on('close', () => {
      if (_closedIntentionally) return;

      console.log(
        `\n\n${YELLOW}No worries! Come back whenever you are ready.${RESET}`
      );
      console.log(
        `${DIM}Powered by Girl Code | girlcode.technology${RESET}\n`
      );

      if (_pendingReject) {
        _pendingReject(new Error('USER_EXIT'));
        _pendingReject = null;
      }
    });
  }
  return _rl;
}

/**
 * Close the readline interface. Call this when all prompts are done.
 */
export function closePrompts() {
  if (_rl) {
    _closedIntentionally = true;
    _rl.close();
    _rl = null;
  }
}

// ── Prompt primitives ───────────────────────────────────────────────────

/**
 * Ask a free-text question. Returns the trimmed answer.
 * If `defaultValue` is provided it is shown in brackets and used when
 * the user presses Enter without typing anything.
 */
export function ask(question, defaultValue = '') {
  return new Promise((resolve, reject) => {
    _pendingReject = reject;
    const defaultHint = defaultValue
      ? ` ${DIM}(${defaultValue})${RESET}`
      : '';
    getRL().question(
      `${PROMPT_PREFIX}${BOLD}${question}${RESET}${defaultHint} `,
      (answer) => {
        _pendingReject = null;
        resolve(answer.trim() || defaultValue);
      }
    );
  });
}

/**
 * Ask a yes/no question. Returns a boolean.
 * `defaultYes` controls what happens when the user just presses Enter.
 */
export function confirm(question, defaultYes = true) {
  return new Promise((resolve, reject) => {
    _pendingReject = reject;
    const hint = defaultYes
      ? `${DIM}(Y/n)${RESET}`
      : `${DIM}(y/N)${RESET}`;
    getRL().question(
      `${PROMPT_PREFIX}${BOLD}${question}${RESET} ${hint} `,
      (answer) => {
        _pendingReject = null;
        const a = answer.trim().toLowerCase();
        if (a === '') return resolve(defaultYes);
        resolve(a === 'y' || a === 'yes');
      }
    );
  });
}

/**
 * Show a numbered list and let the user pick one (or accept the default).
 * Returns the chosen option string.
 */
export function select(question, options, defaultIndex = 0) {
  return new Promise((resolve, reject) => {
    _pendingReject = reject;
    console.log(`\n${PROMPT_PREFIX}${BOLD}${question}${RESET}`);
    options.forEach((opt, i) => {
      const marker =
        i === defaultIndex
          ? `${CYAN}${BOLD}> ${i + 1}.${RESET} ${CYAN}${opt}${RESET}`
          : `  ${DIM}${i + 1}.${RESET} ${opt}`;
      console.log(`  ${marker}`);
    });

    getRL().question(
      `\n  ${DIM}Enter a number (default: ${defaultIndex + 1}):${RESET} `,
      (answer) => {
        _pendingReject = null;
        const num = parseInt(answer.trim(), 10);
        if (num >= 1 && num <= options.length) {
          resolve(options[num - 1]);
        } else {
          resolve(options[defaultIndex]);
        }
      }
    );
  });
}

// ── Composite prompt flows ──────────────────────────────────────────────

/**
 * Run the full interactive interview. `detection` is the result from detect.js.
 * Returns a config object used by the generator.
 */
export async function runPrompts(detection) {
  console.log('');

  // ── Project name ────────────────────────────────────────────────────
  const dirName = process.cwd().split(/[\\/]/).pop() || 'my-vibe-app';
  const projectName = await ask('What is your project called?', dirName);

  // ── Stack confirmation ──────────────────────────────────────────────
  const detectedSummary = [
    ...detection.frameworks,
    ...detection.tools,
  ].join(', ');

  let stack = detectedSummary;
  if (detectedSummary) {
    console.log(
      `\n  ${GREEN}Detected:${RESET} ${WHITE}${detectedSummary}${RESET}`
    );
    const correct = await confirm('Does that look right?', true);
    if (!correct) {
      stack = await ask(
        'What frameworks/tools are you using? (comma separated)'
      );
    }
  } else {
    stack = await ask(
      'I could not detect your stack. What frameworks/tools are you using?',
      'Next.js, Tailwind CSS'
    );
  }

  // ── Database ────────────────────────────────────────────────────────
  const needsDB = await confirm('Does your app need a database?', true);
  let database = 'none';
  if (needsDB) {
    database = await select('Which database provider?', [
      'Supabase (recommended — generous free tier!)',
      'PlanetScale / MySQL',
      'Neon / PostgreSQL',
      'MongoDB Atlas',
      'Firebase Firestore',
      'I will figure it out later',
    ]);
    // Normalize
    if (database.startsWith('Supabase')) database = 'supabase';
    else if (database.startsWith('PlanetScale')) database = 'planetscale';
    else if (database.startsWith('Neon')) database = 'neon';
    else if (database.startsWith('MongoDB')) database = 'mongodb';
    else if (database.startsWith('Firebase')) database = 'firebase';
    else database = 'other';
  }

  // ── Deploy target ──────────────────────────────────────────────────
  const deployTarget = await select('Where do you want to deploy?', [
    'Vercel (recommended for Next.js — free tier!)',
    'Netlify',
    'Railway',
    'Fly.io',
    'AWS / other cloud',
    'I am not sure yet',
  ]);

  let deploy = 'vercel';
  if (deployTarget.startsWith('Netlify')) deploy = 'netlify';
  else if (deployTarget.startsWith('Railway')) deploy = 'railway';
  else if (deployTarget.startsWith('Fly')) deploy = 'flyio';
  else if (deployTarget.startsWith('AWS')) deploy = 'aws';
  else if (deployTarget.startsWith('I am')) deploy = 'undecided';

  // ── GitHub ──────────────────────────────────────────────────────────
  const hasGitHub = await confirm(
    'Do you have a GitHub account?',
    true
  );

  // ── Auth ────────────────────────────────────────────────────────────
  const needsAuth = await confirm(
    'Will users need to sign in to your app?',
    false
  );
  let auth = 'none';
  if (needsAuth) {
    auth = await select('How will users sign in?', [
      'Supabase Auth (works great with Supabase DB)',
      'Clerk (easiest to set up)',
      'NextAuth / Auth.js',
      'Firebase Auth',
      'I will decide later',
    ]);
    if (auth.startsWith('Supabase')) auth = 'supabase';
    else if (auth.startsWith('Clerk')) auth = 'clerk';
    else if (auth.startsWith('NextAuth')) auth = 'nextauth';
    else if (auth.startsWith('Firebase')) auth = 'firebase';
    else auth = 'other';
  }

  return {
    projectName,
    stack,
    language: detection.language,
    frameworks: detection.frameworks,
    tools: detection.tools,
    packageManager: detection.packageManager || 'npm',
    database,
    deploy,
    hasGitHub,
    auth,
    detection,
  };
}
