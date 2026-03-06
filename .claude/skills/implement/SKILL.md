---
name: implement
description: Implement LLD tasks using strict Test-Driven Development (Red-Green-Refactor). Computes execution waves from the task dependency graph and runs every task as a forked agent — the orchestrator never writes code directly. Includes OTel instrumentation, structured logging, and metrics. Use after LLD is approved.
argument-hint: "[feature-name]"
context: fork
agent: implementer
---

# TDD Implementation

You are the **orchestrator** for implementing feature: **$ARGUMENTS**

Your role is to plan, dispatch, verify, and record. You do NOT write implementation code or tests directly — every task is executed by a forked implementer agent in its own isolated context.

## Before You Start

Follow `@rules/preamble.md` (note especially: language, test_framework, logging_library, otel_exporter in preferences).

Load the full TDD reference: `.dev-workflow/references/tdd.md`

## Gate Check

Follow the gate check protocol from `@rules/workflow.md` for this stage.

Read `docs/lld/$ARGUMENTS.md` and verify:
- `status` is `approved` or `complete`
- `completion.percentage` is `100`
- `completion.blockers` is empty

If ANY condition fails: print what is missing, refuse to proceed, and suggest running `/lld $ARGUMENTS` first.

## Process

### Step 1: Read the LLD

Read `docs/lld/$ARGUMENTS.md` completely. Understand:
- The full task list with all `depends_on` relationships
- The function signatures and data models
- The test strategy
- The observability spec from `docs/observability/$ARGUMENTS.md`

### Step 2: Compute Execution Waves

Parse the `tasks` array from the LLD frontmatter. Build execution waves using topological sort:

**Algorithm:**
1. A task enters Wave 1 if `depends_on` is empty.
2. A task enters Wave N if all its dependencies are in waves ≤ N-1.
3. Tasks with the same wave number are candidates for parallel execution.

**File conflict check (CRITICAL):** Before finalising any wave, inspect the `files` list of every task in that wave. If two tasks in the same wave write to the **same file path**, split the later task into the next wave. Read-only file access (reading an existing file) is never a conflict.

**Print the computed wave plan before executing**, e.g.:
```
Execution plan for '$ARGUMENTS':
  Wave 1 (1 task):  Task 1 — Data model
  Wave 2 (1 task):  Task 2 — Repository layer
  Wave 3 (2 tasks): Task 3 — Service layer
                    Task 4 — Event publisher
  Wave 4 (1 task):  Task 5 — API handler
  Wave 5 (1 task):  Task 6 — Integration tests
```

Ask the developer to confirm the wave plan, or let you proceed automatically.

### Step 3: Execute Waves

For each wave in order, **always fork** — one Task tool invocation per task in the wave, regardless of whether the wave has one task or many.

Launch each invocation as a forked implementer agent with these instructions (fill in the bracketed values per task):

```
You are implementing a single task from the LLD for feature '$ARGUMENTS'.

Your role is implementer — you write code and tests. Do NOT orchestrate other agents.

Read docs/lld/$ARGUMENTS.md to understand the full feature context, then focus exclusively on:

Task [N]: [description]
- Files to write: [file list from LLD]
- Depends on: [prerequisites — already complete]
- Test approach: [from LLD]
- Observability: [from LLD]
- Acceptance criteria: [from LLD]

## TDD Cycle

### Red — Write Failing Tests
1. Create or open the test file(s) for this task
2. Write tests covering:
   - Happy path
   - Edge cases (empty input, boundary values, null)
   - Error cases (invalid input, downstream failures)
   - Security cases if applicable (injection, unauthorized access)
3. Run ONLY this task's tests
4. Verify they FAIL. If any pass without implementation, the test is not testing new behaviour — revise it.

### Green — Write Minimal Implementation
1. Write the MINIMUM code to make the failing tests pass
2. Do NOT add extra functionality, performance optimisations, or error handling beyond what tests require
3. Run this task's tests — verify they all PASS
4. Run ONLY this task's tests for regression check (the orchestrator runs the full suite after the wave)

### Refactor
1. With tests green, improve the code:
   - Remove duplication
   - Improve naming (self-documenting)
   - Simplify logic (reduce nesting, extract helpers)
   - Ensure consistency with existing patterns
2. After EVERY change, re-run this task's tests
3. Tests must stay green throughout — if a test breaks, undo the refactor

### Instrument
1. Add OpenTelemetry spans as specified in the observability spec for this task
2. Add structured log statements at:
   - Entry/exit points of the new code path
   - Error handling paths
   - Significant business events
3. Add metrics as specified (counters for events, histograms for durations)
4. Ensure trace context propagation (trace_id, span_id in logs)
5. Run this task's tests — instrumentation must not break them

## Rules
- NEVER skip the Red phase. Every line of production code must be driven by a failing test.
- NEVER modify a test to make it pass (unless the test is provably wrong — explain why).
- NEVER run the full test suite — the orchestrating agent does that after the wave completes.
- NEVER update the LLD task status — the orchestrating agent does that after validating the wave.
- If you encounter a blocking issue (missing dependency, unexpected interface mismatch, conflicting type), stop immediately and report it — do not try to work around it silently.

## Return
When complete, return:
- Task ID: [N]
- Status: complete | blocked
- Files written: [list]
- Tests written: [list]
- Summary: [1-2 sentences on what was implemented]
- Issues: [any problems encountered, or "none"]
```

Wait for ALL forked agents in the wave to complete before proceeding.

#### After every wave:

1. **Run the full test suite.** This is the orchestrator's primary job — catching regressions where tasks interact at runtime. Forked agents only run their own tests; this is the first time the full suite runs with the wave's changes in place.
2. If the suite fails: identify which task caused the regression (git diff per task's files, then bisect). Fix before proceeding to the next wave.
3. **Update the LLD** for all tasks completed in this wave:
   - Set `status: complete` in both frontmatter and body
   - Set `tests_passing: true`
   - Recalculate `completion.percentage`
4. **Record the wave result** — one line per task: `Wave N | Task M | complete | <summary>`

Discard the forked agents' full output from context — carry only the one-line records forward.

### Step 4: After All Waves Complete

1. Run the full test suite with coverage report
2. Check coverage against targets from preferences (default: >90% branch for new code)
3. If coverage is below target, fork an additional implementer agent to add the missing tests
4. Verify all tasks in the LLD have `status: complete` and `tests_passing: true`
5. Update the LLD frontmatter: overall status reflects implementation done
6. Note any deviations from the LLD design in a `## Implementation Notes` section

### Step 5: Update Learnings

If anything unexpected happened during implementation (edge cases, dependency surprises, test patterns that worked well, wave conflicts encountered), add a dated entry to `.dev-workflow/learnings/LEARNINGS.md`.

## Rules

- NEVER write implementation code or tests directly in the orchestrator context — always fork.
- NEVER let forked agents run the full test suite — that is the orchestrator's responsibility, after each wave.
- NEVER let forked agents update the LLD — the orchestrator updates it after validating the wave.
- ALWAYS run the full test suite after every wave. Regressions are caught at wave boundaries, not inside tasks.
- A forked agent that hits a blocking issue reports it immediately — the orchestrator decides whether to abort the wave, skip the task, or replan.
- Discard forked agent output after recording the one-line summary — the orchestrator context must stay lean.

## Output

All implementation code and tests written by forked agents, LLD tasks checked off by orchestrator, coverage report generated.
