---
name: workflow
description: Run the full development pipeline end-to-end for a feature — requirement gathering, HLD, LLD, TDD implementation, code review, staging validation, documentation sync, and retrospective. Pauses for user approval at key stages. Supports parallel stage groups and model routing from preferences.
argument-hint: "[feature-name]"
context: fork
---

# Full Development Workflow

You are running the complete development pipeline for feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md` — if preferences are empty, run `/preferences` first.

## Context Management

**Critical**: this orchestrator's context window must stay lean. After each stage completes:
- Do NOT retain the stage's full output in context.
- Read only the **frontmatter** of the stage's output document to verify gate conditions.
- Carry forward only a one-line status entry per stage: `Stage | status | document path | key metric`.
- The design documents on disk are the source of truth — trust them, not your context.

## Step 0: Resolve Effective Pipeline

1. Read `.dev-workflow/preferences.yml`.
2. Resolve preset + per-stage overrides + `parallel_groups` using `@rules/workflow.md`.
3. Check `docs/requirements/$ARGUMENTS.md` for `pipeline_overrides` if the file exists.
4. Mandatory stages (requirement, lld, implement, review) are always enabled.

**Print the effective pipeline before starting**, including which stages are parallel:

```
Effective pipeline for '$ARGUMENTS':
  [1] requirement        (mandatory)
  [2] hld                (optional — enabled)
  [3] lld                (mandatory)
  [4] implement          (mandatory — wave-parallel internally)
  [5] review             (mandatory)
  [6] observe + staging  (parallel group — both enabled)
  [7] docs + retro       (parallel group — both enabled)
```

Ask the developer to confirm or adjust before proceeding.

## Execution

Run each stage (or parallel group) in the resolved order. After each stage, **record only**:

```
✓ <stage>  |  <status>  |  <document path>  |  <key metric>
```

Example: `✓ review  |  pass-with-warnings  |  docs/lld/feature.md  |  0 critical, 2 warnings`

Discard the rest of the stage output from context.

---

### Stage: Requirement [MANDATORY]

Execute `/requirement $ARGUMENTS`.

**Pause**: Present the requirement summary to the developer. Ask for approval.
Gate: `docs/requirements/$ARGUMENTS.md` → `status: approved`

Record: `✓ requirement | approved | docs/requirements/$ARGUMENTS.md`

---

### Stage: HLD [optional]

*Skip if disabled. If skipped, record: `✗ hld | skipped`.*

Execute `/hld $ARGUMENTS`.

**Pause**: Present the HLD summary. Ask for approval.
Gate: `docs/hld/$ARGUMENTS.md` → `status: approved`

Record: `✓ hld | approved | docs/hld/$ARGUMENTS.md`

---

### Stage: LLD [MANDATORY]

Execute `/lld $ARGUMENTS`.

**Pause**: Present the LLD task list and dependency graph. Ask for approval.
Gate: `docs/lld/$ARGUMENTS.md` → `status: approved`

Record: `✓ lld | approved | docs/lld/$ARGUMENTS.md | N tasks`

---

### Stage: Implementation [MANDATORY]

Execute `/implement $ARGUMENTS`.

The implementer computes execution waves from the task dependency graph and runs independent tasks in parallel. No per-task pauses — the implementer reports after all waves complete.

If a wave fails, the implementer reports the blocking task. Ask the developer how to proceed.

Gate: All tasks `status: complete` AND `tests_passing: true`.

Record: `✓ implement | complete | docs/lld/$ARGUMENTS.md | N tasks, M tests`

---

### Stage: Review [MANDATORY]

Execute `/review $ARGUMENTS`.

**Pause if review fails** (critical issues found):
1. Present the critical issues summary
2. Ask: fix and re-review, or override with documented justification?
3. If fix: re-run `/implement $ARGUMENTS` for the affected tasks, then re-run `/review $ARGUMENTS`
4. If override: proceed with warning logged

Gate: `review.status: pass | pass-with-warnings` AND `review.critical_issues: 0`

Record: `✓ review | pass | docs/lld/$ARGUMENTS.md | N critical, N warnings`

---

### Stage Group: Post-Review [optional stages, potentially parallel]

Check the effective pipeline for `parallel_groups` containing `observe` and/or `staging`.

**If both observe and staging are enabled AND in the same parallel group:**

Launch both concurrently using the Task tool:
- Task A: Execute `/observe $ARGUMENTS`
- Task B: Execute `/staging $ARGUMENTS`

Wait for both to complete. If either fails:
- Staging failure: present results, ask developer for direction (fix code → re-implement + re-review, fix env manually, or skip with justification)
- Observe failure: treat as a warning; observability gaps are not a hard gate

**If only one is enabled, or they are not in the same parallel group:** run sequentially.

**If neither is enabled:** skip both, record `✗ observe | skipped` and `✗ staging | skipped`.

Record each: `✓ observe | complete | ...` and `✓ staging | pass | docs/lld/$ARGUMENTS.md | X/Y tests`

---

### Stage Group: Post-Validation [optional stages, potentially parallel]

Check the effective pipeline for `parallel_groups` containing `docs` and/or `retro`.

**If both docs and retro are enabled AND in the same parallel group:**

Launch both concurrently using the Task tool:
- Task A: Execute `/docs $ARGUMENTS`
- Task B: Execute `/retro $ARGUMENTS`

Wait for both to complete.

**If only one is enabled, or they are not in the same parallel group:** run sequentially.

**If neither is enabled:** skip both.

Record each: `✓ docs | complete | N files updated` and `✓ retro | complete | N learnings`

---

## Pipeline Summary Report

After all stages complete, present a final summary using only the recorded status entries:

```markdown
# Workflow Complete: $ARGUMENTS

## Pipeline
| Stage | Status | Notes |
|-------|--------|-------|
| requirement | complete | docs/requirements/$ARGUMENTS.md |
| hld | complete / skipped | docs/hld/$ARGUMENTS.md |
| lld | complete | docs/lld/$ARGUMENTS.md — N tasks |
| implement | complete | N tasks, M tests |
| review | pass | N critical, N warnings |
| observe | complete / skipped | — |
| staging | pass / skipped | X/Y tests |
| docs | complete / skipped | N files |
| retro | complete / skipped | N learnings |

## Ready to Commit
git add .
git commit -m "feat($ARGUMENTS): <summary>"
git push
```

## Error Recovery

If any stage fails irreversibly:
1. Stop the pipeline. Report stage, reason, suggested fix.
2. The developer fixes the issue and re-runs the specific stage command directly.
3. Once fixed, re-invoke `/workflow $ARGUMENTS` — it reads completion markers from the design documents and resumes from the first incomplete stage.

The pipeline does NOT restart from scratch — completion markers in design documents are the checkpoint mechanism.
