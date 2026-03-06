---
description: Create a Low-Level Design with ordered task checklist, function signatures, and observability specs
agent: architect
subtask: true
---

Create a Low-Level Design for feature: $ARGUMENTS

## Gate Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md`.

**If HLD is enabled** in the effective pipeline: Read `docs/hld/$ARGUMENTS.md`. Verify: `status: approved|complete`, `completion.percentage: 100`, `completion.blockers: []`. If not met, STOP and suggest running `/hld $ARGUMENTS`.

**If HLD is disabled** in the effective pipeline: Read `docs/requirements/$ARGUMENTS.md` instead. Apply the same checks. If not met, STOP and suggest running `/requirement $ARGUMENTS`.

## Instructions

1. Read `.dev-workflow/preferences.yml` and `.dev-workflow/learnings/LEARNINGS.md`
2. Read `docs/requirements/$ARGUMENTS.md` and `docs/hld/$ARGUMENTS.md`
3. Explore implementation surface in existing codebase

## Design Process

Use the template at `.dev-workflow/templates/lld.md`. Include:

1. **File Change Plan**: new files and modified files with purpose
2. **Interface Definitions**: function signatures with types, parameters, return values, errors
3. **Data Models**: fields, types, validation rules, database schemas
4. **Observability Specs**: per-component spans, log events, metrics, dashboard panels
5. **Implementation Tasks**: ordered, atomic, testable units of work. Each task specifies:
   - Files to create/modify
   - Dependencies on other tasks
   - Test approach (what tests to write)
   - Observability additions
   - Acceptance criteria
6. **Test Strategy**: unit, integration, E2E approach with coverage targets
7. **Dependency Graph**: ASCII visualization of task order

Each task goes in both frontmatter (machine-parseable) and body (human-readable).

Present for approval. Once approved: `status: approved`, checklist complete, save to `docs/lld/$ARGUMENTS.md` and `docs/observability/$ARGUMENTS.md`.
