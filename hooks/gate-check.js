#!/usr/bin/env node

/**
 * Pre-push gate check hook.
 *
 * Scans docs/ for the most recent review document and verifies its
 * YAML frontmatter shows `status: passed` before allowing push.
 *
 * Enforcement level is read from .dev-workflow/preferences.yml:
 *   workflow.enforcement: warn   (default) — prints warning, exits 0
 *   workflow.enforcement: strict             — prints error, exits 1 (blocks push)
 */

const fs = require('fs');
const path = require('path');

const PREFERENCES_PATH = path.resolve(process.cwd(), '.dev-workflow/preferences.yml');
const DOCS_DIR = path.resolve(process.cwd(), 'docs');

// ── Helpers ──────────────────────────────────────────────────────────────────

function readPreferences() {
  try {
    const content = fs.readFileSync(PREFERENCES_PATH, 'utf8');
    // Simple YAML parser for the one field we need
    const match = content.match(/^\s*enforcement:\s*(warn|strict)\s*$/m);
    return match ? match[1] : 'warn';
  } catch {
    return 'warn'; // default
  }
}

function findReviewDocs() {
  const reviewDir = path.join(DOCS_DIR, 'requirements');
  const dirs = ['requirements', 'hld', 'lld'];
  const reviewFiles = [];

  // Look for any markdown files in docs/ subdirectories that contain review status
  for (const dir of fs.readdirSync(DOCS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const dirPath = path.join(DOCS_DIR, dir.name);
    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith('.md')) continue;
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      // Check if this file has a review_status in frontmatter
      if (content.match(/^---[\s\S]*?review_status:/m)) {
        reviewFiles.push({ path: filePath, content });
      }
    }
  }
  return reviewFiles;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result = {};
  // Simple key extraction
  for (const line of yaml.split('\n')) {
    const kv = line.match(/^(\w[\w.]*?):\s*(.+)$/);
    if (kv) result[kv[1]] = kv[2].trim();
  }
  return result;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const enforcement = readPreferences();

  // Find all docs with review_status frontmatter
  let reviewDocs;
  try {
    reviewDocs = findReviewDocs();
  } catch {
    // If docs/ doesn't exist yet, nothing to check
    process.exit(0);
  }

  if (reviewDocs.length === 0) {
    // No review documents found — nothing to enforce
    process.exit(0);
  }

  const failures = [];

  for (const doc of reviewDocs) {
    const fm = extractFrontmatter(doc.content);
    if (fm.review_status && fm.review_status !== 'passed') {
      failures.push({
        file: path.relative(process.cwd(), doc.path),
        status: fm.review_status
      });
    }
  }

  if (failures.length === 0) {
    console.log('[dev-workflow] All review gates passed.');
    process.exit(0);
  }

  const icon = enforcement === 'strict' ? 'ERROR' : 'WARNING';
  console.log(`\n[dev-workflow] ${icon}: Review gate check failed.\n`);
  for (const f of failures) {
    console.log(`  ${f.file} — review_status: ${f.status}`);
  }
  console.log('');

  if (enforcement === 'strict') {
    console.log('[dev-workflow] Push blocked. Run /dev-workflow:review to complete the review stage.');
    console.log('[dev-workflow] To override, set workflow.enforcement: warn in .dev-workflow/preferences.yml\n');
    process.exit(1);
  } else {
    console.log('[dev-workflow] Push allowed (enforcement: warn). Consider running /dev-workflow:review first.');
    console.log('[dev-workflow] To block pushes without review, set workflow.enforcement: strict in .dev-workflow/preferences.yml\n');
    process.exit(0);
  }
}

main();
