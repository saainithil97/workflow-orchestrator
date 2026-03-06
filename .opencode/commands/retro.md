---
description: Retrospective — capture learnings, feedback, and mistakes for future sessions
---

Run a retrospective for feature: $ARGUMENTS

## Pipeline Skip Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md`.

If `retro` is **disabled** AND this was invoked by `/workflow`:
- Print: "Retro stage is disabled in pipeline configuration. Skipping."
- Exit.
If invoked directly by the developer (`/retro`), always run regardless of pipeline config.

## No Gate Check — always allowed.

## Process

1. **Review session**: Read design docs, review notes, staging results, and implementation notes
2. **Self-assess**: Accuracy, completeness, efficiency, communication, preference-handling
3. **Ask the developer**:
   - What went well?
   - What was frustrating?
   - What was missing?
   - What would you change?
   - Any specific mistakes to never repeat?
   - Any preference updates?
4. **Update preferences**: Apply any changes to `.dev-workflow/preferences.yml`
5. **Record learnings**: Add dated entry to `.dev-workflow/learnings/LEARNINGS.md` with:
   - What went well (to repeat)
   - What went wrong (root cause + prevention)
   - Surprises and discoveries
   - Developer feedback (verbatim)
   - Action items
   - Agent mistakes (impact + correction)
6. **Suggest rule changes**: If learnings imply rule updates, suggest but do not apply

Entries must be specific and actionable, not vague. Keep newest-first order.
