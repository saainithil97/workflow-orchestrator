/**
 * OpenCode Runtime Plugin — Workflow Enforcer
 *
 * Optional plugin that hooks into OpenCode's runtime event system to enforce
 * the dev-workflow gate checks during an active session.
 *
 * Install (one of):
 *   1. Copy this file to .opencode/plugins/workflow-enforcer.js
 *   2. In your project: npm link @dev-workflow/kit (after running npm link in this repo)
 *      Then add to opencode.json: "plugin": ["@dev-workflow/kit/plugin/workflow-enforcer"]
 *   3. Absolute path in opencode.json: "plugin": ["/path/to/dev-workflow-kit/plugin/workflow-enforcer"]
 *
 * What it does:
 *   - On tool.execute.before: If the agent tries to write implementation code
 *     without an approved LLD, it injects a warning or blocks the write.
 *   - On session.idle: Warns if explore journals are stale (state.yml newer than journal.md).
 *   - On session.idle: Suggests running /retro if substantial work was done.
 */

const fs = require('fs');
const path = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([\w.]+):\s*(.+)$/);
    if (kv) result[kv[1]] = kv[2].trim();
  }
  return result;
}

function readEnforcement(directory) {
  try {
    const content = fs.readFileSync(path.join(directory, '.dev-workflow/preferences.yml'), 'utf8');
    const match = content.match(/^\s*enforcement:\s*(warn|strict)\s*$/m);
    return match?.[1] ?? 'warn';
  } catch {
    return 'warn';
  }
}

function isGatePassed(directory, docType) {
  const docsDir = path.join(directory, 'docs', docType);
  try {
    const files = fs.readdirSync(docsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        mtime: fs.statSync(path.join(docsDir, f)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length === 0) return false;

    const fm = extractFrontmatter(fs.readFileSync(path.join(docsDir, files[0].name), 'utf8'));
    const statusOk = fm.status === 'approved' || fm.status === 'complete' || fm.status === 'passed';
    const percentageOk = fm['completion.percentage'] === '100';
    const blockersOk = !fm['completion.blockers'] || fm['completion.blockers'] === '[]';
    return statusOk && percentageOk && blockersOk;
  } catch {
    return false;
  }
}

function hasRecentDocsWork(directory) {
  const docsDir = path.join(directory, 'docs');
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  try {
    for (const subdir of fs.readdirSync(docsDir, { withFileTypes: true })) {
      if (!subdir.isDirectory()) continue;
      for (const file of fs.readdirSync(path.join(docsDir, subdir.name))) {
        if (!file.endsWith('.md')) continue;
        if (now - fs.statSync(path.join(docsDir, subdir.name, file)).mtimeMs < oneHour) {
          return true;
        }
      }
    }
  } catch { /* docs/ may not exist */ }
  return false;
}

function findExploreSessionsWithStaleJournals(directory) {
  const learnDir = path.join(directory, '.learn', 'topics');
  const stale = [];
  const oneDayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  try {
    for (const entry of fs.readdirSync(learnDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const stateFile = path.join(learnDir, entry.name, 'state.yml');
      const journalFile = path.join(learnDir, entry.name, 'journal.md');
      try {
        const stateMtime = fs.statSync(stateFile).mtimeMs;
        // Only consider sessions active in the last 24 hours
        if (now - stateMtime > oneDayMs) continue;
        // Journal is stale if it hasn't been written since the last state update
        let journalMtime = 0;
        try { journalMtime = fs.statSync(journalFile).mtimeMs; } catch { /* no journal yet */ }
        if (journalMtime < stateMtime) {
          stale.push(entry.name);
        }
      } catch { /* skip unreadable entries */ }
    }
  } catch { /* .learn/topics/ may not exist */ }
  return stale;
}

// ── Plugin ───────────────────────────────────────────────────────────────────

module.exports = async ({ directory, client }) => {
  return {
    // ── Gate check: warn/block writes to implementation code without approved LLD ──
    'tool.execute.before': async (input, output) => {
      // Only check file-write tools
      const writeTools = ['write', 'edit', 'Write', 'Edit'];
      if (!writeTools.includes(input.tool)) return;

      // Only check writes to implementation directories
      const targetPath = output.args?.filePath ?? output.args?.file_path ?? '';
      const implDirs = ['/src/', '/lib/', '/app/', '/pkg/', '/internal/'];
      if (!implDirs.some(d => targetPath.includes(d))) return;

      // Check: does an approved LLD exist?
      if (!isGatePassed(directory, 'lld')) {
        const enforcement = readEnforcement(directory);
        const msg =
          '[dev-workflow] No approved LLD found. The workflow requires an LLD with ' +
          'status: approved, completion.percentage: 100, and no blockers before ' +
          'implementation begins.';

        if (enforcement === 'strict') {
          throw new Error(`BLOCKED: ${msg}\nRun /lld <name> to create the LLD first.`);
        }
        // For warn mode, log but allow
        await client.app.log({
          body: {
            service: 'dev-workflow',
            level: 'warn',
            message: msg,
          },
        });
      }
    },

    // ── Session idle: remind to flush explore journals + suggest retro ──
    event: async ({ event }) => {
      if (event.type !== 'session.idle') return;

      const staleSessions = findExploreSessionsWithStaleJournals(directory);
      if (staleSessions.length > 0) {
        await client.app.log({
          body: {
            service: 'dev-workflow',
            level: 'warn',
            message:
              `[dev-workflow] Explore journal not yet written for: ${staleSessions.join(', ')}. ` +
              'Before ending, append today\'s entry to .learn/topics/<topic>/journal.md ' +
              '(focus, did, gap, decision, next).',
          },
        });
      }

      if (hasRecentDocsWork(directory)) {
        await client.app.log({
          body: {
            service: 'dev-workflow',
            level: 'info',
            message: '[dev-workflow] You have recent work in docs/. Consider running /retro to capture learnings.',
          },
        });
      }
    },
  };
};
