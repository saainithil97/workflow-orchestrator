# Learnings

This file records lessons learned from past development sessions. Agents MUST read this file before starting any new work and apply relevant learnings proactively.

Entries are ordered newest-first. Each entry includes what went well, what went wrong, and concrete action items.

---

## 2026-03-06 — dx-improvements

### What Went Well
- Wave-parallel execution plan worked cleanly: all Wave 1 tasks (10 tasks) had zero file conflicts and were completed together
- The `bin/init.js` CREATE/UPDATE bug fix was straightforward once identified — action label must be determined before the file operation modifies the filesystem state
- Creating dedicated `copyRecursiveFiltered` in init.js preserved backward compatibility for existing `copyRecursive` calls (rules/ and skills/ copy paths)

### Surprises
- `cp -r skills/status .claude/skills/status` copies the directory *into* the target if the target already exists, creating a nested `status/status/` structure. Always use `cp -r skills/status/. .claude/skills/status/` or `cp -r skills/status/* .claude/skills/status/` when the target dir already exists.
- The `scaffold/.dev-workflow/preferences.yml` was identical to `.dev-workflow/preferences.yml` and needed the same changes — always update both files in sync.

### Action Items
- [ ] When using `cp -r src dest` and `dest` already exists, the copy nests inside — use `cp -r src/. dest/` pattern or `mkdir -p dest && cp -r src/. dest/`

<!-- Entries will be added here by the /retro command. Example format:

## 2026-02-23 — user-authentication

### What Went Well
- TDD cycle caught an edge case in email validation early
- Observability setup was straightforward with the OTel SDK

### What Went Wrong
- Forgot to add rate limiting to the login endpoint
  - **Root cause**: Not captured in the requirement's security section
  - **Prevention**: Always ask about rate limiting for auth endpoints during requirement gathering

### Surprises
- The existing auth middleware expects a custom header format, not standard Bearer tokens

### Developer Feedback
- "The HLD was very clear, especially the ASCII diagrams"
- "The review was too focused on style nitpicks — prioritize functional issues"

### Action Items
- [ ] Add rate limiting to the requirement template checklist
- [ ] Reduce nitpick verbosity in reviews

### Agent Mistakes
- Generated tests that depended on system time, causing flakiness
  - **Impact**: Tests passed locally but failed in CI
  - **Correction**: Always use clock injection / time mocking for time-dependent tests
-->
