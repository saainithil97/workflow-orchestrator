---
description: Implement LLD tasks using strict TDD (Red-Green-Refactor) with OTel instrumentation
agent: build
---

Implement feature: $ARGUMENTS using strict Test-Driven Development.

## Gate Check

Read `docs/lld/$ARGUMENTS.md`. Verify: `status: approved|complete`, `completion.percentage: 100`, `completion.blockers: []`. If not met, STOP and suggest running `/lld $ARGUMENTS`.

## Instructions

1. Read `.dev-workflow/preferences.yml` (language, test_framework, logging_library, otel_exporter)
2. Read `.dev-workflow/learnings/LEARNINGS.md`
3. Read `docs/lld/$ARGUMENTS.md` completely and `docs/observability/$ARGUMENTS.md`

## TDD Cycle — For Each Task

Find the next `pending` task whose dependencies are all `complete`.

### Red
1. Write failing tests: happy path, edge cases, error cases, security cases
2. Run tests — they MUST fail
3. If they pass, the test is wrong — revise it

### Green
1. Write MINIMUM code to pass the tests
2. No extra functionality, no optimization
3. Run tests — MUST pass. Run full suite — no regressions

### Refactor
1. Improve code structure while keeping tests green
2. Run full suite after EVERY change

### Instrument
1. Add OTel spans per observability spec
2. Add structured logs at boundaries and error paths
3. Add metrics for business events
4. Run full suite — instrumentation must not break tests

### Complete
1. Update LLD: task `status: complete`, `tests_passing: true`
2. Recalculate `completion.percentage`
3. Move to next task

## After All Tasks

1. Run full test suite with coverage
2. Verify coverage meets targets from preferences
3. Update learnings with any surprises or discoveries
