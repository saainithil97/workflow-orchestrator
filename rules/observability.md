# Observability Standards

Every production system must be observable. Observability is not an afterthought — it is designed during HLD, specified during LLD, implemented alongside business logic, and validated during staging.

## Three Pillars

### 1. Distributed Tracing (OpenTelemetry)

Every request flowing through the system must produce a trace.

#### Span Rules

- **Every inbound HTTP/gRPC request** gets a root span (typically from middleware/framework instrumentation)
- **Every outbound HTTP/gRPC call** gets a child span
- **Every database query** gets a child span with `db.system`, `db.statement` (sanitized), `db.operation` attributes
- **Every message queue publish/consume** gets a span with `messaging.system`, `messaging.destination` attributes
- **Every cache operation** gets a span with `cache.hit` boolean attribute
- **Every significant business operation** (payment processing, user registration, search) gets a named span

#### Span Naming Convention

```
<component>.<operation>

Examples:
  http.request
  db.query
  cache.get
  queue.publish
  auth.validate-token
  payment.process-charge
```

#### Required Span Attributes

| Attribute | When | Example |
|-----------|------|---------|
| `service.name` | Always | `user-service` |
| `service.version` | Always | `1.2.3` |
| `http.method` | HTTP spans | `POST` |
| `http.route` | HTTP spans | `/api/users/:id` |
| `http.status_code` | HTTP spans | `200` |
| `db.system` | DB spans | `postgresql` |
| `db.operation` | DB spans | `SELECT` |
| `error` | On error | `true` |
| `error.message` | On error | `Connection refused` |
| `user.id` | When authenticated | `usr_123` (never PII) |

#### OTel SDK Setup

Check `.dev-workflow/preferences.yml` for:
- `otel_exporter`: `otlp` (default recommendation), `jaeger`, `zipkin`, `console`
- `otel_endpoint`: The collector endpoint
- `otel_service_name`: Service name for this application

If not set, ask the developer. Recommend: OTLP exporter to an OpenTelemetry Collector.

### 2. Structured Logging

Logs are structured JSON, not free-form strings. Every log entry is machine-parseable.

#### Log Schema

Every log entry MUST include:

```json
{
  "timestamp": "2026-02-23T10:15:30.123Z",
  "level": "info | warn | error | debug",
  "message": "Human-readable description of what happened",
  "service": "user-service",
  "trace_id": "abc123...",
  "span_id": "def456...",
  "context": {
    "request_id": "req_789",
    "user_id": "usr_123"
  }
}
```

#### Log Level Rules

| Level | When to Use | Example |
|-------|------------|---------|
| `error` | Something failed that should not have. Requires investigation. | Database connection lost, unhandled exception, payment declined unexpectedly |
| `warn` | Something unexpected happened but was handled. May need attention. | Retry succeeded after failure, deprecated API called, rate limit approaching |
| `info` | Significant business events. The "story" of what happened. | User registered, order placed, deployment started, feature flag toggled |
| `debug` | Detailed diagnostic info. Disabled in production by default. | Cache miss details, SQL query parameters, intermediate computation values |

#### Log Rules

1. **Never log secrets.** No passwords, tokens, API keys, credit card numbers, or PII in logs
2. **Always include trace context.** Every log emitted during a traced request includes `trace_id` and `span_id`
3. **Always include request context.** Request ID, user ID (if authenticated), relevant entity IDs
4. **Log at boundaries.** Log when entering/exiting the system (HTTP request received, response sent), when calling external services, and when errors occur
5. **Avoid log spam.** Do not log inside tight loops. Use sampling for high-frequency events. Rate-limit repetitive error logs

#### Library Preference

Check `.dev-workflow/preferences.yml` for `logging_library`. If not set, recommend by language:
- **Node.js/TypeScript**: pino
- **Go**: zerolog or slog
- **Python**: structlog
- **Java**: SLF4J + Logback with JSON encoder
- **Rust**: tracing

### 3. Metrics

Metrics quantify system behavior over time.

#### Metric Types

| Type | Use Case | Example |
|------|----------|---------|
| **Counter** | Count events | `http_requests_total`, `errors_total`, `orders_placed_total` |
| **Histogram** | Measure distributions | `http_request_duration_seconds`, `db_query_duration_seconds` |
| **Gauge** | Point-in-time values | `active_connections`, `queue_depth`, `cache_size` |

#### Required Metrics

Every service MUST expose:

| Metric | Type | Labels |
|--------|------|--------|
| `http_requests_total` | Counter | `method`, `route`, `status_code` |
| `http_request_duration_seconds` | Histogram | `method`, `route` |
| `http_request_size_bytes` | Histogram | `method`, `route` |
| `http_response_size_bytes` | Histogram | `method`, `route` |
| `db_query_duration_seconds` | Histogram | `operation`, `table` |
| `db_connections_active` | Gauge | `pool_name` |
| `errors_total` | Counter | `type`, `component` |

Business-specific metrics should be defined during LLD.

#### Metric Naming Convention

Follow Prometheus conventions:
```
<namespace>_<name>_<unit>

Examples:
  myapp_http_requests_total
  myapp_http_request_duration_seconds
  myapp_db_connections_active
  myapp_orders_placed_total
```

## Dashboards as Code

Dashboards are version-controlled, not manually created in a UI.

### Dashboard Definition Format

Check `.dev-workflow/preferences.yml` for `dashboard_platform`. Supported:

| Platform | Format | Location |
|----------|--------|----------|
| Grafana | JSON (dashboard model) | `docs/dashboards/<name>.grafana.json` |
| Datadog | YAML (Terraform/monitor def) | `docs/dashboards/<name>.datadog.yml` |
| Generic | YAML (platform-agnostic spec) | `docs/dashboards/<name>.dashboard.yml` |

If no preference set, use the generic YAML format (see template in `.dev-workflow/templates/dashboard.yml`).

### Required Dashboards

Every service should have at minimum:

1. **Service Overview Dashboard**: Request rate, error rate, latency (p50/p95/p99), active connections
2. **Business Metrics Dashboard**: Feature-specific counters and gauges
3. **Infrastructure Dashboard**: CPU, memory, disk, network (if self-hosted)

### Alert Rules

Define alert rules alongside dashboards:

```yaml
alerts:
  - name: High Error Rate
    condition: "rate(errors_total[5m]) > 0.05"
    severity: critical
    runbook: docs/runbooks/<service>-high-error-rate.md

  - name: High Latency
    condition: "histogram_quantile(0.99, http_request_duration_seconds) > 2.0"
    severity: warning
    runbook: docs/runbooks/<service>-high-latency.md
```

Every critical alert MUST have a corresponding runbook.

## Validation During Staging

The `/staging` command validates observability:

1. **Traces are flowing**: Send test requests, verify traces appear in the collector/backend
2. **Logs are structured**: Verify JSON format, presence of trace context, correct log levels
3. **Metrics are emitting**: Check metric endpoints, verify counters increment, histograms populate
4. **Dashboards render**: If dashboard platform is accessible, verify dashboards show data
5. **Alerts fire correctly**: Trigger known error conditions, verify alerts fire

## OTel Collector Configuration

If the project uses an OTel Collector, its configuration should live in `infra/` or `deploy/` and be version-controlled. The agent should check if collector config exists and suggest creating one if missing.

Recommend a basic collector pipeline:
```
Receivers (OTLP) → Processors (batch, memory_limiter) → Exporters (to backend)
```
