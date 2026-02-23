---
name: observe
description: Add or verify OpenTelemetry instrumentation, structured logging, metrics, dashboards-as-code, and alert rules. Can be used standalone or as part of the workflow pipeline. Use when you need to add or audit observability.
argument-hint: "[feature-name]"
context: fork
agent: implementer
---

# Observability Setup

You are setting up observability for feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md` (note especially: otel_exporter, otel_endpoint, logging_library, dashboard_platform, metrics_format in preferences), then read `@rules/observability.md` for the full standards.

## Process

### Step 1: Audit Existing Observability

1. Search the codebase for existing OTel setup (look for `@opentelemetry`, `trace`, `span`, `meter`)
2. Search for existing logging setup (look for the configured logging library)
3. Search for existing metrics (look for counters, histograms, gauges)
4. Check if `docs/observability/$ARGUMENTS.md` exists from the LLD phase

### Step 2: OTel SDK Setup (if not present)

If the project does not have OTel configured:

1. Check preferences for the language
2. Add the appropriate OTel SDK dependencies
3. Create an initialization module that:
   - Configures the trace provider with the preferred exporter
   - Configures the meter provider
   - Sets service name and version from package metadata
   - Registers auto-instrumentation for common libraries (HTTP, DB, etc.)
4. Ensure the init module is called at application startup

Ask the developer to confirm the setup before proceeding.

### Step 3: Distributed Tracing

For the feature's code paths:

1. Add spans for:
   - Every inbound HTTP/gRPC handler (if not auto-instrumented)
   - Every outbound HTTP/gRPC call
   - Every database query
   - Every cache operation
   - Every message queue publish/consume
   - Every significant business operation
2. Add span attributes as specified in `.claude/rules/observability.md`
3. Ensure trace context propagation across service boundaries
4. Ensure span names follow the convention: `<component>.<operation>`

### Step 4: Structured Logging

For the feature's code paths:

1. Configure the logging library to output JSON
2. Add log correlation: include `trace_id` and `span_id` in every log entry
3. Add log statements at:
   - **info**: request received, response sent, significant business events
   - **warn**: retries, fallbacks, rate limit approaches
   - **error**: unhandled exceptions, failed external calls, validation failures
   - **debug**: cache hits/misses, intermediate values (disabled in production)
4. Include contextual fields: request_id, user_id, relevant entity IDs
5. Never log secrets, PII, or full request/response bodies in production

### Step 5: Metrics

For the feature's code paths:

1. Add required metrics from `.claude/rules/observability.md`:
   - `http_requests_total` (counter) with method, route, status_code labels
   - `http_request_duration_seconds` (histogram) with method, route labels
   - `errors_total` (counter) with type, component labels
2. Add business-specific metrics:
   - Counters for business events (orders placed, users registered, etc.)
   - Histograms for business operation durations
   - Gauges for current state (queue depth, active sessions, etc.)
3. Follow Prometheus naming conventions: `<namespace>_<name>_<unit>`

### Step 6: Dashboards as Code

1. Create dashboard definitions in `docs/dashboards/`:
   - **Service Overview**: request rate, error rate, latency p50/p95/p99
   - **Feature Dashboard**: business-specific metrics for this feature
2. Use the template at `.dev-workflow/templates/dashboard.yml`
3. Adapt to the preferred platform from preferences (Grafana JSON, Datadog YAML, or generic)
4. Ensure every panel references the correct metric name and labels

### Step 7: Alert Rules

1. Define alert rules for:
   - High error rate (>5% of requests returning 5xx)
   - High latency (p99 > threshold from requirements)
   - Business anomalies (if applicable)
2. Every critical alert MUST have a corresponding runbook
3. Create runbooks using `.dev-workflow/templates/runbook.md` if they don't exist
4. Link alerts to runbooks in the dashboard definitions

### Step 8: Validate

1. Run the test suite — instrumentation must not break tests
2. If a local development environment is available:
   - Start the application
   - Send test requests
   - Verify traces appear in the collector/console
   - Verify logs are structured JSON with trace context
   - Verify metrics are emitting

### Step 9: Document

1. Create or update `docs/observability/$ARGUMENTS.md` with:
   - All spans (name, attributes, parent)
   - All log events (level, message, context fields)
   - All metrics (name, type, labels, description)
   - Dashboard locations
   - Alert rules and thresholds
   - Runbook links

## Output

Instrumented code, dashboard definitions in `docs/dashboards/`, alert rules, runbooks, and observability spec in `docs/observability/`.
