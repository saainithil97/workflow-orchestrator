---
name: status
description: Show pipeline status for a feature — which stages are complete, in-progress, or pending. Read-only.
argument-hint: "[feature-name]"
---

# Pipeline Status

## Purpose

Show the current pipeline state for a feature — which stages are complete, which are in-progress, and what comes next. Read-only.

## Process

### Step 1: Read Preferences and Resolve Pipeline

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline:
1. Read `workflow.pipeline.preset` (default: `standard`)
2. Apply preset stages:
   - `minimal`: requirement, lld, implement, review
   - `standard`: requirement, hld, lld, implement, review, docs, retro
   - `full`: requirement, hld, lld, implement, review, observe, staging, docs, retro
3. Apply per-stage overrides from `workflow.pipeline.<stage>: true|false`
4. Mandatory stages (requirement, lld, implement, review) are always enabled

### Step 2: If No Feature Name Provided

If `$ARGUMENTS` is empty, list all features that have at least one document in `docs/`:
- Scan `docs/requirements/`, `docs/hld/`, `docs/lld/` for `.md` files
- List each unique feature name found
- Suggest running `/status <feature-name>` for details

### Step 3: Check Feature Pipeline_overrides

If `docs/requirements/$ARGUMENTS.md` exists, read it and apply any `pipeline_overrides` in its frontmatter — these beat project-level settings.

### Step 4: Check Stage Status

For each enabled stage in the effective pipeline, determine status:

| Stage | Document | Status Logic |
|-------|----------|--------------|
| requirement | `docs/requirements/$ARGUMENTS.md` | complete if `status: approved\|complete` |
| hld | `docs/hld/$ARGUMENTS.md` | complete if `status: approved\|complete` |
| lld | `docs/lld/$ARGUMENTS.md` | complete if `status: approved\|complete` |
| implement | LLD frontmatter `tasks` | complete if all tasks `complete`; in-progress if any `complete`; pending if none; show X/Y tasks |
| review | LLD frontmatter `review` | complete if `review.status: pass\|pass-with-warnings` |
| observe | LLD frontmatter `observability` | complete if `observability.status: complete` |
| staging | LLD frontmatter `staging` | complete if `staging.status: pass` |
| docs | LLD frontmatter or `docs_synced` marker | complete if present |
| retro | `.dev-workflow/learnings/LEARNINGS.md` | complete if dated entry contains `$ARGUMENTS` |

For disabled stages, mark as `skipped`.

### Step 5: Determine Current Stage and Next Command

- Find the first stage that is not `complete` or `skipped`
- That is the current/next stage
- Print the suggested next command

### Step 6: Render Status Table

Print the status table:

```
Pipeline status for '$ARGUMENTS':

  ✓ requirement  | approved     | docs/requirements/$ARGUMENTS.md
  ✓ hld          | approved     | docs/hld/$ARGUMENTS.md
  ✓ lld          | approved     | docs/lld/$ARGUMENTS.md         | 6 tasks
  → implement    | in-progress  | docs/lld/$ARGUMENTS.md         | 3/6 tasks (50%)
  ○ review       | pending      |
  ○ docs         | pending      |
  ○ retro        | pending      |
  ✗ observe      | skipped      | (disabled in pipeline)
  ✗ staging      | skipped      | (disabled in pipeline)

Next: /implement $ARGUMENTS  (3 tasks remaining)
```

Legend: ✓ complete, → in-progress, ○ pending, ✗ skipped

## Output

Read-only status report. Does not modify any files.
