#!/usr/bin/env node

/**
 * @dev-workflow/kit init
 *
 * Scaffolds dev-workflow files into the current project.
 * Copies scaffold/ contents into the project root, merging .gitignore
 * additions and preserving existing preferences/learnings.
 *
 * Usage:
 *   npx @dev-workflow/kit init [--force] [--claude-only] [--opencode-only]
 *
 * Flags:
 *   --force          Overwrite existing files (except preserved files)
 *   --claude-only    Skip .opencode/ files (for Claude Code-only projects)
 *   --opencode-only  Skip .claude/rules/ and .claude/skills/ (for OpenCode-only projects)
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

const GITIGNORE_ADDITIONS_FILE = path.join(SCAFFOLD_DIR, '.gitignore-additions');

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Recursively copy files from src to dest, preserving directory structure.
 * Skips preserved files (e.g., preferences, learnings) and existing files
 * unless --force is set. Labels each file as CREATE or UPDATE.
 *
 * @param {string} src - Source directory or file path
 * @param {string} dest - Destination directory or file path
 * @param {boolean} force - If true, overwrite existing non-preserved files
 * @param {string[]} preserved - Relative paths that should never be overwritten
 */
function copyRecursive(src, dest, force, preserved) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      // Skip the .gitignore-additions meta file
      if (entry === '.gitignore-additions') continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry), force, preserved);
    }
  } else {
    const relativeDest = path.relative(TARGET_DIR, dest);

    // Check if this file should be preserved
    if (preserved.includes(relativeDest) && fs.existsSync(dest)) {
      console.log(`  SKIP (preserved) ${relativeDest}`);
      return;
    }

    if (fs.existsSync(dest) && !force) {
      console.log(`  SKIP (exists)    ${relativeDest}`);
      return;
    }

    // Ensure parent directory exists
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const action = fs.existsSync(dest) ? 'UPDATE' : 'CREATE';
    fs.copyFileSync(src, dest);
    console.log(`  ${action}            ${relativeDest}`);
  }
}

/**
 * Merge dev-workflow .gitignore entries into the project's .gitignore.
 * Reads additions from scaffold/.gitignore-additions, deduplicates against
 * existing entries, and appends any new lines under a labelled block.
 */
function mergeGitignore() {
  if (!fs.existsSync(GITIGNORE_ADDITIONS_FILE)) return;

  const additions = fs.readFileSync(GITIGNORE_ADDITIONS_FILE, 'utf8')
    .split('\n')
    .filter(line => !line.startsWith('#') && line.trim() !== '');

  const targetGitignore = path.join(TARGET_DIR, '.gitignore');
  let existingContent = '';

  if (fs.existsSync(targetGitignore)) {
    existingContent = fs.readFileSync(targetGitignore, 'utf8');
  }

  const linesToAdd = additions.filter(line => !existingContent.includes(line));

  if (linesToAdd.length === 0) {
    console.log('  .gitignore already up to date');
    return;
  }

  const separator = existingContent.endsWith('\n') ? '\n' : '\n\n';
  const block = `${separator}# ── Dev Workflow Kit ──────────────────────────────────────────────────────────\n${linesToAdd.join('\n')}\n`;

  fs.appendFileSync(targetGitignore, block);
  console.log(`  MERGE .gitignore (+${linesToAdd.length} lines)`);
}

function printOpenCodeInstructions() {
  const hasOpenCodeJson = fs.existsSync(path.join(TARGET_DIR, 'opencode.json'));

  console.log('\n── OpenCode Setup ──────────────────────────────────────────────────────────');
  if (hasOpenCodeJson) {
    console.log('  opencode.json was scaffolded. OpenCode will read .opencode/commands/,');
    console.log('  .opencode/agents/, and .claude/skills/*/SKILL.md automatically.');
  }
  console.log('  To add the optional runtime enforcement plugin:');
  console.log('    npm install @dev-workflow/kit');
  console.log('  Then add to your opencode.json:');
  console.log('    "plugin": ["@dev-workflow/kit/plugin/workflow-enforcer"]');
  console.log('');
}

function printClaudeCodeInstructions() {
  console.log('\n── Claude Code Setup ───────────────────────────────────────────────────────');
  console.log('  If you installed via the Claude Code plugin marketplace, you are all set.');
  console.log('  Skills are available as /dev-workflow:requirement, /dev-workflow:hld, etc.');
  console.log('');
  console.log('  If you used npx to scaffold files only, the skills/rules/agents live in');
  console.log('  the plugin repository. Add the plugin to your Claude Code config:');
  console.log('    /plugin install dev-workflow@marketplace');
  console.log('');
}

// ── Platform filter lists ─────────────────────────────────────────────────────

// Paths to exclude when --claude-only is set (these are OpenCode-specific files)
const OPENCODE_SPECIFIC_PATHS = [
  '.opencode',
  'opencode.json',
];

// Paths to exclude when --opencode-only is set (these are Claude-specific files)
const CLAUDE_SPECIFIC_PATHS = [
  '.claude/rules',
  '.claude/skills',
];

// ── Main ─────────────────────────────────────────────────────────────────────

/**
 * Check whether a relative path should be excluded based on platform flags.
 * Matches exact paths and path prefixes (e.g., '.opencode' matches '.opencode/commands/foo.md').
 *
 * @param {string} relativePath - Path relative to the project root
 * @param {string[]} excludedPaths - Prefixes to exclude (from OPENCODE_SPECIFIC_PATHS or CLAUDE_SPECIFIC_PATHS)
 * @returns {boolean} True if the path should be skipped
 */
function isExcluded(relativePath, excludedPaths) {
  return excludedPaths.some(p => relativePath === p || relativePath.startsWith(p + '/'));
}

/**
 * Like copyRecursive, but also filters out paths matching excludedPaths.
 * Used when --claude-only or --opencode-only flags are set to skip
 * platform-specific files during scaffold copy.
 *
 * @param {string} src - Source directory or file path
 * @param {string} dest - Destination directory or file path
 * @param {boolean} force - If true, overwrite existing non-preserved files
 * @param {string[]} preserved - Relative paths that should never be overwritten
 * @param {string[]} excludedPaths - Path prefixes to skip (platform-specific files)
 */
function copyRecursiveFiltered(src, dest, force, preserved, excludedPaths) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      if (entry === '.gitignore-additions') continue;
      const childSrc = path.join(src, entry);
      const childDest = path.join(dest, entry);
      const childRelative = path.relative(TARGET_DIR, childDest);
      if (isExcluded(childRelative, excludedPaths)) {
        console.log(`  SKIP (platform)  ${childRelative}`);
        continue;
      }
      copyRecursiveFiltered(childSrc, childDest, force, preserved, excludedPaths);
    }
  } else {
    const relativeDest = path.relative(TARGET_DIR, dest);

    if (preserved.includes(relativeDest) && fs.existsSync(dest)) {
      console.log(`  SKIP (preserved) ${relativeDest}`);
      return;
    }

    if (fs.existsSync(dest) && !force) {
      console.log(`  SKIP (exists)    ${relativeDest}`);
      return;
    }

    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const action = fs.existsSync(dest) ? 'UPDATE' : 'CREATE';
    fs.copyFileSync(src, dest);
    console.log(`  ${action}            ${relativeDest}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const force = args.includes('--force');
  const claudeOnly = args.includes('--claude-only');
  const opencodeOnly = args.includes('--opencode-only');

  if (command === 'update') {
    // Delegate to update.js
    require('./update.js');
    return;
  }

  if (command !== 'init') {
    console.log('Usage: npx @dev-workflow/kit <command> [flags]');
    console.log('');
    console.log('Commands:');
    console.log('  init     Scaffold dev-workflow files into your project');
    console.log('  update   Update scaffold files while preserving your data');
    console.log('');
    console.log('Flags:');
    console.log('  --force          Overwrite existing files (except preserved ones)');
    console.log('  --dry-run        Preview changes without applying them (update only)');
    console.log('  --claude-only    Skip .opencode/ files (Claude Code users only)');
    console.log('  --opencode-only  Skip .claude/rules/ and .claude/skills/ (OpenCode users only)');
    process.exit(command === undefined ? 1 : 0);
  }

  if (claudeOnly && opencodeOnly) {
    console.error('Error: --claude-only and --opencode-only cannot be used together.');
    process.exit(1);
  }

  // Build the list of paths to exclude based on platform flags
  const excludedPaths = [];
  if (claudeOnly) {
    excludedPaths.push(...OPENCODE_SPECIFIC_PATHS);
    console.log('[dev-workflow] Claude-only mode: skipping .opencode/ files');
  }
  if (opencodeOnly) {
    excludedPaths.push(...CLAUDE_SPECIFIC_PATHS);
    console.log('[dev-workflow] OpenCode-only mode: skipping .claude/rules/ and .claude/skills/');
  }

  console.log('');
  console.log('[dev-workflow] Scaffolding project files...');
  console.log('');

  // Copy scaffold files
  copyRecursiveFiltered(SCAFFOLD_DIR, TARGET_DIR, force, PRESERVED_FILES, excludedPaths);

  if (!opencodeOnly) {
    // Copy rules/ into .claude/rules/ (single source of truth — not stored in scaffold/)
    const targetRules = path.join(TARGET_DIR, '.claude', 'rules');
    console.log('');
    console.log('  Copying rules/ → .claude/rules/');
    copyRecursive(RULES_DIR, targetRules, force, []);

    // Copy skills/ into .claude/skills/ (OpenCode reads .claude/skills/*/SKILL.md natively)
    const targetSkills = path.join(TARGET_DIR, '.claude', 'skills');
    console.log('');
    console.log('  Copying skills/ → .claude/skills/');
    copyRecursive(SKILLS_DIR, targetSkills, force, []);
  }

  // Merge .gitignore
  mergeGitignore();

  console.log('');
  console.log('[dev-workflow] Scaffold complete.');

  printClaudeCodeInstructions();
  printOpenCodeInstructions();

  // Detect existing codebase without CLAUDE.md/AGENTS.md
  const hasClaude = fs.existsSync(path.join(TARGET_DIR, 'CLAUDE.md'));
  const hasAgents = fs.existsSync(path.join(TARGET_DIR, 'AGENTS.md'));
  const hasSourceFiles = fs.existsSync(path.join(TARGET_DIR, 'src'))
    || fs.existsSync(path.join(TARGET_DIR, 'lib'))
    || fs.existsSync(path.join(TARGET_DIR, 'app'))
    || fs.existsSync(path.join(TARGET_DIR, 'pkg'))
    || fs.existsSync(path.join(TARGET_DIR, 'package.json'))
    || fs.existsSync(path.join(TARGET_DIR, 'go.mod'))
    || fs.existsSync(path.join(TARGET_DIR, 'Cargo.toml'))
    || fs.existsSync(path.join(TARGET_DIR, 'pyproject.toml'))
    || fs.existsSync(path.join(TARGET_DIR, 'requirements.txt'));

  if (hasSourceFiles && (!hasClaude || !hasAgents)) {
    console.log('── Legacy Codebase Detected ─────────────────────────────────────────────');
    console.log('  Existing source code found but no CLAUDE.md/AGENTS.md.');
    console.log('  For the best experience with an existing codebase, run:');
    console.log('');
    console.log('    /dev-workflow:onboard     Analyze codebase, generate CLAUDE.md + AGENTS.md');
    console.log('    /dev-workflow:doctor      Scan for tech debt, generate health report');
    console.log('');
  }

  console.log('── Next Steps ──────────────────────────────────────────────────────────────');
  console.log('  1. Run /dev-workflow:preferences to configure team settings');
  if (hasSourceFiles && (!hasClaude || !hasAgents)) {
    console.log('  2. Run /dev-workflow:onboard to generate codebase-aware project docs');
    console.log('  3. Run /dev-workflow:doctor to scan for tech debt');
    console.log('  4. Run /dev-workflow:workflow <feature-name> to start your first pipeline');
  } else {
    console.log('  2. Run /dev-workflow:workflow <feature-name> to start your first pipeline');
  }
  console.log('');
}

main();
