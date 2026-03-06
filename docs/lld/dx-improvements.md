---
feature: dx-improvements
stage: lld
status: complete
version: 1
created: 2026-03-06
updated: 2026-03-06
author: session
approver: developer
depends_on: [dx-improvements-requirement]
completion:
  checklist:
    - item: "Phase 1 — OpenCode implementer agent fix"
      done: true
    - item: "Phase 1 — OpenCode commands: pipeline skip checks for optional stages"
      done: true
    - item: "Phase 1 — OpenCode LLD command: HLD-skipped gate fallback"
      done: true
    - item: "Phase 1 — OpenCode workflow command: pipeline-aware execution"
      done: true
    - item: "Phase 2 — preferences.yml: uncomment essential defaults"
      done: true
    - item: "Phase 2 — preamble: defer non-essential preferences on first run"
      done: true
    - item: "Phase 2 — /preferences skill: add quick-start mode"
      done: true
    - item: "Phase 3 — /status skill"
      done: true
    - item: "Phase 4 — /reset skill"
      done: true
    - item: "Phase 5 — bin/init.js: fix CREATE/UPDATE label + platform flags"
      done: true
    - item: "Phase 6 — progress feedback in /implement and /workflow"
      done: true
    - item: "Phase 7 — language-agnostic templates"
      done: true
    - item: "Sync all source dirs and update command tables"
      done: true
  percentage: 100
  blockers: []

tasks:
  - id: 1
    description: "Fix OpenCode implementer agent — remove LLD update, return results to orchestrator"
    files:
      - .opencode/agents/implementer.md
      - scaffold/.opencode/agents/implementer.md
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 2
    description: "Fix OpenCode optional-stage commands — add pipeline skip checks (hld, observe, staging, docs, retro)"
    files:
      - .opencode/commands/hld.md
      - .opencode/commands/observe.md
      - .opencode/commands/staging.md
      - .opencode/commands/docs.md
      - .opencode/commands/retro.md
      - scaffold/.opencode/commands/hld.md
      - scaffold/.opencode/commands/observe.md
      - scaffold/.opencode/commands/staging.md
      - scaffold/.opencode/commands/docs.md
      - scaffold/.opencode/commands/retro.md
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 3
    description: "Fix OpenCode lld command — gate on requirement doc when HLD is skipped"
    files:
      - .opencode/commands/lld.md
      - scaffold/.opencode/commands/lld.md
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 4
    description: "Fix OpenCode workflow command — resolve effective pipeline, skip disabled stages, support parallel groups"
    files:
      - .opencode/commands/workflow.md
      - scaffold/.opencode/commands/workflow.md
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 5
    description: "Fix OpenCode review commands — load code-quality and review-dimensions references"
    files:
      - .opencode/commands/review.md
      - .opencode/commands/review-extended.md
      - scaffold/.opencode/commands/review.md
      - scaffold/.opencode/commands/review-extended.md
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 6
    description: "Uncomment essential defaults in preferences.yml"
    files:
      - .dev-workflow/preferences.yml
      - scaffold/.dev-workflow/preferences.yml
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 7
    description: "Update preamble — defer non-essential preferences on first run"
    files:
      - .claude/rules/preamble.md
      - rules/preamble.md
    depends_on: [6]
    status: complete
    tests_passing: true
    reviewed: false

  - id: 8
    description: "Add quick-start mode to /preferences skill"
    files:
      - .claude/skills/preferences/SKILL.md
      - skills/preferences/SKILL.md
      - .opencode/commands/preferences.md
      - scaffold/.opencode/commands/preferences.md
    depends_on: [6]
    status: complete
    tests_passing: true
    reviewed: false

  - id: 9
    description: "Create /status skill and OpenCode command"
    files:
      - .claude/skills/status/SKILL.md
      - skills/status/SKILL.md
      - .opencode/commands/status.md
      - scaffold/.opencode/commands/status.md
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 10
    description: "Create /reset skill and OpenCode command"
    files:
      - .claude/skills/reset/SKILL.md
      - skills/reset/SKILL.md
      - .opencode/commands/reset.md
      - scaffold/.opencode/commands/reset.md
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 11
    description: "Fix bin/init.js — CREATE/UPDATE label bug and --claude-only / --opencode-only flags"
    files:
      - bin/init.js
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 12
    description: "Add wave and stage progress feedback to /implement and /workflow"
    files:
      - .claude/skills/implement/SKILL.md
      - skills/implement/SKILL.md
      - .claude/skills/workflow/SKILL.md
      - skills/workflow/SKILL.md
      - .opencode/commands/implement.md
      - scaffold/.opencode/commands/implement.md
      - .opencode/commands/workflow.md
      - scaffold/.opencode/commands/workflow.md
    depends_on: [4]
    status: complete
    tests_passing: true
    reviewed: false

  - id: 13
    description: "Make LLD and dashboard templates language/platform-agnostic"
    files:
      - .dev-workflow/templates/lld.md
      - scaffold/.dev-workflow/templates/lld.md
      - .dev-workflow/templates/dashboard.yml
      - scaffold/.dev-workflow/templates/dashboard.yml
    depends_on: []
    status: complete
    tests_passing: true
    reviewed: false

  - id: 14
    description: "Update command tables (AGENTS.md, CLAUDE.md, templates) with /status and /reset"
    files:
      - AGENTS.md
      - CLAUDE.md
      - README.md
      - .dev-workflow/templates/agents-md.md
      - .dev-workflow/templates/claude-md.md
    depends_on: [9, 10]
    status: complete
    tests_passing: true
    reviewed: false
---

# LLD — DX Improvements

## Overview

14 tasks across 7 phases. Tasks 1–5 (Phase 1) and 9–11, 13 (Phases 3, 4, 5, 7) have no inter-dependencies and can run in parallel. Tasks 7 and 8 depend on Task 6. Task 12 depends on Task 4. Task 14 depends on Tasks 9 and 10.

## Execution Wave Plan

```
Wave 1 (parallel): Tasks 1, 2, 3, 4, 5, 6, 9, 10, 11, 13
Wave 2 (parallel): Tasks 7, 8, 12  (depend on 6 or 4)
Wave 3 (sequential): Task 14       (depends on 9, 10)
```

---

## Phase 1 — OpenCode Consistency

### Task 1: Fix OpenCode implementer agent

**Files**: `.opencode/agents/implementer.md`, `scaffold/.opencode/agents/implementer.md`

The current Complete step in the OpenCode implementer says "Update LLD task status." This contradicts the Claude Code agent and the orchestrator model. Fix: replace with "Return results to orchestrator. Do NOT update the LLD directly."

**Acceptance**: The Complete/Return section says the agent returns task ID, status, files written, summary, and issues — and explicitly does NOT update the LLD.

---

### Task 2: Fix OpenCode optional-stage commands — pipeline skip checks

**Files**: 5 command files × 2 (command + scaffold)

Each of these commands (hld, observe, staging, docs, retro) needs a Pipeline Skip Check section matching what the Claude Code skill has. Pattern for each:

```markdown
## Pipeline Skip Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md`.

If `<stage>` is **disabled** in the effective pipeline:
- Print: "<Stage> stage is disabled in pipeline configuration. Skipping."
- Exit.
```

For **retro** specifically, the check must preserve the "skip only when invoked by /workflow, not directly" logic:

```markdown
If `retro` is **disabled** AND this was invoked by `/workflow`:
- Print: "Retro stage is disabled in pipeline configuration. Skipping."
- Exit.
If invoked directly by the developer (`/retro`), always run regardless of pipeline config.
```

**Acceptance**: Running any of these commands on a pipeline where the stage is disabled prints the skip message and exits. Running them directly always executes.

---

### Task 3: Fix OpenCode lld command — gate fallback

**File**: `.opencode/commands/lld.md`, `scaffold/.opencode/commands/lld.md`

Current gate check hardcodes HLD. Add logic:

```markdown
## Gate Check

Read `.dev-workflow/preferences.yml`. If `hld` is disabled in the effective pipeline, gate on `docs/requirements/$ARGUMENTS.md` instead of the HLD.

**If HLD is enabled**: Read `docs/hld/$ARGUMENTS.md`. Verify: `status: approved|complete`, `completion.percentage: 100`, `completion.blockers: []`.
**If HLD is disabled**: Read `docs/requirements/$ARGUMENTS.md`. Apply the same checks.

If not met, STOP and suggest running the appropriate prior stage.
```

**Acceptance**: On `minimal` preset (no HLD), `/lld` gates on the requirement doc and proceeds if it's approved.

---

### Task 4: Fix OpenCode workflow command — pipeline-aware execution

**File**: `.opencode/commands/workflow.md`, `scaffold/.opencode/commands/workflow.md`

Current command hardcodes all stages unconditionally. Rewrite to:

1. Resolve effective pipeline from preferences (preset + overrides + per-feature overrides)
2. Print the pipeline before starting and ask for confirmation
3. For each stage: check if enabled, skip if not, execute if yes
4. Support parallel_groups for post-review and post-validation stages
5. Use the same context-lean pattern (one-line records, discard stage output)
6. Error recovery: print partial completion on failure

This is the most complex OpenCode command fix. The result should be functionally equivalent to the Claude Code workflow skill, compressed to OpenCode command style.

**Acceptance**: On `minimal` preset, workflow runs only requirement → lld → implement → review. On `standard`, it runs the standard set. Disabled stages are skipped with a log line.

---

### Task 5: Fix OpenCode review commands — load references

**Files**: `review.md`, `review-extended.md` × 2

Add to each:
- `review.md`: "Load `.dev-workflow/references/code-quality.md`. If Tier 2/3 dimensions enabled in preferences, also load `.dev-workflow/references/review-dimensions.md`."
- `review-extended.md`: "Load both `.dev-workflow/references/code-quality.md` and `.dev-workflow/references/review-dimensions.md`."

**Acceptance**: Both commands reference the correct on-demand files matching the Claude Code skills.

---

## Phase 2 — Quick-start Preferences

### Task 6: Uncomment essential defaults in preferences.yml

**Files**: `.dev-workflow/preferences.yml`, `scaffold/.dev-workflow/preferences.yml`

Uncomment exactly these 5 defaults:

```yaml
workflow:
  pipeline:
    preset: standard          # minimal | standard | full
  branching_strategy: trunk-based
  commit_convention: conventional-commits
  enforcement: warn           # warn | strict
  max_learnings: 20
```

Everything else stays commented. These are safe universal defaults that apply to any project.

**Acceptance**: A new user who opens `preferences.yml` after `init` sees 5 working values and the rest as examples.

---

### Task 7: Update preamble — defer non-essential preferences on first run

**Files**: `.claude/rules/preamble.md`, `rules/preamble.md`

Change Step 1 to add:

```
**On first run** (detected by: all project-specific preferences are missing/commented — language, framework, test_framework are not set):
  - Load only the defaults that are already set
  - For the current stage, ask only for preferences that stage requires
  - Defer all other preferences — do not ask for OTel exporters, dashboard platforms, etc. during /requirement
  - Inform the developer: "Run /preferences for full setup. For now I'll ask only what's needed."
```

**Acceptance**: Running `/requirement` on a fresh project asks only for language + framework (required by the requirement skill), not all 41 preferences.

---

### Task 8: Add quick-start mode to /preferences skill

**Files**: `.claude/skills/preferences/SKILL.md`, `skills/preferences/SKILL.md`, `.opencode/commands/preferences.md`, `scaffold/.opencode/commands/preferences.md`

Add a new **Step 0** before the existing walkthrough:

```markdown
### Step 0: Choose Setup Mode

Ask the developer:
> "Quick start (4 essential questions, ~1 minute) or full setup (all preferences, ~10 minutes)?"

**Quick start**: Ask only:
1. Language (e.g., TypeScript, Python, Go)
2. Framework (e.g., Next.js, FastAPI, Gin)
3. Test framework (e.g., vitest, pytest, go test)
4. Pipeline preset (minimal | standard | full) — explain each option briefly

Save these values and exit. All other preferences use defaults or remain unset for later.
Print: "Quick setup complete. Run /preferences again for full configuration."

**Full setup**: Continue to Step 1 (existing walkthrough) as before.
```

**Acceptance**: `/preferences` in quick-start mode completes in 4 questions and produces a working `preferences.yml`.

---

## Phase 3 — /status command

### Task 9: Create /status skill and OpenCode command

**Files**: `.claude/skills/status/SKILL.md`, `skills/status/SKILL.md`, `.opencode/commands/status.md`, `scaffold/.opencode/commands/status.md`

#### Skill design

```
name: status
description: Show pipeline status for a feature — which stages are complete, in-progress, or pending. Read-only.
argument-hint: "[feature-name]"
context: fork
```

**Steps:**
1. Read `.dev-workflow/preferences.yml` — resolve effective pipeline (preset + overrides)
2. Check `docs/requirements/$ARGUMENTS.md` for `pipeline_overrides`
3. For each enabled stage, check if the corresponding document exists:
   - requirement → `docs/requirements/$ARGUMENTS.md`
   - hld → `docs/hld/$ARGUMENTS.md`
   - lld → `docs/lld/$ARGUMENTS.md`
   - implement → read `tasks` from LLD frontmatter
   - review → read `review` from LLD frontmatter
   - observe → read `observability` from LLD frontmatter (if exists)
   - staging → read `staging` from LLD frontmatter
   - docs → check for `docs_synced` marker in LLD or presence of updated docs
   - retro → check `.dev-workflow/learnings/LEARNINGS.md` for dated entry matching this feature
4. Render the status table
5. Print the next suggested command

**Output format:**

```
Pipeline status for 'user-auth':

  ✓ requirement  | approved     | docs/requirements/user-auth.md
  ✓ hld          | approved     | docs/hld/user-auth.md
  ✓ lld          | approved     | docs/lld/user-auth.md         | 6 tasks
  → implement    | in-progress  | docs/lld/user-auth.md         | 3/6 tasks (50%)
  ○ review       | pending      |
  ○ docs         | pending      |
  ○ retro        | pending      |
  ✗ observe      | skipped      | (disabled in pipeline)
  ✗ staging      | skipped      | (disabled in pipeline)

Next: /implement user-auth  (3 tasks remaining in Wave 2)
```

Legend: ✓ complete, → in-progress, ○ pending, ✗ skipped

If `$ARGUMENTS` is omitted, list all features that have at least one document in `docs/`.

**Acceptance**: Running `/status user-auth` on a mid-pipeline feature shows accurate per-stage status and the correct next command.

---

## Phase 4 — /reset command

### Task 10: Create /reset skill and OpenCode command

**Files**: `.claude/skills/reset/SKILL.md`, `skills/reset/SKILL.md`, `.opencode/commands/reset.md`, `scaffold/.opencode/commands/reset.md`

#### Skill design

```
name: reset
description: Manually fix pipeline state — mark stages complete, reset tasks to pending, or repair malformed frontmatter.
argument-hint: "[feature-name] [stage|task] [options]"
context: fork
```

**Supported operations:**

1. **Mark stage complete**: `/reset user-auth lld --complete`
   - Sets `status: complete`, `completion.percentage: 100`, `completion.blockers: []` in the stage doc
   - Confirms what changed

2. **Reset stage to draft**: `/reset user-auth review --draft`
   - Sets `status: draft`, removes `review:` frontmatter block

3. **Reset specific task**: `/reset user-auth task 3 --pending`
   - Sets task 3 `status: pending`, `tests_passing: false` in LLD frontmatter and body
   - Recalculates `completion.percentage`

4. **Reset all tasks**: `/reset user-auth tasks --all-pending`
   - Resets all tasks to pending

5. **Repair frontmatter**: `/reset user-auth --repair`
   - Detects malformed YAML frontmatter (parse error)
   - Adds any missing required fields with safe defaults
   - Reports what was added/fixed

**Safety:**
- Always print a diff of what will change before writing
- Ask for confirmation before writing
- Never delete user content — only updates frontmatter fields

**Acceptance**: Each operation updates the correct frontmatter fields, confirms what changed, and the resulting document passes the gate check for the affected stage.

---

## Phase 5 — Init fixes

### Task 11: Fix bin/init.js — CREATE/UPDATE label and platform flags

**File**: `bin/init.js`

**Fix 1 — CREATE/UPDATE label (line 71):**

Current code (broken):
```js
fs.copyFileSync(src, dest);
const action = fs.existsSync(dest) ? 'UPDATE' : 'CREATE';
```

Fixed:
```js
const action = fs.existsSync(dest) ? 'UPDATE' : 'CREATE';
fs.copyFileSync(src, dest);
```

**Fix 2 — Platform flags:**

Add `--claude-only` and `--opencode-only` CLI flags. When `--claude-only`:
- Skip copying `.opencode/` directories and files
- Skip `opencode.json`

When `--opencode-only`:
- Skip copying `.claude/rules/` and `.claude/skills/` directories

Update usage text to document the new flags.

**Acceptance:**
- First-time init correctly labels each file as CREATE
- `init --claude-only` produces no `.opencode/` files
- `init --opencode-only` produces no `.claude/` files

---

## Phase 6 — Progress feedback

### Task 12: Add progress feedback to /implement and /workflow

**Files**: `implement/SKILL.md` (×2), `workflow/SKILL.md` (×2), opencode mirrors (×4)

**In `/implement` SKILL.md:**

Before the fork loop in Step 3, add:
```
Print: "Starting Wave N/M — K task(s): [task names]"
```

After the after-wave block, add:
```
Print: "Wave N/M complete. X% done (Y/Z tasks total)."
```

In the failure case (suite fails):
```
Print: "Wave N/M failed — regression detected. Investigating..."
```

In Step 4 (After All Waves):
```
Print: "All waves complete. Running final coverage check..."
```

**In `/workflow` SKILL.md:**

After each stage's Record line, add a printed progress line:
```
Print: "Stage N/M (<stage-name>) complete. → Next: <next-stage-name>"
```

On pipeline failure, before error recovery:
```
Print: "Pipeline stopped at stage N/M (<stage>). Completed: [list]. Failed: <stage>."
```

In the final summary, add the total elapsed stages:
```
Print: "Pipeline complete — N/M stages ran, M skipped."
```

**Acceptance:**
- During `/implement`, the developer sees a start message before each wave and a completion message after
- During `/workflow`, the developer sees a progress line after each stage and a partial-completion summary on failure

---

## Phase 7 — Template language-agnosticism

### Task 13: Make LLD and dashboard templates language/platform-agnostic

**Files**: `lld.md` template (×2), `dashboard.yml` template (×2)

**LLD template changes:**

Replace the TypeScript interface example block with a multi-language block:

```markdown
<!-- Data model example — adjust for your project's language -->
<!-- TypeScript: -->
<!-- interface User { id: string; email: string; createdAt: Date; } -->
<!-- Python: -->
<!-- @dataclass class User: id: str; email: str; created_at: datetime -->
<!-- Go: -->
<!-- type User struct { ID string; Email string; CreatedAt time.Time } -->
```

Add a comment at the top of the Data Models section:
```
> Note: The examples below use pseudocode. Adjust for your language (see preferences.language).
```

**Dashboard template changes:**

Add a platform comment block at the top:
```yaml
# Dashboard template — adjust metric queries for your platform
# Prometheus/Grafana: rate(metric_name_total[5m])
# Datadog: avg:metric.name{env:production}
# CloudWatch: SELECT AVG(MetricName) FROM SCHEMA(namespace, Dimension)
# See preferences.monitoring.dashboard_platform for your configured platform
```

Replace PromQL examples with clearly-labelled examples showing all three platforms, with only the configured platform uncommented by default.

**Acceptance:** A Go developer sees Go struct examples in the LLD template. A Datadog user sees Datadog query syntax as the primary example in the dashboard template.

---

## Task 14: Update command tables

**Files**: `AGENTS.md`, `CLAUDE.md`, `README.md`, `agents-md.md` template, `claude-md.md` template

Add `/status` and `/reset` to every command table.

```markdown
| `/status <name>` | Show pipeline progress for a feature |
| `/reset <name> [stage\|task] [options]` | Manually fix pipeline state |
```

**Acceptance**: All five files have both new commands in their command tables.

---

## Implementation Notes

Implemented 2026-03-06. All 14 tasks completed across 3 waves.

**Wave 1 (Tasks 1–6, 9–11, 13)**: All Wave 1 tasks completed in parallel. No file conflicts.

**Wave 2 (Tasks 7, 8, 12)**: Tasks 7 and 8 depended on Task 6 (preferences.yml defaults). Task 12 depended on Task 4 (workflow command). All completed successfully.

**Wave 3 (Task 14)**: Depended on Tasks 9 and 10 (/status and /reset skills). All command tables updated.

**Deviations from LLD**:
- Task 11 (`bin/init.js`): Added a new `copyRecursiveFiltered` helper function to avoid modifying the existing `copyRecursive` function, keeping backward compatibility for direct calls. The original `copyRecursive` is preserved for the rules/skills copy calls, and the new filtered version is used for the scaffold copy with platform flags.
- The `--opencode-only` check also correctly gates the `.claude/rules/` and `.claude/skills/` copy operations (which are done separately from the scaffold copy), not just the scaffold files.

**Skills directory sync**: `/status` and `/reset` skill directories were created in both `skills/` and `.claude/skills/` as required. The `skills/` directory is the canonical source; `.claude/skills/` is the installed copy.
