---
description: Implement LLD tasks using wave-based parallel TDD — orchestrator forks one agent per task, never writes code directly
agent: build
---

Implement feature: $ARGUMENTS using strict Test-Driven Development.

You are the **orchestrator**. You compute waves, fork implementer agents, validate results, and update the LLD. You do NOT write implementation code or tests directly.

## Gate Check

Read `docs/lld/$ARGUMENTS.md`. Verify: `status: approved|complete`, `completion.percentage: 100`, `completion.blockers: []`. If not met, STOP and suggest running `/lld $ARGUMENTS`.

## Instructions

1. Read `.dev-workflow/preferences.yml` (language, test_framework, logging_library, otel_exporter)
2. Read `.dev-workflow/learnings/LEARNINGS.md`
3. Read `docs/lld/$ARGUMENTS.md` completely and `docs/observability/$ARGUMENTS.md`

## Step 1: Compute Execution Waves

Parse the `tasks` array from the LLD frontmatter. Build waves via topological sort:
1. Wave 1 = tasks with empty `depends_on`
2. Wave N = tasks whose dependencies are all in waves ≤ N-1
3. **File conflict check**: if two tasks in the same wave write to the same file, bump the later one to the next wave

Print the wave plan and ask the developer to confirm or proceed automatically.

## Step 2: Execute Each Wave

For every wave — whether it has one task or many — fork one agent per task with these instructions:

```
You are implementing Task [N]: [description] for feature '$ARGUMENTS'.
Read docs/lld/$ARGUMENTS.md for context, then focus on this task only.
Files: [list] | Depends on: [prerequisites — already complete]
Test approach: [from LLD] | Acceptance: [from LLD]

TDD cycle:
  Red:       Write failing tests (happy path, edge, error, security). Verify they FAIL.
  Green:     Write minimum code. Verify tests PASS. Do NOT run the full suite.
  Refactor:  Improve structure. Re-run this task's tests after every change.
  Instrument: Add OTel spans, structured logs, metrics per observability spec.

Rules:
  - Run ONLY this task's tests — the orchestrator runs the full suite after the wave
  - Do NOT update the LLD — the orchestrator does that after validating the wave
  - If blocked (missing dependency, interface mismatch), report immediately — do not workaround silently

Return: task ID, status (complete|blocked), files written, summary, issues.
```

Wait for ALL agents in the wave to complete.

## Step 3: After Every Wave

1. **Run the full test suite** — catches runtime regressions between tasks
2. If suite fails: identify the offending task and fix before proceeding
3. **Update the LLD**: set `status: complete`, `tests_passing: true` for each completed task; recalculate `completion.percentage`
4. Record one line per task: `Wave N | Task M | complete | <summary>` — discard the rest

## After All Waves

1. Run full test suite with coverage
2. Verify coverage meets targets from preferences
3. Verify all tasks `status: complete` and `tests_passing: true`
4. Add `## Implementation Notes` to the LLD for any deviations from the design
5. Update learnings with any surprises or wave conflicts
