#!/usr/bin/env node

/**
 * @dev-workflow/kit update
 *
 * Updates scaffold files in an existing project while preserving user data.
 * Equivalent to `init --force` but with explicit messaging about what changes.
 *
 * Preserved files (never overwritten):
 *   - .dev-workflow/preferences.yml
 *   - .dev-workflow/preferences.local.yml
 *   - .dev-workflow/learnings/LEARNINGS.md
 *
 * Usage:
 *   npx @dev-workflow/kit update [--dry-run]
 */

const fs = require('fs');
const path = require('path');

// ── Config ───────────────────────────────────────────────────────────────────

const SCAFFOLD_DIR = path.resolve(__dirname, '..', 'scaffold');
const RULES_DIR = path.resolve(__dirname, '..', 'rules');
const SKILLS_DIR = path.resolve(__dirname, '..', 'skills');
const TARGET_DIR = process.cwd();

const PRESERVED_FILES = [
  '.dev-workflow/preferences.yml',
  '.dev-workflow/preferences.local.yml',
  '.dev-workflow/learnings/LEARNINGS.md',
  '.dev-workflow/tech-debt.yml',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function collectChanges(src, dest, preserved) {
  const changes = { create: [], update: [], skip: [] };
  collectChangesRecursive(src, dest, preserved, changes);
  return changes;
}

function collectChangesRecursive(src, dest, preserved, changes) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    for (const entry of fs.readdirSync(src)) {
      if (entry === '.gitignore-additions') continue;
      collectChangesRecursive(
        path.join(src, entry),
        path.join(dest, entry),
        preserved,
        changes
      );
    }
  } else {
    const relativeDest = path.relative(TARGET_DIR, dest);

    if (preserved.includes(relativeDest) && fs.existsSync(dest)) {
      changes.skip.push(relativeDest);
      return;
    }

    if (!fs.existsSync(dest)) {
      changes.create.push(relativeDest);
    } else {
      const srcContent = fs.readFileSync(src, 'utf8');
      const destContent = fs.readFileSync(dest, 'utf8');
      if (srcContent !== destContent) {
        changes.update.push(relativeDest);
      }
    }
  }
}

function applyChanges(src, dest, preserved) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      if (entry === '.gitignore-additions') continue;
      applyChanges(path.join(src, entry), path.join(dest, entry), preserved);
    }
  } else {
    const relativeDest = path.relative(TARGET_DIR, dest);

    if (preserved.includes(relativeDest) && fs.existsSync(dest)) {
      return; // Skip preserved
    }

    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.copyFileSync(src, dest);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('');
  console.log('[dev-workflow] Checking for updates...');
  console.log('');

  // Check if scaffold exists
  if (!fs.existsSync(path.join(TARGET_DIR, '.dev-workflow'))) {
    console.log('No existing dev-workflow installation found.');
    console.log('Run `npx @dev-workflow/kit init` first.');
    process.exit(1);
  }

  const changes = collectChanges(SCAFFOLD_DIR, TARGET_DIR, PRESERVED_FILES);

  // Also check rules/ → .claude/rules/
  const targetRules = path.join(TARGET_DIR, '.claude', 'rules');
  const rulesChanges = collectChanges(RULES_DIR, targetRules, []);
  changes.create.push(...rulesChanges.create);
  changes.update.push(...rulesChanges.update);

  // Also check skills/ → .claude/skills/
  const targetSkills = path.join(TARGET_DIR, '.claude', 'skills');
  const skillsChanges = collectChanges(SKILLS_DIR, targetSkills, []);
  changes.create.push(...skillsChanges.create);
  changes.update.push(...skillsChanges.update);

  if (changes.create.length === 0 && changes.update.length === 0) {
    console.log('Everything is up to date. No changes needed.');
    process.exit(0);
  }

  // Report changes
  if (changes.create.length > 0) {
    console.log(`New files (${changes.create.length}):`);
    for (const f of changes.create) {
      console.log(`  + ${f}`);
    }
    console.log('');
  }

  if (changes.update.length > 0) {
    console.log(`Updated files (${changes.update.length}):`);
    for (const f of changes.update) {
      console.log(`  ~ ${f}`);
    }
    console.log('');
  }

  if (changes.skip.length > 0) {
    console.log(`Preserved files (${changes.skip.length}):`);
    for (const f of changes.skip) {
      console.log(`  = ${f}`);
    }
    console.log('');
  }

  if (dryRun) {
    console.log('[dev-workflow] Dry run complete. No files were changed.');
    process.exit(0);
  }

  // Apply
  applyChanges(SCAFFOLD_DIR, TARGET_DIR, PRESERVED_FILES);
  applyChanges(RULES_DIR, targetRules, []);
  applyChanges(SKILLS_DIR, targetSkills, []);

  console.log(`[dev-workflow] Update complete. ${changes.create.length} created, ${changes.update.length} updated, ${changes.skip.length} preserved.`);
  console.log('');
}

main();
