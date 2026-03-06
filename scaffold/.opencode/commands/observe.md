---
description: Add or verify OTel instrumentation, structured logging, metrics, dashboards-as-code, and alerts
agent: build
---

Set up observability for feature: $ARGUMENTS

## Pipeline Skip Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md`.

If `observe` is **disabled** in the effective pipeline:
- Print: "Observe stage is disabled in pipeline configuration. Skipping."
- Exit.

## Instructions

1. Read `.dev-workflow/preferences.yml` (otel_exporter, logging_library, dashboard_platform, metrics_format)
2. Read `.claude/rules/observability.md` for full standards
3. Read `docs/observability/$ARGUMENTS.md` if it exists (from LLD phase)

If preferences are missing, ask the developer with recommendations.

## Process

1. **Audit**: Search codebase for existing OTel, logging, metrics setup
2. **OTel SDK**: If not present, add SDK setup with preferred exporter
3. **Tracing**: Add spans for HTTP handlers, outbound calls, DB queries, cache ops, business operations
4. **Logging**: Configure structured JSON logging with trace context correlation
5. **Metrics**: Add counters, histograms, gauges per observability.md standards
6. **Dashboards**: Create dashboard definitions in `docs/dashboards/` using template
7. **Alerts**: Define alert rules; create runbooks for each critical alert
8. **Validate**: Run test suite — instrumentation must not break tests
9. **Document**: Create/update `docs/observability/$ARGUMENTS.md`
