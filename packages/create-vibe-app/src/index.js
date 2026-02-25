/**
 * index.js — Main orchestrator for create-vibe-app
 *
 * This is the brain of the CLI. It wires together detection, prompts,
 * file generation, and the final "next steps" output.
 */

import { detectStack, summarizeStack } from './detect.js';
import { runPrompts, closePrompts } from './prompts.js';
import { generateFiles } from './generate.js';

// ── ANSI colour codes ───────────────────────────────────────────────────

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const UNDERLINE = '\x1b[4m';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';

const BG_MAGENTA = '\x1b[45m';

// ── Welcome banner ──────────────────────────────────────────────────────

function printBanner() {
  const IW = 46; // inner width between ║ borders
  const border = '═'.repeat(IW);
  const empty = ' '.repeat(IW);

  const art = [
    '████ █ ████ █      ████ ████ ███  ████',
    '█    █ █  █ █      █    █  █ █  █ █   ',
    '█ ██ █ ████ █      █    █  █ █  █ ████',
    '█  █ █ █ █  █      █    █  █ █  █ █   ',
    '████ █ █  █ ████   ████ ████ ███  ████',
  ];

  const ver = 'create-vibe-app v1.0.0';

  console.log('');
  console.log(`${MAGENTA}${BOLD}  ╔${border}╗${RESET}`);
  console.log(`${MAGENTA}${BOLD}  ║${empty}║${RESET}`);
  for (const line of art) {
    const pad = ' '.repeat(IW - 3 - line.length);
    console.log(`${MAGENTA}${BOLD}  ║${RESET}   ${WHITE}${BOLD}${line}${RESET}${pad}${MAGENTA}${BOLD}║${RESET}`);
  }
  console.log(`${MAGENTA}${BOLD}  ║${empty}║${RESET}`);
  console.log(`${MAGENTA}${BOLD}  ║${RESET}   ${CYAN}${ver}${RESET}${' '.repeat(IW - 3 - ver.length)}${MAGENTA}${BOLD}║${RESET}`);
  console.log(`${MAGENTA}${BOLD}  ║${empty}║${RESET}`);
  console.log(`${MAGENTA}${BOLD}  ╚${border}╝${RESET}`);
  console.log('');
  console.log(`  ${DIM}Set up your vibecoded app for production.${RESET}`);
  console.log(`  ${DIM}Powered by Girl Code | girlcode.technology${RESET}`);
  console.log('');
}

// ── Stack detection display ─────────────────────────────────────────────

function printDetection(detection) {
  console.log(
    `${CYAN}${BOLD}  Scanning your project...${RESET}`
  );
  console.log('');

  // Language
  console.log(
    `  ${DIM}Language:${RESET}  ${WHITE}${detection.language}${RESET}`
  );

  // Frameworks
  if (detection.frameworks.length) {
    console.log(
      `  ${DIM}Frameworks:${RESET} ${GREEN}${detection.frameworks.join(', ')}${RESET}`
    );
  }

  // Tools
  if (detection.tools.length) {
    console.log(
      `  ${DIM}Tools:${RESET}     ${GREEN}${detection.tools.join(', ')}${RESET}`
    );
  }

  // Package manager
  if (detection.packageManager) {
    console.log(
      `  ${DIM}Pkg mgr:${RESET}   ${WHITE}${detection.packageManager}${RESET}`
    );
  }

  // Existing files
  const existing = [];
  if (detection.hasGit) existing.push('.git');
  if (detection.hasGitignore) existing.push('.gitignore');
  if (detection.hasEnv) existing.push('.env');
  if (detection.hasEnvExample) existing.push('.env.example');
  if (detection.hasDocker) existing.push('Docker');
  if (detection.hasClaude) existing.push('CLAUDE.md');
  if (detection.hasContributing) existing.push('CONTRIBUTING.md');

  if (existing.length) {
    console.log(
      `  ${DIM}Found:${RESET}     ${YELLOW}${existing.join(', ')}${RESET}`
    );
  }

  if (detection.language === 'Unknown') {
    console.log('');
    console.log(
      `  ${YELLOW}Could not auto-detect your stack — no worries, I will ask!${RESET}`
    );
  }
}

// ── Next steps ──────────────────────────────────────────────────────────

function printNextSteps(config, result) {
  const { created, skipped } = result;

  // Summary
  console.log(
    `${GREEN}${BOLD}  All done! Here is what was created:${RESET}`
  );
  console.log('');
  for (const f of created) {
    console.log(`    ${GREEN}+${RESET} ${f}`);
  }
  for (const f of skipped) {
    console.log(`    ${DIM}- ${f} (already existed, left untouched)${RESET}`);
  }

  // Numbered next steps
  console.log('');
  console.log(
    `${MAGENTA}${BOLD}  What to do next:${RESET}`
  );
  console.log('');

  let step = 1;

  // Git init
  if (!config.detection.hasGit) {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Initialize a git repository:`
    );
    console.log(`     ${CYAN}git init && git add -A && git commit -m "Initial commit"${RESET}`);
    console.log('');
    step++;
  }

  // GitHub
  if (config.hasGitHub) {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Create a GitHub repo and push your code:`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://github.com/new${RESET}`
    );
    console.log('');
    step++;
  } else {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Create a free GitHub account (you will need it!):`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://github.com/signup${RESET}`
    );
    console.log('');
    step++;
  }

  // Environment variables
  console.log(
    `  ${WHITE}${BOLD}${step}.${RESET} Set up your environment variables:`
  );
  console.log(
    `     Copy ${CYAN}.env.example${RESET} to ${CYAN}.env.local${RESET} and fill in the values.`
  );
  console.log('');
  step++;

  // Database
  if (config.database === 'supabase') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Create a Supabase project (free):`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://supabase.com/dashboard/new${RESET}`
    );
    console.log(
      `     Copy the project URL and anon key into ${CYAN}.env.local${RESET}.`
    );
    console.log('');
    step++;
  } else if (config.database === 'planetscale') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Create a PlanetScale database:`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://planetscale.com${RESET}`
    );
    console.log('');
    step++;
  } else if (config.database === 'neon') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Create a Neon PostgreSQL database (free):`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://neon.tech${RESET}`
    );
    console.log('');
    step++;
  } else if (config.database === 'mongodb') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Create a MongoDB Atlas cluster (free):`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://www.mongodb.com/cloud/atlas${RESET}`
    );
    console.log('');
    step++;
  } else if (config.database === 'firebase') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Set up a Firebase project:`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://console.firebase.google.com${RESET}`
    );
    console.log('');
    step++;
  }

  // Deploy
  if (config.deploy === 'vercel') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Connect your repo to Vercel (free):`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://vercel.com/new${RESET}`
    );
    console.log(
      `     Import your GitHub repo and Vercel will auto-deploy.`
    );
    console.log('');
    step++;
  } else if (config.deploy === 'netlify') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Deploy to Netlify:`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://app.netlify.com/start${RESET}`
    );
    console.log('');
    step++;
  } else if (config.deploy === 'railway') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Deploy to Railway:`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://railway.app/new${RESET}`
    );
    console.log('');
    step++;
  } else if (config.deploy === 'flyio') {
    console.log(
      `  ${WHITE}${BOLD}${step}.${RESET} Deploy to Fly.io:`
    );
    console.log(
      `     ${UNDERLINE}${BLUE}https://fly.io/docs/getting-started/${RESET}`
    );
    console.log('');
    step++;
  }

  // Add env vars to deploy platform
  console.log(
    `  ${WHITE}${BOLD}${step}.${RESET} Add your environment variables to your hosting platform.`
  );
  console.log(
    `     (Every value from ${CYAN}.env.local${RESET} needs to be added there too.)`
  );
  console.log('');
  step++;

  // First PR
  console.log(
    `  ${WHITE}${BOLD}${step}.${RESET} Make your first Pull Request!`
  );
  console.log(
    `     Read ${CYAN}CONTRIBUTING.md${RESET} for a step-by-step guide.`
  );
  console.log('');

  // ── Girl Code CTA ─────────────────────────────────────────────────
  console.log(
    `${MAGENTA}${BOLD}  ──────────────────────────────────────────────────${RESET}`
  );
  console.log('');
  console.log(
    `  ${MAGENTA}${BOLD}Need hands-on help?${RESET}`
  );
  console.log(
    `  Girl Code offers workshops, pair programming, and deploy support`
  );
  console.log(
    `  for non-technical founders shipping their first apps.`
  );
  console.log('');
  console.log(
    `  ${UNDERLINE}${BLUE}https://girlcode.technology${RESET}`
  );
  console.log('');
  console.log(
    `  ${DIM}You built something. Now let's ship it.${RESET} ${MAGENTA}${BOLD}<3${RESET}`
  );
  console.log('');
}

// ── Main entry point ────────────────────────────────────────────────────

export async function run() {
  // Banner
  printBanner();

  // Detect stack
  const detection = detectStack(process.cwd());
  printDetection(detection);

  // Interactive prompts
  let config;
  try {
    config = await runPrompts(detection);
  } finally {
    closePrompts();
  }

  // Generate files
  const result = generateFiles(config, process.cwd());

  // Next steps
  printNextSteps(config, result);
}
