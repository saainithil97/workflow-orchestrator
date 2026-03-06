---
name: review-extended
description: Full 20-dimension code review covering all Tier 1, 2, and 3 dimensions. Use for thorough periodic reviews or high-risk features. Significantly more comprehensive than the standard /review.
argument-hint: "[feature-name]"
context: fork
agent: reviewer
---

# Extended Code Review (All 20 Dimensions)

You are performing a comprehensive review of feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md`.

Load the full review references:
- `.dev-workflow/references/code-quality.md` — 5 core dimensions
- `.dev-workflow/references/review-dimensions.md` — all 20 dimensions

## Gate Check

Follow the gate check protocol from `@rules/workflow.md` for this stage.

Read `docs/lld/$ARGUMENTS.md` and verify:
- ALL tasks have `status: complete` and `tests_passing: true`

If not met: refuse and suggest `/implement $ARGUMENTS`.

## Process

### Step 1: Run Standard Review

Execute all steps from the standard `/review` skill (5 core dimensions + automated checks).

### Step 2: Determine Applicable Tier 2 Dimensions

Analyze the changed files to determine which Tier 2 dimensions apply:

| Dimension | Applies When |
|-----------|-------------|
| API Design | New/modified API endpoints or public interfaces |
| Concurrency | Async code, shared state, multi-threading, DB transactions |
| Scalability | Data-heavy features, high-traffic paths, DB changes |
| Observability | Any new code path (always applicable) |
| Accessibility | Frontend/UI code changes |
| i18n | User-facing strings, date/number formatting |
| Data Integrity | Database changes, state mutations, migrations |

### Step 3: Review Tier 2 Dimensions

For each applicable dimension, review against the criteria in `.dev-workflow/references/review-dimensions.md`.

### Step 4: Review All Tier 3 Dimensions

Review against ALL Tier 3 dimensions regardless of file types:
- Dependency Hygiene
- Idiomatic Code
- Configuration Management
- Backward Compatibility
- Resource Management
- Testing Quality
- Documentation Quality
- Compliance & Audit

### Step 5: Compile Extended Findings

Same format as standard review, but with additional sections for each dimension checked.

Update the LLD frontmatter using the review tracking schema from `.dev-workflow/references/workflow-schemas.md`, adding `type: extended` and listing all dimensions checked.

## Output

Comprehensive review findings appended to `docs/lld/$ARGUMENTS.md`.
