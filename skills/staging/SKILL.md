---
name: staging
description: Deploy to staging environment, run integration and E2E tests, validate observability (traces, logs, metrics, dashboards), and report results. Use after review passes.
argument-hint: "[feature-name]"
context: fork
agent: implementer
---

# Staging Validation

You are validating feature **$ARGUMENTS** against the staging environment.

## Before You Start

Follow `@rules/preamble.md` (note especially: staging_url, staging_deploy_command, integration_test_command, e2e_test_command, otel_endpoint, dashboard_platform in preferences — these are critical for this stage).

## Gate Check

Read `docs/lld/$ARGUMENTS.md` and verify:
- `review.status` is `pass` or `pass-with-warnings`
- `review.critical_issues` is `0`

If not met: refuse to proceed and suggest running `/review $ARGUMENTS` first.

## Process

### Step 1: Pre-deployment Checks

1. Run the full unit test suite — must be 100% passing
2. Run the linter — must be clean
3. Run type checking — must be clean
4. Verify all LLD tasks are complete

### Step 2: Deploy to Staging

If `staging_deploy_command` is set in preferences:
1. Run the deployment command
2. Wait for deployment to complete
3. Verify the service is healthy (health check endpoint)

If not set, ask the developer:
- How do you deploy to staging?
- Is there a CI/CD pipeline, or is it manual?
- What is the staging URL?
- Save answers to preferences

If deployment is not automated, provide instructions and wait for the developer to confirm deployment is complete.

### Step 3: Run Integration Tests

1. Run integration tests against the staging environment:
   ```
   <integration_test_command> --env staging --url <staging_url>
   ```
2. Record results: total, passed, failed, skipped
3. If any tests fail:
   - Capture the failure details (test name, error message, stack trace)
   - Diagnose the root cause (is it a code bug, env issue, or test issue?)
   - Report findings

### Step 4: Run E2E Tests

1. Run E2E tests against staging:
   ```
   <e2e_test_command> --env staging --url <staging_url>
   ```
2. Record results
3. If any tests fail: diagnose and report

### Step 5: Validate Observability

#### Traces
1. Send test requests to the staging environment
2. Check if traces appear in the tracing backend (Jaeger, Tempo, etc.)
3. Verify:
   - Traces have the correct service name
   - Spans have the expected names and attributes
   - Parent-child relationships are correct
   - Trace context propagates across service boundaries

#### Logs
1. Check the logging backend (if accessible)
2. Verify:
   - Logs are structured JSON
   - Logs include trace_id and span_id
   - Logs include request context (request_id, user_id)
   - Log levels are appropriate
   - No secrets or PII in logs

#### Metrics
1. Check the metrics endpoint or backend
2. Verify:
   - Expected counters are incrementing
   - Histograms are recording values
   - Gauges reflect current state
   - Metric names follow conventions
   - Labels are correct

#### Dashboards
1. If the dashboard platform is accessible:
   - Verify dashboards render correctly
   - Verify panels show data from staging
   - Verify alert rules are configured
2. If not accessible, verify dashboard definitions are syntactically valid

### Step 6: Performance Smoke Test

1. Send a burst of requests to key endpoints
2. Check response times against requirements:
   - Are p50, p95, p99 latencies within targets?
   - Are there any timeouts or errors under load?
3. This is a smoke test, not a full load test — just verify basic performance is acceptable

### Step 7: Report Results

Update `docs/lld/$ARGUMENTS.md` frontmatter:

```yaml
staging:
  status: pass | fail
  environment: <staging_url>
  deployed_at: <YYYY-MM-DD>
  tests:
    integration:
      total: <N>
      passed: <N>
      failed: <N>
    e2e:
      total: <N>
      passed: <N>
      failed: <N>
  observability:
    traces: validated | not-validated | issues-found
    logs: validated | not-validated | issues-found
    metrics: validated | not-validated | issues-found
    dashboards: validated | not-validated | issues-found
  performance:
    p50_ms: <value>
    p95_ms: <value>
    p99_ms: <value>
  tested_at: <YYYY-MM-DD>
```

### Step 8: Handle Failures

If staging validation fails:
1. Clearly identify what failed and why
2. Determine if it's a code issue, environment issue, or test issue
3. If code issue: suggest running `/implement $ARGUMENTS` to fix, then re-running review and staging
4. If environment issue: report to the developer for manual resolution
5. If test issue: fix the test and re-run

## Output

Staging validation results appended to `docs/lld/$ARGUMENTS.md` frontmatter.
