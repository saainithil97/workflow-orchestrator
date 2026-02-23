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

Follow `@rules/preamble.md`, then read `@rules/review-dimensions.md` for the full 20-dimension definitions.

## Gate Check

Same as `/review` — all LLD tasks must be `status: complete` and `tests_passing: true`.

Read `docs/lld/$ARGUMENTS.md` and verify this. If not met, refuse and suggest `/implement $ARGUMENTS`.

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

For each applicable dimension, review against the criteria in `.claude/rules/review-dimensions.md`.

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

Update the LLD frontmatter with all dimensions checked:

```yaml
review:
  status: pass | pass-with-warnings | fail
  critical_issues: <count>
  warnings: <count>
  suggestions: <count>
  reviewed_by: reviewer-agent
  reviewed_at: <YYYY-MM-DD>
  type: extended
  dimensions_checked:
    # Tier 1
    - correctness
    - security
    - error-handling
    - readability
    - performance
    # Tier 2 (applicable)
    - api-design
    - observability
    - data-integrity
    # Tier 3
    - dependency-hygiene
    - idiomatic-code
    - configuration
    - backward-compatibility
    - resource-management
    - testing-quality
    - documentation-quality
    - compliance
```

## Output

Comprehensive review findings appended to `docs/lld/$ARGUMENTS.md`.
