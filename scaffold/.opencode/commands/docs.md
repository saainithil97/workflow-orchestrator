---
description: Update all documentation — sync design docs, README, API docs, runbooks, migration guides, dashboards
agent: build
---

Update documentation for feature: $ARGUMENTS

## Gate Check

Read `docs/lld/$ARGUMENTS.md`. Verify review passed with zero critical issues. If staging was run, verify it passed.

## Instructions

1. Read `.dev-workflow/preferences.yml` and `.claude/rules/documentation.md`

## Documentation Checklist

1. **Design doc sync**: Compare requirement/HLD/LLD against implementation. Mark deviations with `> DEVIATION:` blocks
2. **Code documentation**: Verify all public functions have doc comments. Add inline comments for complex WHY logic
3. **API documentation**: Update OpenAPI/GraphQL/Proto specs for new/modified endpoints
4. **README**: Update setup, configuration, usage examples, architecture overview
5. **Runbooks**: Create runbook (`.dev-workflow/templates/runbook.md`) for every alert. Must include symptoms, diagnosis, remediation, verification, escalation
6. **Migration guides**: Create guide (`.dev-workflow/templates/migration-guide.md`) for every breaking change. Must include steps, rollback plan, timeline
7. **ADRs**: Verify all HLD decisions have standalone ADRs in `docs/adr/`
8. **Dashboards**: Validate definitions in `docs/dashboards/`, verify metric names match code
9. **Observability spec**: Verify `docs/observability/$ARGUMENTS.md` matches actual instrumentation

Verify: no orphan links, no stale content, consistent formatting, templates used for all structured docs.
