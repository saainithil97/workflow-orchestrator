---
name: review
description: Code review using 5 core dimensions — correctness, security, error handling, readability, and performance. Runs automated checks, then manual review. Appends findings to the LLD with severity ratings. Use after implementation is complete.
argument-hint: "[feature-name]"
context: fork
agent: reviewer
---

# Code Review (Core Dimensions)

You are reviewing feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md` (check preferences for enabled Tier 2 dimensions, and learnings for recurring review findings).

Load the full code quality reference: `.dev-workflow/references/code-quality.md`

If any Tier 2 or Tier 3 dimensions are enabled in preferences (`workflow.review_dimensions`), also load: `.dev-workflow/references/review-dimensions.md`

## Gate Check

Follow the gate check protocol from `@rules/workflow.md` for this stage.

Read `docs/lld/$ARGUMENTS.md` and verify:
- ALL tasks have `status: complete` and `tests_passing: true`

If ANY task is incomplete: print which tasks remain, refuse to proceed, and suggest running `/implement $ARGUMENTS` first.

## Process

### Step 1: Understand the Change

1. Read `docs/requirements/$ARGUMENTS.md` — what was supposed to be built
2. Read `docs/hld/$ARGUMENTS.md` if it exists — how it was supposed to be built
3. Read `docs/lld/$ARGUMENTS.md` — the detailed plan and task list
4. Identify all files that were created or modified during implementation

### Step 2: Automated Checks

Run the following (adapt commands to the project's tooling from preferences):

1. **Test suite**: Run the full test suite. Record pass/fail count.
2. **Linter**: If a linter is configured, run it. Record findings.
3. **Type checker**: If applicable (TypeScript, mypy, etc.), run it. Record errors.
4. **Security scan**: If available (`npm audit`, `cargo audit`, `pip audit`, `snyk`), run it.

If any automated check fails critically (tests fail, type errors), stop the review and report.

### Step 3: Manual Review — 5 Core Dimensions

Review EVERY changed file against the 5 dimensions defined in `.dev-workflow/references/code-quality.md`. Be specific — reference file:line for every finding.

### Step 4: Check Observability

- Are OTel spans present on new code paths?
- Are structured logs at boundaries and error paths?
- Are metrics emitted for new business events?
- Do log entries include trace_id and span_id?
- Are dashboard definitions created for new metrics?

### Step 5: Check Test Quality

- Do tests cover happy path, edge cases, and error cases?
- Are tests deterministic (no flakiness)?
- Are tests independent (no ordering dependency)?
- Is coverage adequate (check against preferences)?

### Step 6: Compile Findings

Classify every finding by severity:
- **Critical**: Must fix. Security vulnerability, data loss risk, correctness bug, crash.
- **Warning**: Should fix. Performance issue, missing error handling, maintainability concern.
- **Suggestion**: Consider. Naming, structure, minor optimization.
- **Nitpick**: Optional. Purely stylistic.

### Step 7: Write Review

Append to `docs/lld/$ARGUMENTS.md` under `## Review Notes`:

```markdown
## Review Notes

### Review — <YYYY-MM-DD>
- **Reviewer**: reviewer-agent
- **Tests**: <pass count>/<total count> passing
- **Linter**: <clean | N findings>
- **Type Check**: <clean | N errors>
- **Security Scan**: <clean | N vulnerabilities>
- **Status**: pass | pass-with-warnings | fail

#### Critical Issues
1. **[CRITICAL] `file.ts:42` — <title>**
   ```<lang>
   <offending code>
   ```
   **Problem**: <what is wrong>
   **Fix**:
   ```<lang>
   <corrected code>
   ```

#### Warnings
...

#### Suggestions
...

#### Nitpicks
...

#### Observability Check
- Spans: <complete | missing for X>
- Logs: <complete | missing for X>
- Metrics: <complete | missing for X>
- Dashboards: <complete | missing for X>
```

Update the LLD frontmatter using the review tracking schema from `.dev-workflow/references/workflow-schemas.md`.

### Step 8: Determine Outcome

- **pass**: Zero critical issues, warnings are minor
- **pass-with-warnings**: Zero critical issues, but warnings that should be addressed
- **fail**: One or more critical issues — implementation must be fixed before proceeding

If **fail**: List the critical issues clearly and suggest running `/implement $ARGUMENTS` to fix them, then re-running `/review $ARGUMENTS`.

## Output

Review findings appended to `docs/lld/$ARGUMENTS.md` with frontmatter updated.
