---
feature: <feature-name>
stage: lld
status: draft
version: 1
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
author: <name>
approver: pending
depends_on: []
completion:
  checklist:
    - item: "File-level change plan complete"
      done: false
    - item: "Function signatures defined"
      done: false
    - item: "Data models specified"
      done: false
    - item: "Task checklist created"
      done: false
    - item: "Task dependencies ordered"
      done: false
    - item: "Test strategy per task defined"
      done: false
    - item: "Observability spec per task defined"
      done: false
    - item: "Status set to approved"
      done: false
  percentage: 0
  blockers: []
tasks:
  - id: 1
    description: "<task description>"
    files: []
    depends_on: []
    status: pending
    tests_passing: false
    reviewed: false
review:
  status: pending
  critical_issues: 0
  warnings: 0
  suggestions: 0
---

# <Feature Name> — Low-Level Design

## 1. Overview

Brief summary linking to the HLD. What exactly are we building?

**Requirement**: `docs/requirements/<feature>.md`
**HLD**: `docs/hld/<feature>.md`

## 2. File Change Plan

### New Files

| File | Purpose | Module |
|------|---------|--------|
| `src/models/<name>.ts` | Data model and validation | models |
| `src/services/<name>.ts` | Business logic | services |
| `tests/models/<name>.test.ts` | Model unit tests | tests |
| `tests/services/<name>.test.ts` | Service unit tests | tests |

### Modified Files

| File | Changes | Reason |
|------|---------|--------|
| `src/routes/index.ts` | Add new routes | New endpoints |
| `src/middleware/auth.ts` | Update permissions | New resource access control |

## 3. Interface Definitions

```typescript
// Replace with your project's language

interface CreateResourceRequest {
  name: string;
  description?: string;
}

interface CreateResourceResponse {
  id: string;
  name: string;
  createdAt: Date;
}

function createResource(req: CreateResourceRequest): Promise<CreateResourceResponse>;
function getResource(id: string): Promise<Resource | null>;
function deleteResource(id: string): Promise<void>;
```

## 4. Data Models

```sql
-- Replace with your project's database

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resources_name ON resources(name);
```

## 5. Implementation Tasks

> Each task is an atomic, testable unit. Complete in dependency order.
> Status: pending | in-progress | complete | blocked

### Task 1: <Description>
- **Status**: pending
- **Files**: `<file paths>`
- **Depends on**: None
- **Test approach**: <what tests, what cases, what mocks>
- **Observability**: <spans, logs, metrics this task adds>
- **Acceptance**: <specific, verifiable criteria for "done">
- **Details**:
  - <implementation step 1>
  - <implementation step 2>
  - <edge cases to handle>

### Task 2: <Description>
- **Status**: pending
- **Files**: `<file paths>`
- **Depends on**: Task 1
- **Test approach**: <what tests, what cases>
- **Observability**: <spans, logs, metrics>
- **Acceptance**: <done criteria>
- **Details**:
  - <steps>

### Task 3: <Description>
- **Status**: pending
- **Files**: `<file paths>`
- **Depends on**: Task 1, Task 2
- **Test approach**: <what tests>
- **Observability**: <additions>
- **Acceptance**: <criteria>
- **Details**:
  - <steps>

## 6. Test Strategy

| Layer | Scope | Tool | Coverage Target |
|-------|-------|------|-----------------|
| Unit | Models, Services | <from preferences> | >90% branch |
| Integration | API endpoints, DB | <from preferences> | Happy + error paths |
| E2E | Critical user flows | <from preferences> | Smoke tests |

### Test Utilities Needed
- <fixtures, factories, mocks to create>

## 7. Dependency Graph

```
Task 1 (Data model + validation)
  └─> Task 2 (Repository / data access layer)
       ├─> Task 3 (Service / business logic)
       │    └─> Task 5 (API handler / controller)
       └─> Task 4 (Event publisher / side effects)
            └─> Task 5 (API handler / controller)
                 └─> Task 6 (Integration tests)
```

## 8. Implementation Notes

> This section is filled during implementation for deviations and discoveries.

## 9. Review Notes

> This section is filled by the /review command.
