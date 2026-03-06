---
name: implement
description: Implement LLD tasks using strict Test-Driven Development (Red-Green-Refactor). Computes execution waves from the task dependency graph and runs independent tasks in parallel. Includes OTel instrumentation, structured logging, and metrics. Use after LLD is approved.
argument-hint: "[feature-name]"
context: fork
agent: implementer
---

# TDD Implementation

You are implementing feature: **$ARGUMENTS**

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
  Wave 1 (sequential): Task 1 — Data model
  Wave 2 (sequential): Task 2 — Repository layer
  Wave 3 (parallel):   Task 3 — Service layer
                       Task 4 — Event publisher
  Wave 4 (sequential): Task 5 — API handler
  Wave 5 (sequential): Task 6 — Integration tests
```

Ask the developer to confirm the wave plan, or let you proceed automatically.

### Step 3: Execute Waves

For each wave in order:

#### If the wave has ONE task — run it directly in this context:

Follow the TDD cycle (Steps 4a–4e below) for that task.

#### If the wave has MULTIPLE tasks — run them in parallel:

Launch one Task tool invocation per task in the wave. Each invocation runs a forked implementer agent with these instructions:

```
You are implementing a single task from the LLD for feature '$ARGUMENTS'.

Read docs/lld/$ARGUMENTS.md to understand the full feature context.

Your ONLY job is Task [N]: [description]
- Files: [file list]
- Depends on: [prerequisites — already complete]
- Test approach: [from LLD]
- Observability: [from LLD]
- Acceptance: [from LLD]

Follow the TDD cycle exactly:
1. Red: Write failing tests for this task. Verify they fail.
2. Green: Write minimum implementation. Verify tests pass. Verify no regressions in THIS task's test file.
3. Refactor: Improve structure. Run this task's tests after every change.
4. Instrument: Add OTel spans, logs, metrics per observability spec.

Do NOT run the full test suite — the orchestrating agent will do that after all parallel tasks complete.
Do NOT update the LLD task status — the orchestrating agent will do that after validating the wave.

Return: task ID, status (complete | blocked), summary of what was implemented, any issues encountered.
```

Wait for ALL parallel task invocations to complete before proceeding.

#### After every wave (sequential or parallel):

1. **Run the full test suite.** This catches regressions introduced by parallel tasks interacting at runtime.
2. If the suite fails: identify which task caused the regression, fix it before proceeding to the next wave.
3. **Update the LLD** for all tasks completed in this wave:
   - Set `status: complete` in both frontmatter and body
   - Set `tests_passing: true`
   - Recalculate `completion.percentage`

### Step 4: TDD Cycle (for sequential tasks)

For tasks run directly (single-task waves), follow this exact sequence:

#### 4a. Red — Write Failing Tests

1. Create or open the test file specified in the task
2. Write tests that describe the expected behavior:
   - Happy path test
   - Edge case tests (empty input, boundary values, null)
   - Error case tests (invalid input, failures)
   - Security tests if applicable (injection, unauthorized access)
3. Run ONLY the new tests
4. **Verify they FAIL.** If any pass without implementation, the test is not testing new behaviour — revise it

#### 4b. Green — Write Minimal Implementation

1. Write the MINIMUM code to make all failing tests pass
2. Do NOT add extra functionality, performance optimizations, or error handling beyond what the tests check
3. Run the new tests — **verify they all PASS**
4. Run the FULL test suite — **verify no regressions**
5. If regressions occur: fix them before proceeding, note the cause in learnings

#### 4c. Refactor

1. With all tests green, improve the code:
   - Remove duplication
   - Improve naming (make it self-documenting)
   - Simplify logic (reduce nesting, extract helper functions)
   - Ensure consistency with existing code patterns
2. After EVERY refactor change, run the full test suite
3. Tests must stay green throughout. If a test breaks, undo the refactor.

#### 4d. Instrument

1. Add OpenTelemetry spans as specified in the observability spec for this task
2. Add structured log statements at:
   - Entry/exit points of the new code path
   - Error handling paths
   - Significant business events
3. Add metrics as specified (counters for events, histograms for durations)
4. Ensure trace context propagation (trace_id, span_id in logs)
5. Run the full test suite — instrumentation must not break tests

#### 4e. Complete Task

1. Update `docs/lld/$ARGUMENTS.md` using the task tracking schema in `.dev-workflow/references/workflow-schemas.md`:
   - Set task `status: complete` in both frontmatter and body
   - Set `tests_passing: true`
2. Recalculate `completion.percentage` in frontmatter

### Step 5: After All Waves Complete

1. Run the full test suite with coverage report
2. Check coverage against targets from preferences (default: >90% branch for new code)
3. If coverage is below target, add additional tests
4. Verify all tasks in the LLD have `status: complete` and `tests_passing: true`
5. Update the LLD frontmatter: all tasks complete, overall status reflects implementation done
6. Note any deviations from the LLD design in a `## Implementation Notes` section

### Step 6: Update Learnings

If anything unexpected happened during implementation (edge cases, dependency surprises, test patterns that worked well, parallel conflicts encountered), add a dated entry to `.dev-workflow/learnings/LEARNINGS.md`.

## Rules

- NEVER skip the Red phase. Every line of implementation code must be driven by a failing test.
- NEVER modify a test to make it pass (unless the test itself is wrong — explain why).
- NEVER let parallel task agents run the full suite — they run only their own tests; the wave orchestrator runs the full suite after the wave.
- ALWAYS run the full test suite after every wave completes. Regressions are caught at wave boundaries.
- ALWAYS check for existing test utilities, fixtures, and helpers before creating new ones.
- ALWAYS follow the project's existing code style and patterns.
- A parallel task agent that encounters a blocking issue (missing dependency, unexpected interface) reports it back immediately — the wave orchestrator decides whether to abort or work around it.

## Output

All implementation code and tests written, LLD tasks checked off, coverage report generated.
