---
description: Manually fix pipeline state — mark stages complete, reset tasks to pending, or repair malformed frontmatter.
---

Fix pipeline state for: $ARGUMENTS

Usage: `/reset <feature> [stage|task] [options]`

## No Gate Check — repair tool, always allowed.

## Supported Operations

### 1. Mark stage complete
`/reset <feature> <stage> --complete`
- Sets `status: complete`, `completion.percentage: 100`, `completion.blockers: []`, all checklist `done: true`

### 2. Reset stage to draft
`/reset <feature> <stage> --draft`
- Sets `status: draft`, removes `review:` block (for review stage)

### 3. Reset specific task to pending
`/reset <feature> task <N> --pending`
- In `docs/lld/<feature>.md`: sets task N `status: pending`, `tests_passing: false`
- Recalculates `completion.percentage`
- Updates task body status line too

### 4. Reset all tasks to pending
`/reset <feature> tasks --all-pending`
- All tasks `status: pending`, `tests_passing: false`, `completion.percentage: 0`

### 5. Repair frontmatter
`/reset <feature> --repair`
- Detect parse errors and missing required fields in all stage documents
- Add missing fields with safe defaults
- Report what was added/fixed

## Safety

- Always print a diff before writing
- Always ask for confirmation
- Never delete user content — only update frontmatter and status lines
- Never modify code files

## Output

Confirmation of what changed. Resulting document passes gate check for the affected stage.
