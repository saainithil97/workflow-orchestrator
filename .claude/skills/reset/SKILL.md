---
name: reset
description: Manually fix pipeline state — mark stages complete, reset tasks to pending, or repair malformed frontmatter.
argument-hint: "[feature-name] [stage|task] [options]"
---

# Pipeline Reset

## Purpose

Manually fix pipeline state when documents get out of sync with reality. Supports marking stages complete, resetting tasks, and repairing malformed frontmatter. Always shows a diff before writing.

## Supported Operations

### 1. Mark Stage Complete

Command: `/reset <feature> <stage> --complete`

Example: `/reset user-auth lld --complete`

Steps:
1. Read the stage document at its standard path
2. Show what will change:
   - `status` → `complete`
   - `completion.percentage` → `100`
   - `completion.blockers` → `[]`
   - All checklist items `done` → `true`
3. Ask for confirmation before writing
4. Apply changes and confirm what changed

### 2. Reset Stage to Draft

Command: `/reset <feature> <stage> --draft`

Example: `/reset user-auth review --draft`

Steps:
1. Read the stage document
2. Show what will change:
   - `status` → `draft`
   - Remove the `review:` frontmatter block (if stage is `review`)
3. Ask for confirmation before writing
4. Apply changes and confirm

### 3. Reset Specific Task to Pending

Command: `/reset <feature> task <N> --pending`

Example: `/reset user-auth task 3 --pending`

Steps:
1. Read `docs/lld/<feature>.md`
2. In frontmatter `tasks`, find task with `id: N`
3. Show what will change:
   - Task `status` → `pending`
   - Task `tests_passing` → `false`
   - Recalculated `completion.percentage`
4. Also find the task section in the document body (e.g., `### Task 3:`) and update its `- **Status**: complete` line to `- **Status**: pending`
5. Ask for confirmation before writing
6. Apply changes and confirm

### 4. Reset All Tasks to Pending

Command: `/reset <feature> tasks --all-pending`

Steps:
1. Read `docs/lld/<feature>.md`
2. Show what will change:
   - All tasks `status` → `pending`, `tests_passing` → `false`
   - `completion.percentage` → `0`
3. Ask for confirmation before writing
4. Apply changes and confirm

### 5. Repair Frontmatter

Command: `/reset <feature> --repair`

Steps:
1. Read all stage documents for this feature
2. For each document, attempt to parse the YAML frontmatter
3. Detect issues:
   - Parse errors (malformed YAML)
   - Missing required fields (`feature`, `stage`, `status`, `completion`)
   - Invalid values (e.g., `percentage` out of range)
4. For each issue found, add the missing field with a safe default:
   - `status` → `draft`
   - `completion.percentage` → calculated from checklist items or `0`
   - `completion.blockers` → `[]`
5. Show the full diff of what will change
6. Ask for confirmation before writing
7. Report what was added/fixed

## Safety Rules

- Always print a diff of what will change **before** writing
- Always ask for confirmation — do not auto-apply
- Never delete user content — only update frontmatter fields and status lines in the body
- Never modify test code or implementation code

## Output

Confirmation of what changed. Resulting document passes gate check for the affected stage.
