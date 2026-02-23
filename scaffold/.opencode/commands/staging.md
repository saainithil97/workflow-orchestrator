---
description: Deploy to staging, run integration and E2E tests, validate observability
agent: build
---

Validate feature $ARGUMENTS against the staging environment.

## Gate Check

Read `docs/lld/$ARGUMENTS.md`. Verify: `review.status` is `pass` or `pass-with-warnings`, `review.critical_issues` is `0`. If not, STOP and suggest `/review $ARGUMENTS`.

## Instructions

1. Read `.dev-workflow/preferences.yml` (staging_url, deploy command, test commands)
2. If staging preferences missing, ask the developer — these are required

## Process

1. **Pre-deploy**: Run unit tests, linter, type checker — all must pass
2. **Deploy**: Run staging deploy command (or guide developer through manual deploy)
3. **Integration tests**: Run against staging, record results
4. **E2E tests**: Run against staging, record results
5. **Validate traces**: Send test requests, verify traces appear with correct spans/attributes
6. **Validate logs**: Verify structured JSON format with trace context
7. **Validate metrics**: Verify counters increment, histograms populate
8. **Validate dashboards**: Verify definitions render correctly (if platform accessible)
9. **Performance smoke test**: Burst requests to key endpoints, check p50/p95/p99 latency

## Output

Update `docs/lld/$ARGUMENTS.md` frontmatter with staging results: test counts, observability validation status, latency measurements.
