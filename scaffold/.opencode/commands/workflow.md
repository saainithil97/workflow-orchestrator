---
description: Run the full development pipeline end-to-end (requirement → hld → lld → implement → review → staging → docs → retro)
---

Run the complete development workflow for feature: $ARGUMENTS

## Before Starting

1. Check `.dev-workflow/preferences.yml` — if empty, run `/preferences` first
2. Read `.dev-workflow/learnings/LEARNINGS.md`

## Pipeline

Execute stages sequentially. Pause for developer approval at marked points.

### 1. /requirement $ARGUMENTS
**PAUSE**: Present requirement doc. Ask for approval. Proceed only when `status: approved`.

### 2. /hld $ARGUMENTS
**PAUSE**: Present HLD. Ask for approval. Proceed only when `status: approved`.

### 3. /lld $ARGUMENTS
**PAUSE**: Present LLD. Ask for approval. Proceed only when `status: approved`.

### 4. /implement $ARGUMENTS
Run all tasks via TDD. No pause between tasks. Stop if a task fails.

### 5. /review $ARGUMENTS
**PAUSE if fail**: Present critical issues. Ask: fix and re-review, or override?

### 6. /staging $ARGUMENTS
**SKIP** if no staging_url in preferences. **PAUSE if fail**: ask for direction.

### 7. /docs $ARGUMENTS
Update all documentation. No pause needed.

### 8. /retro $ARGUMENTS
Capture learnings and feedback. Always final.

## Error Recovery

If any stage fails: stop, report, suggest remediation. Developer can fix and re-run the specific stage. Pipeline resumes from failed stage (does not restart).

## Output

Fully implemented, reviewed, tested, documented feature ready for `git commit`.
