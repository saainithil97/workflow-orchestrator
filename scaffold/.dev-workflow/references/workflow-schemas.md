# Workflow Tracking Schemas

Reference schemas for document frontmatter used during implementation, review, and staging stages.

## Implementation Task Tracking

The LLD document contains the task checklist. Each task is tracked in both the YAML frontmatter and the document body.

### Frontmatter Task Schema

```yaml
tasks:
  - id: 1
    description: "<what to build>"
    files: ["<file paths>"]
    depends_on: []
    status: pending | in-progress | complete | blocked
    tests_passing: false | true
    reviewed: false | true
```

### Body Task Format

```markdown
### Task 1: <Description>
- **Status**: pending | in-progress | complete | blocked
- **Files**: `path/to/file.ts`, `path/to/file.test.ts`
- **Depends on**: None | Task N
- **Test approach**: <how this task will be tested>
- **Acceptance**: <what "done" looks like>
- **Details**: <implementation specifics>
```

When a task is completed, update BOTH the frontmatter and body simultaneously.

## Review Tracking Schema

After `/review` completes, append to the LLD frontmatter:

```yaml
review:
  status: pass | pass-with-warnings | fail
  critical_issues: <count>
  warnings: <count>
  suggestions: <count>
  reviewed_by: <agent-name>
  reviewed_at: <YYYY-MM-DD>
  dimensions_checked:
    - correctness
    - security
    - error-handling
    - readability
    - performance
```

## Staging Tracking Schema

After `/staging` completes, append to the LLD frontmatter:

```yaml
staging:
  status: pass | fail
  environment: <staging URL>
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

## Feature Naming Convention

Feature names use kebab-case: `user-authentication`, `payment-processing`, `search-api`.

All documents for a feature share the same name:
- `docs/requirements/user-authentication.md`
- `docs/hld/user-authentication.md`
- `docs/lld/user-authentication.md`
