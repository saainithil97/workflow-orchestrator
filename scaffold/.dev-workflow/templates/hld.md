---
feature: <feature-name>
stage: hld
status: draft
version: 1
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
author: <name>
approver: pending
depends_on: []
completion:
  checklist:
    - item: "Architecture overview documented"
      done: false
    - item: "Component interactions mapped"
      done: false
    - item: "Data flow described"
      done: false
    - item: "API contracts defined"
      done: false
    - item: "Technology decisions justified (ADRs)"
      done: false
    - item: "Observability architecture designed"
      done: false
    - item: "Non-functional requirements addressed"
      done: false
    - item: "Risks and mitigations documented"
      done: false
    - item: "Status set to approved"
      done: false
  percentage: 0
  blockers: []
---

# <Feature Name> — High-Level Design

## 1. Context

### System Context Diagram

```
┌──────────┐              ┌──────────────┐              ┌──────────┐
│           │   HTTPS      │              │    gRPC      │          │
│  Client   │─────────────>│  API Gateway │─────────────>│ Service  │
│           │              │              │              │          │
└──────────┘              └──────────────┘              └──────────┘
                                  │
                                  │ SQL
                                  ▼
                          ┌──────────────┐
                          │   Database   │
                          └──────────────┘
```

### Actors & External Systems

| Actor / System | Role | Interface |
|---------------|------|-----------|
| <actor> | <role> | <protocol> |

## 2. Container View

What are the major deployable units? How do they communicate?

```
<ASCII container diagram>
```

### Containers

| Container | Technology | Purpose | New/Modified |
|-----------|-----------|---------|-------------|
| <name> | <tech> | <purpose> | New / Modified / Existing |

## 3. Component View

For each container being modified:

### <Container Name> — Components

```
<ASCII component diagram>
```

| Component | Responsibility | Dependencies |
|-----------|---------------|-------------|
| <name> | <responsibility> | <deps> |

## 4. Data Flow

Step-by-step flow for the primary use case:

1. Client sends `POST /api/...` with `{...}`
2. API Gateway validates JWT token
3. Service processes request...
4. Database stores result...
5. Response returned to client...

## 5. Data Model

### New / Modified Entities

```
Entity: <Name>
├── id: UUID (PK)
├── field: type (constraints)
├── created_at: timestamp
└── updated_at: timestamp
```

### Relationships

```
<Entity A> 1──N <Entity B>
<Entity B> N──M <Entity C>
```

## 6. API Contract

### New / Modified Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/resource` | Bearer JWT | Create a resource |

#### `POST /api/v1/resource`

**Request:**
```json
{
  "field": "value"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "field": "value",
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid input |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 409 | CONFLICT | Resource already exists |

## 7. Technology Decisions

### ADR-001: <Decision Title>

- **Status**: Accepted
- **Context**: <What is the issue motivating this decision?>
- **Decision**: <What is the change proposed?>
- **Alternatives Considered**:
  1. <Alternative A> — <pros/cons>
  2. <Alternative B> — <pros/cons>
- **Consequences**:
  - Positive: <benefit>
  - Negative: <trade-off>
  - Risks: <risk>

## 8. Observability Architecture

### Tracing

| Span Name | Parent | Attributes | Purpose |
|-----------|--------|-----------|---------|
| `http.request` | root | method, route, status | Track inbound requests |
| `db.query` | http.request | operation, table | Track DB operations |

### Metrics

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_requests_total` | Counter | method, route, status | Request rate |
| `http_request_duration_seconds` | Histogram | method, route | Latency distribution |

### Logging

| Event | Level | Context Fields | When |
|-------|-------|---------------|------|
| Request received | info | request_id, method, path | Every inbound request |
| Error occurred | error | request_id, error_type, message | Every unhandled error |

### Dashboards

| Dashboard | Panels | Platform |
|-----------|--------|----------|
| Service Overview | Request rate, Error rate, Latency p50/p95/p99 | <from preferences> |

### Alerts

| Alert | Condition | Severity | Runbook |
|-------|-----------|----------|---------|
| High Error Rate | error_rate > 5% for 5m | critical | `docs/runbooks/<service>-high-error-rate.md` |
| High Latency | p99 > 2s for 5m | warning | `docs/runbooks/<service>-high-latency.md` |

## 9. Non-Functional Requirements

| Aspect | Requirement | Approach |
|--------|-------------|----------|
| Latency | p99 < 200ms | Caching, connection pooling, efficient queries |
| Availability | 99.9% | Circuit breaker, retry with backoff, health checks |
| Security | Authenticated access only | JWT validation, input sanitization, rate limiting |
| Scalability | 1000 RPS | Horizontal scaling, stateless design, read replicas |

## 10. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| <risk> | Low/Medium/High | Low/Medium/High | <mitigation> |

## Open Questions

- [ ] <question>
