#!/usr/bin/env node

/**
 * @dev-workflow/kit lock
 *
 * Generates skills-lock.json by hashing every SKILL.md in skills/ and
 * extracting frontmatter metadata. Commit this file alongside plugin.json
 * to record the exact state of skills at release time.
 *
 * Usage:
 *   node bin/lock.js              Generate skills-lock.json
 *   node bin/lock.js --verify     Verify installed skills match the lock
 *
 * Verification checks .claude/skills/ in the current working directory
 * against the hashes in skills-lock.json.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Config ────────────────────────────────────────────────────────────────────

const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');
const LOCK_FILE = path.join(PLUGIN_ROOT, 'skills-lock.json');
const PLUGIN_JSON = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');

// ── Helpers ───────────────────────────────────────────────────────────────────

function sha256(content) {
  return 'sha256:' + crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Parse YAML frontmatter from a SKILL.md file.
 * Returns an object with the extracted fields (name, description, etc.).
 * Does not require a YAML parser — handles simple key: value pairs only.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const result = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key && value) result[key] = value;
  }
  return result;
}

/**
 * Walk skills/ and return an array of { name, skillPath, content } objects,
 * one per SKILL.md found.
 */
function collectSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) {
    console.error(`Error: skills directory not found at ${skillsDir}`);
    process.exit(1);
  }

  const skills = [];
  for (const entry of fs.readdirSync(skillsDir).sort()) {
    const skillDir = path.join(skillsDir, entry);
    if (!fs.statSync(skillDir).isDirectory()) continue;

    const skillMd = path.join(skillDir, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;

    const content = fs.readFileSync(skillMd, 'utf8');
    skills.push({ name: entry, skillPath: `skills/${entry}/SKILL.md`, content });
  }
  return skills;
}

// ── Generate ──────────────────────────────────────────────────────────────────

function generate() {
  // Read plugin version
  let pluginVersion = '1.0.0';
  if (fs.existsSync(PLUGIN_JSON)) {
    try {
      pluginVersion = JSON.parse(fs.readFileSync(PLUGIN_JSON, 'utf8')).version || pluginVersion;
    } catch {}
  }

  const skills = collectSkills(SKILLS_DIR);
  const locked = {};

  for (const { name, skillPath, content } of skills) {
    const fm = parseFrontmatter(content);
    locked[name] = {
      path: skillPath,
      hash: sha256(content),
      ...(fm.description && { description: fm.description }),
      ...(fm.context && { context: fm.context }),
      ...(fm.agent && { agent: fm.agent }),
    };
  }

  const lockData = {
    version: pluginVersion,
    generated: new Date().toISOString().split('T')[0],
    skills: locked,
  };

  fs.writeFileSync(LOCK_FILE, JSON.stringify(lockData, null, 2) + '\n');

  console.log(`[dev-workflow] skills-lock.json generated (${skills.length} skills, plugin v${pluginVersion})`);
  for (const { name } of skills) {
    console.log(`  locked  ${name}`);
  }
}

// ── Verify ────────────────────────────────────────────────────────────────────

function verify() {
  if (!fs.existsSync(LOCK_FILE)) {
    console.error('Error: skills-lock.json not found. Run `node bin/lock.js` first.');
    process.exit(1);
  }

  const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
  const installedSkillsDir = path.join(process.cwd(), '.claude', 'skills');

  if (!fs.existsSync(installedSkillsDir)) {
    console.error('Error: .claude/skills/ not found. Run `npx @dev-workflow/kit init` first.');
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;
  const missing = [];

  for (const [name, entry] of Object.entries(lock.skills)) {
    const installedPath = path.join(installedSkillsDir, name, 'SKILL.md');

    if (!fs.existsSync(installedPath)) {
      missing.push(name);
      failed++;
      continue;
    }

    const content = fs.readFileSync(installedPath, 'utf8');
    const actual = sha256(content);

    if (actual === entry.hash) {
      console.log(`  ok      ${name}`);
      passed++;
    } else {
      console.log(`  CHANGED ${name}  (expected ${entry.hash.slice(0, 19)}... got ${actual.slice(0, 19)}...)`);
      failed++;
    }
  }

  if (missing.length > 0) {
    console.log('');
    console.log(`Missing skills: ${missing.join(', ')}`);
    console.log('Run `npx @dev-workflow/kit init --force` to reinstall.');
  }

  console.log('');
  if (failed === 0) {
    console.log(`[dev-workflow] All ${passed} skills match the lock. ✓`);
  } else {
    console.log(`[dev-workflow] ${failed} skill(s) differ from the lock, ${passed} ok.`);
    process.exit(1);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--verify')) {
  verify();
} else {
  generate();
}
