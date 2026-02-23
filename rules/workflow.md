# Development Workflow — Pipeline & Gating Rules

## Pipeline Stages

The development workflow is a strict, sequential pipeline. Each stage produces a document in `docs/` with YAML frontmatter that tracks completion status.

```
1. /requirement  →  docs/requirements/<feature>.md
2. /hld          →  docs/hld/<feature>.md
3. /lld          →  docs/lld/<feature>.md
4. /implement    →  updates code + checks off tasks in LLD
5. /review       →  appends review findings to LLD
6. /staging      →  runs integration tests against staging
7. /docs         →  updates README, API docs, runbooks, dashboards
8. /retro        →  updates .dev-workflow/learnings/
```

## Gate Check Protocol

Before starting any stage, the agent MUST run the following gate check:

### Step 1: Locate the prerequisite document

| Current Stage | Required Document | Required Status |
|--------------|-------------------|----------------|
| `/hld` | `docs/requirements/<feature>.md` | `status: approved` or `status: complete` |
| `/lld` | `docs/hld/<feature>.md` | `status: approved` or `status: complete` |
| `/implement` | `docs/lld/<feature>.md` | `status: approved` or `status: complete` |
| `/review` | `docs/lld/<feature>.md` | All tasks `status: complete` and `tests_passing: true` |
| `/staging` | `docs/lld/<feature>.md` | `review.status: pass` or `review.status: pass-with-warnings` AND `review.critical_issues: 0` |
| `/docs` | `docs/lld/<feature>.md` | `review.status: pass` or `review.status: pass-with-warnings` |
| `/retro` | None | No gate — always allowed |

### Step 2: Parse YAML frontmatter

Read the prerequisite document and parse its YAML frontmatter. Check ALL of these conditions:

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

### Percentage Calculation

`completion.percentage` = (number of items where `done: true`) / (total items) * 100, rounded to nearest integer.

The agent MUST recalculate this value whenever it updates any checklist item.

## Implementation Task Tracking

The LLD document contains the task checklist. Each task is tracked in both the YAML frontmatter and the document body:

### Frontmatter Task Schema

```yaml
tasks:
  - id: 1
    description: "<what to build>"
    files: ["<file paths>"]
    depends_on: []
    status: pending | in-progress | complete | blocked
    tests_passing: false | true
    reviewed: false | true
```

### Body Task Format

```markdown
### Task 1: <Description>
- **Status**: pending | in-progress | complete | blocked
- **Files**: `path/to/file.ts`, `path/to/file.test.ts`
- **Depends on**: None | Task N
- **Test approach**: <how this task will be tested>
- **Acceptance**: <what "done" looks like>
- **Details**: <implementation specifics>
```

When a task is completed, update BOTH the frontmatter and body simultaneously.

## Review Tracking

After `/review` completes, it appends a review section to the LLD frontmatter:

```yaml
review:
  status: pass | pass-with-warnings | fail
  critical_issues: <count>
  warnings: <count>
  suggestions: <count>
  reviewed_by: <agent-name>
  reviewed_at: <YYYY-MM-DD>
  dimensions_checked:
    - correctness
    - security
    - error-handling
    - readability
    - performance
```

## Staging Tracking

After `/staging` completes, it appends staging results:

```yaml
staging:
  status: pass | fail
  environment: <staging URL>
  tests_run: <count>
  tests_passed: <count>
  tests_failed: <count>
  otel_validated: true | false
  dashboards_validated: true | false
  tested_at: <YYYY-MM-DD>
```

## Preferences Protocol

Before starting ANY stage, check `.dev-workflow/preferences.yml`. If a preference needed for the current stage is missing:

1. Ask the developer directly
2. Provide a recommendation with rationale
3. Accept their answer (even if different from recommendation)
4. Save to `.dev-workflow/preferences.yml`
5. Continue with their choice

## Learnings Protocol

Before starting ANY stage:
1. Read `.dev-workflow/learnings/LEARNINGS.md`
2. Check for relevant entries from past sessions
3. Apply relevant learnings proactively (e.g., "last time we forgot to add error handling for the X edge case")
4. After completing the stage, note any new learnings

## Feature Naming Convention

Feature names use kebab-case: `user-authentication`, `payment-processing`, `search-api`.

All documents for a feature share the same name: `docs/requirements/user-authentication.md`, `docs/hld/user-authentication.md`, `docs/lld/user-authentication.md`.
