---
name: workflow
description: Run the full development pipeline end-to-end for a feature — requirement gathering, HLD, LLD, TDD implementation, code review, staging validation, documentation sync, and retrospective. Pauses for user approval at key stages.
argument-hint: "[feature-name]"
disable-model-invocation: true
---

# Full Development Workflow

You are running the complete development pipeline for feature: **$ARGUMENTS**

## Overview

This command orchestrates all 8 stages of the development workflow sequentially. It pauses for developer approval at key decision points.

```
/requirement → /hld → /lld → /implement → /review → /staging → /docs → /retro
```

## Before You Start

Follow `@rules/preamble.md` — if preferences are empty, run `/preferences` first.

## Pipeline Execution

### Stage 1: Requirement Gathering

Execute the `/requirement $ARGUMENTS` skill.

**Pause point**: Present the requirement document to the developer. Ask:
- Is this accurate and complete?
- Do you approve this requirement?

Only proceed when the developer approves. The requirement document must have `status: approved`.

---

### Stage 2: High-Level Design

Execute the `/hld $ARGUMENTS` skill.

**Pause point**: Present the HLD to the developer. Ask:
- Does this architecture make sense?
- Are the technology decisions acceptable?
- Do you approve this HLD?

Only proceed when the developer approves. The HLD must have `status: approved`.

---

### Stage 3: Low-Level Design

Execute the `/lld $ARGUMENTS` skill.

**Pause point**: Present the LLD to the developer. Ask:
- Does the task breakdown look right?
- Is the test strategy sufficient?
- Do you approve this LLD?

Only proceed when the developer approves. The LLD must have `status: approved`.

---

### Stage 4: Implementation

Execute the `/implement $ARGUMENTS` skill.

This stage does NOT pause for approval between tasks — it runs all tasks in sequence following TDD. However, if a task fails or gets blocked, it stops and reports.

**Completion check**: All tasks must have `status: complete` and `tests_passing: true`.

---

### Stage 5: Code Review

Execute the `/review $ARGUMENTS` skill.

**Pause point if review fails**: If critical issues are found:
1. Present the findings to the developer
2. Ask if they want to fix the issues and re-review, or override
3. If fix: go back to Stage 4 to address critical issues, then re-run Stage 5
4. If override: proceed with warnings logged

**Completion check**: `review.status` must be `pass` or `pass-with-warnings` with `critical_issues: 0`.

---

### Stage 6: Staging Validation

Execute the `/staging $ARGUMENTS` skill.

**Skip condition**: If `staging_url` is not in preferences and the developer indicates no staging environment is available, skip this stage with a note.

**Pause point if staging fails**: Present failures and ask the developer for direction:
- Fix code issues and re-run from the appropriate stage
- Fix environment issues manually and re-run staging
- Skip staging validation with a documented justification

---

### Stage 7: Documentation

Execute the `/docs $ARGUMENTS` skill.

This stage does not typically require a pause — it updates documentation based on the implementation.

**Completion check**: All documentation checklist items verified.

---

### Stage 8: Retrospective

Execute the `/retro $ARGUMENTS` skill.

This is always the final stage. It captures learnings and developer feedback for future sessions.

---

## Pipeline Summary Report

After all stages complete, present a summary:

```markdown
# Workflow Complete: $ARGUMENTS

## Stages
| Stage | Status | Notes |
|-------|--------|-------|
| Requirement | complete | docs/requirements/$ARGUMENTS.md |
| HLD | complete | docs/hld/$ARGUMENTS.md |
| LLD | complete | docs/lld/$ARGUMENTS.md |
| Implementation | complete | N tasks, M tests |
| Review | pass | N critical, N warnings, N suggestions |
| Staging | pass | Integration: X/Y, E2E: X/Y |
| Documentation | complete | N files updated |
| Retrospective | complete | N learnings recorded |

## Files Created/Modified
- <list of all files>

## Ready to Commit
All work is complete. You can now commit and push:
```
git add .
git commit -m "feat($ARGUMENTS): <summary>"
git push
```
```

## Error Recovery

If any stage fails:
1. Stop the pipeline
2. Report which stage failed and why
3. Suggest the remediation steps
4. The developer can fix the issue and re-run the specific stage using its individual command
5. Once fixed, resume the pipeline from where it stopped (re-run the failed stage)

The pipeline does NOT start over from scratch — it respects the completion markers in the design documents.

## Output

A fully implemented, reviewed, tested, documented, and retrospected feature ready for git commit.
