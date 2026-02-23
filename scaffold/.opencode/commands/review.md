---
description: Code review — 5 core dimensions (correctness, security, error handling, readability, performance)
agent: plan
subtask: true
---

Review feature: $ARGUMENTS against 5 core quality dimensions.

## Gate Check

Read `docs/lld/$ARGUMENTS.md`. Verify ALL tasks have `status: complete` and `tests_passing: true`. If not, STOP and suggest `/implement $ARGUMENTS`.

## Instructions

1. Read `.dev-workflow/preferences.yml` and `.dev-workflow/learnings/LEARNINGS.md`
2. Read `docs/requirements/$ARGUMENTS.md`, `docs/hld/$ARGUMENTS.md`, `docs/lld/$ARGUMENTS.md`
3. Identify all changed files

## Automated Checks

1. Run full test suite — record pass/fail
2. Run linter if configured
3. Run type checker if applicable
4. Run security scanner if available

## Manual Review — 5 Dimensions

For every changed file, check:

1. **Correctness**: Logic errors, null handling, boundary conditions, race conditions
2. **Security**: Input validation, injection prevention, auth checks, secrets, data exposure
3. **Error Handling**: No swallowed errors, typed errors, resource cleanup, retry logic
4. **Readability**: Naming, function length, nesting depth, dead code, consistency
5. **Performance**: N+1 queries, O(n^2), unbounded collections, unnecessary work

Also check observability: OTel spans, structured logs, metrics, dashboards.

## Output

Classify findings as Critical/Warning/Suggestion/Nitpick. Append to `docs/lld/$ARGUMENTS.md` under `## Review Notes`. Update frontmatter with review status. Critical issues = fail; zero critical = pass or pass-with-warnings.
