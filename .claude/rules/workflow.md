# Development Workflow — Pipeline & Gating Rules

## Pipeline Stages

The default pipeline is sequential. The active set of stages is controlled by `workflow.pipeline` in `.dev-workflow/preferences.yml` and optional per-feature `pipeline_overrides` in the requirement doc.

```
1. /requirement  →  docs/requirements/<feature>.md   [MANDATORY]
2. /hld          →  docs/hld/<feature>.md
3. /lld          →  docs/lld/<feature>.md             [MANDATORY]
4. /implement    →  updates code + checks off tasks   [MANDATORY]
5. /review       →  appends review findings to LLD    [MANDATORY]
6. /observe      →  OTel instrumentation (standalone or pipeline)
7. /staging      →  integration tests against staging
8. /docs         →  updates README, API docs, runbooks
9. /retro        →  updates .dev-workflow/learnings/
```

Mandatory stages (`requirement`, `lld`, `implement`, `review`) cannot be disabled. All other stages are configurable.

## Reading Pipeline Configuration

Before starting any stage that might be skipped, read the effective pipeline:

1. Read `workflow.pipeline.preset` from `.dev-workflow/preferences.yml` (default: `standard`).
2. Resolve the preset to its stage list:
   - `minimal`: requirement, lld, implement, review
   - `standard`: requirement, hld, lld, implement, review, docs, retro
   - `full`: requirement, hld, lld, implement, review, observe, staging, docs, retro
3. Apply any `workflow.pipeline.<stage>: true|false` overrides from preferences (overrides beat the preset).
4. If a feature name is given, also check `pipeline_overrides` in `docs/requirements/<feature>.md` frontmatter — these beat project-level overrides.
5. Mandatory stages are always enabled regardless of any setting.

## Skipped Stage Resolution

When a stage is skipped, the next stage gates on the nearest enabled predecessor:

- If `/hld` is skipped, `/lld` gates on the **requirement** doc instead of the hld doc.
- If `/observe` is skipped, `/staging` proceeds without an observability pre-check.
- If `/staging` is skipped, `/docs` gates on review pass (same as if staging had not run).

**Rule**: Gate on the nearest enabled predecessor. Never gate on a skipped stage.

## Gate Check Protocol

Before starting any stage, run the gate check:

### Step 1: Locate the prerequisite document

| Current Stage | Normal Gate Document | Required Condition |
|--------------|----------------------|--------------------|
| `/hld` | `docs/requirements/<feature>.md` | `status: approved\|complete` |
| `/lld` | `docs/hld/<feature>.md` (or requirement if hld skipped) | `status: approved\|complete` |
| `/implement` | `docs/lld/<feature>.md` | `status: approved\|complete` |
| `/review` | `docs/lld/<feature>.md` | All tasks `status: complete` AND `tests_passing: true` |
| `/observe` | `docs/lld/<feature>.md` | `review.status: pass\|pass-with-warnings` AND `review.critical_issues: 0` |
| `/staging` | `docs/lld/<feature>.md` | `review.status: pass\|pass-with-warnings` AND `review.critical_issues: 0` |
| `/docs` | `docs/lld/<feature>.md` | `review.status: pass\|pass-with-warnings`; if staging ran, also `staging.status: pass` |
| `/retro` | None | No gate — always allowed |

### Step 2: Parse YAML frontmatter

Check ALL of these conditions on the prerequisite document:

```yaml
# ALL must be true:
status: approved | complete          # document has been approved
completion:
  percentage: 100                    # all checklist items are done
  blockers: []                       # no unresolved blockers
```

### Step 3: If gate check fails

1. Print which conditions failed and why
2. List the specific incomplete checklist items or unresolved blockers
3. REFUSE to proceed — do not start the next stage
4. Suggest what needs to be done to unblock

## Completion Marker Schema

Every design document MUST use this YAML frontmatter schema:

```yaml
---
feature: <kebab-case-feature-name>
stage: requirement | hld | lld | implement | review | docs
status: draft | in-review | approved | complete
version: 1
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
author: <name>
approver: <name or "pending">
depends_on: []
completion:
  checklist:
    - item: "<description>"
      done: true | false
  percentage: <0-100>
  blockers: []
---
```

`completion.percentage` = (items where `done: true`) / (total items) × 100, rounded to nearest integer. Recalculate whenever any checklist item changes.

For implementation task tracking, review tracking, and staging tracking schemas, see `.dev-workflow/references/workflow-schemas.md`.

## Preferences Protocol

Before starting ANY stage, check `.dev-workflow/preferences.yml`. If a preference needed for the current stage is missing:

1. Ask the developer directly
2. Provide a recommendation with rationale
3. Accept their answer (even if different from recommendation)
4. Save to `.dev-workflow/preferences.yml`
5. Continue with their choice

## Learnings Protocol

Before starting ANY stage:
1. Read `.dev-workflow/learnings/LEARNINGS.md` (skip if file does not exist)
2. Check for relevant entries from past sessions
3. Apply relevant learnings proactively
4. After completing the stage, note any new learnings
