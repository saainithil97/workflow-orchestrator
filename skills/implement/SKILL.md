---
name: implement
description: Implement LLD tasks using strict Test-Driven Development (Red-Green-Refactor). Processes tasks in dependency order, writes failing tests first, then minimal implementation, then refactors. Includes OTel instrumentation, structured logging, and metrics. Use after LLD is approved.
argument-hint: "[feature-name]"
context: fork
agent: implementer
---

# TDD Implementation

You are implementing feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md` (note especially: language, test_framework, logging_library, otel_exporter in preferences).

## Gate Check

Read `docs/lld/$ARGUMENTS.md` and verify:
- `status` is `approved` or `complete`
- `completion.percentage` is `100`
- `completion.blockers` is empty

If ANY condition fails: print what is missing, refuse to proceed, and suggest running `/lld $ARGUMENTS` first.

## Process

### Step 1: Read the LLD

Read `docs/lld/$ARGUMENTS.md` completely. Understand:
- The task list and dependency order
- The function signatures and data models
- The test strategy
- The observability spec from `docs/observability/$ARGUMENTS.md`

### Step 2: Find the Next Task

Look at the `tasks` in the LLD frontmatter. Find the first task where:
- `status: pending`
- All tasks in `depends_on` have `status: complete`

If no such task exists but incomplete tasks remain, there is a dependency issue — report it and stop.

### Step 3: TDD Cycle for Each Task

For EACH task, follow this exact sequence:

#### 3a. Red — Write Failing Tests

1. Create or open the test file specified in the task
2. Write tests that describe the expected behavior:
   - Happy path test
   - Edge case tests (empty input, boundary values, null)
   - Error case tests (invalid input, failures)
   - Security tests if applicable (injection, unauthorized access)
3. Run ONLY the new tests
4. **Verify they FAIL.** If any pass, the test is not testing new behavior — revise it
5. Commit the test files with message: `test: add failing tests for task N — <description>`

#### 3b. Green — Write Minimal Implementation

1. Write the MINIMUM code to make all failing tests pass
2. Do NOT add:
   - Extra functionality not required by the tests
   - Performance optimizations
   - Error handling beyond what the tests check
3. Run the new tests — **verify they all PASS**
4. Run the FULL test suite — **verify no regressions**
5. If regressions occur: fix them before proceeding, note the cause in learnings

#### 3c. Refactor

1. With all tests green, improve the code:
   - Remove duplication
   - Improve naming (make it self-documenting)
   - Simplify logic (reduce nesting, extract helper functions)
   - Ensure consistency with existing code patterns
2. After EVERY refactor change, run the full test suite
3. Tests must stay green throughout. If a test breaks, undo the refactor.

#### 3d. Instrument

1. Add OpenTelemetry spans as specified in the observability spec for this task
2. Add structured log statements at:
   - Entry/exit points of the new code path
   - Error handling paths
   - Significant business events
3. Add metrics as specified (counters for events, histograms for durations)
4. Ensure trace context propagation (trace_id, span_id in logs)
5. Run the full test suite — instrumentation must not break tests

#### 3e. Complete Task

1. Update the LLD document (`docs/lld/$ARGUMENTS.md`):
   - Set task `status: complete` in both frontmatter and body
   - Set `tests_passing: true`
2. Recalculate `completion.percentage` in frontmatter
3. Move to the next pending task (repeat from Step 2)

### Step 4: After All Tasks Complete

1. Run the full test suite with coverage report
2. Check coverage against targets from preferences (default: >90% branch for new code)
3. If coverage is below target, add additional tests
4. Verify all tasks in the LLD have `status: complete` and `tests_passing: true`
5. Update the LLD frontmatter: all tasks complete, overall status reflects implementation done
6. Note any deviations from the LLD design in a `## Implementation Notes` section

### Step 5: Update Learnings

If anything unexpected happened during implementation:
- Edge cases that were not anticipated in the LLD
- Dependencies that behaved differently than expected
- Test patterns that worked well or poorly
- Performance observations

Add these to `.dev-workflow/learnings/LEARNINGS.md` under a dated entry.

## Rules

- NEVER skip the Red phase. Every line of implementation code must be driven by a failing test.
- NEVER modify a test to make it pass (unless the test itself is wrong — and you must explain why).
- NEVER implement multiple tasks at once. One task, one TDD cycle.
- ALWAYS run the full test suite after completing a task. Regressions are caught immediately.
- ALWAYS check for existing test utilities, fixtures, and helpers before creating new ones.
- ALWAYS follow the project's existing code style and patterns.

## Output

All implementation code and tests written, LLD tasks checked off, coverage report generated.
