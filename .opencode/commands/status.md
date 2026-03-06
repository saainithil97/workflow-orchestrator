---
description: Show pipeline status for a feature — which stages are complete, in-progress, or pending. Read-only.
---

Show pipeline status for: $ARGUMENTS

## No Gate Check — read-only, always allowed.

## Instructions

1. Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline:
   - Read `workflow.pipeline.preset` (default: `standard`)
   - Presets: `minimal` (requirement, lld, implement, review), `standard` (+ hld, docs, retro), `full` (+ observe, staging)
   - Apply per-stage overrides from `workflow.pipeline.<stage>: true|false`
   - Mandatory stages always enabled: requirement, lld, implement, review

## If No Feature Name

If `$ARGUMENTS` is empty, scan `docs/requirements/`, `docs/hld/`, `docs/lld/` for all `.md` files. List each unique feature name. Suggest `/status <feature-name>` for details.

## Stage Status Check

Check each enabled stage:

| Stage | Document | Complete when |
|-------|----------|---------------|
| requirement | `docs/requirements/$ARGUMENTS.md` | `status: approved\|complete` |
| hld | `docs/hld/$ARGUMENTS.md` | `status: approved\|complete` |
| lld | `docs/lld/$ARGUMENTS.md` | `status: approved\|complete` |
| implement | LLD `tasks` frontmatter | all tasks `status: complete` |
| review | LLD `review` frontmatter | `review.status: pass\|pass-with-warnings` |
| observe | LLD `observability` frontmatter | `observability.status: complete` |
| staging | LLD `staging` frontmatter | `staging.status: pass` |
| docs | LLD `docs_synced` marker | marker present |
| retro | `.dev-workflow/learnings/LEARNINGS.md` | dated entry mentions `$ARGUMENTS` |

Disabled stages → `skipped`.

## Output Format

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

Read-only. Does not modify any files.
