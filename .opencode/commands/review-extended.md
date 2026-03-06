---
description: Full 20-dimension code review (all Tier 1, 2, and 3 dimensions)
agent: plan
subtask: true
---

Perform a comprehensive 20-dimension review of feature: $ARGUMENTS

## Gate Check

Same as standard review — all LLD tasks must be `status: complete` and `tests_passing: true`.

## Instructions

1. Read `.claude/rules/review-dimensions.md` for full dimension definitions
2. Execute all steps from the standard `/review` command (5 core dimensions)
3. Determine applicable Tier 2 dimensions based on changed files
4. Review ALL Tier 3 dimensions regardless of file types

## Tier 2 Dimensions (context-dependent)
- API Design (new/modified endpoints)
- Concurrency (async code, shared state)
- Scalability (data-heavy, high-traffic)
- Observability (any new code path)
- Accessibility (frontend/UI changes)
- i18n (user-facing strings)
- Data Integrity (database changes)

## Tier 3 Dimensions (all checked)
- Dependency Hygiene, Idiomatic Code, Configuration, Backward Compatibility, Resource Management, Testing Quality, Documentation Quality, Compliance

## Output

Extended findings appended to LLD. Frontmatter updated with `type: extended` and all dimensions checked listed.
