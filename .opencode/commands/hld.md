---
description: Create a High-Level Design with C4 diagrams, API contracts, ADRs, and observability architecture
agent: architect
subtask: true
---

Create a High-Level Design for feature: $ARGUMENTS

## Pipeline Skip Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md`.

If `hld` is **disabled** in the effective pipeline:
- Print: "HLD stage is disabled in pipeline configuration. Skipping."
- Exit.

## Gate Check

Read `docs/requirements/$ARGUMENTS.md`. Verify: `status: approved|complete`, `completion.percentage: 100`, `completion.blockers: []`. If not met, STOP and suggest running `/requirement $ARGUMENTS`.

## Instructions

1. Read `.dev-workflow/preferences.yml` and `.dev-workflow/learnings/LEARNINGS.md`
2. Read `docs/requirements/$ARGUMENTS.md` thoroughly
3. Explore the existing codebase for architecture, patterns, and conventions

## Design Process

Use the template at `.dev-workflow/templates/hld.md`. Include:

1. **Context View** (ASCII diagram): how the feature fits in the system
2. **Container View** (ASCII diagram): deployable units involved
3. **Component View** (ASCII diagram): internal components of modified containers
4. **Data Flow**: step-by-step primary use case through the system
5. **Data Model**: new/modified entities with fields and types
6. **API Contract**: endpoints with method, path, request/response, auth
7. **Technology Decisions**: inline ADRs with alternatives and trade-offs. Also create standalone ADRs in `docs/adr/`
8. **Observability Architecture**: spans, metrics, logs, dashboards, alerts, runbook links
9. **Non-Functional Requirements**: performance, availability, security, scalability approaches
10. **Risks & Mitigations**

Present for approval. Once approved: `status: approved`, checklist complete, save to `docs/hld/$ARGUMENTS.md`.
