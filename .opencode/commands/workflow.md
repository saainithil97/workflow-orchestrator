---
description: Run the full development pipeline end-to-end — respects pipeline configuration (preset, per-stage overrides, parallel groups)
---

Run the complete development workflow for feature: $ARGUMENTS

## Before Starting

1. Read `.dev-workflow/preferences.yml`:
   - If empty or all preferences commented, run `/preferences` first.
   - Resolve the **effective pipeline**:
     a. Read `workflow.pipeline.preset` (default: `standard`)
     b. Apply presets:
        - `minimal`: requirement, lld, implement, review
        - `standard`: requirement, hld, lld, implement, review, docs, retro
        - `full`: requirement, hld, lld, implement, review, observe, staging, docs, retro
     c. Apply per-stage overrides from `workflow.pipeline.<stage>: true|false`
     d. If `$ARGUMENTS` is set, check `docs/requirements/$ARGUMENTS.md` for `pipeline_overrides`
     e. Mandatory stages (requirement, lld, implement, review) are always enabled
2. Read `.dev-workflow/learnings/LEARNINGS.md`
3. Print the resolved pipeline and ask the developer to confirm before starting

## Pipeline Execution

Execute stages in dependency order. Pause for developer approval at marked points. Skip disabled stages with a log line.

### Stage 1: /requirement $ARGUMENTS
**Always enabled.** Run if no approved requirement doc exists.
**PAUSE**: Present requirement doc. Ask for approval. Proceed only when `status: approved`.

### Stage 2: /hld $ARGUMENTS
**Skip if disabled.** Print: "HLD stage disabled — skipping." and continue.
**PAUSE**: Present HLD. Ask for approval. Proceed only when `status: approved`.

### Stage 3: /lld $ARGUMENTS
**Always enabled.** Gates on HLD (or requirement if HLD skipped).
**PAUSE**: Present LLD. Ask for approval. Proceed only when `status: approved`.

### Stage 4: /implement $ARGUMENTS
**Always enabled.** Run all tasks via TDD. No pause between tasks. Stop if a task fails.

### Stage 5: /review $ARGUMENTS
**Always enabled.**
**PAUSE if fail**: Present critical issues. Ask: fix and re-review, or override?

### Stage 6: /observe $ARGUMENTS (parallel group eligible)
**Skip if disabled.** Print: "Observe stage disabled — skipping." and continue.
Gate: review must pass with zero critical issues.

### Stage 7: /staging $ARGUMENTS (parallel group eligible with observe)
**Skip if disabled.** Print: "Staging stage disabled — skipping." and continue.
**PAUSE if fail**: Ask for direction.

### Stage 8: /docs $ARGUMENTS (parallel group eligible)
**Skip if disabled.** Print: "Docs stage disabled — skipping." and continue.
Gate: review must pass; if staging ran, staging must pass.

### Stage 9: /retro $ARGUMENTS (parallel group eligible with docs)
**Skip if disabled.** Print: "Retro stage disabled (invoked by /workflow) — skipping." and continue.
Capture learnings. Always final when enabled.

## Parallel Groups

If `workflow.pipeline.parallel_groups` is configured, run grouped stages concurrently when their gates are satisfied. Supported safe built-in groups:
- `[observe, staging]` — both gate on review pass; no file conflicts
- `[docs, retro]` — both gate on review/staging pass; no file conflicts

## Error Recovery

If any stage fails: stop, print which stages completed vs. failed, suggest remediation. Developer can fix and re-run the specific stage — pipeline resumes from the failed stage.

Print on failure:
```
Pipeline stopped at stage N/M (<stage>). Completed: [list]. Failed: <stage>.
```

## Output

Fully implemented, reviewed, tested, documented feature ready for `git commit`.
