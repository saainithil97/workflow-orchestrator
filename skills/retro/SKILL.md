---
name: retro
description: Retrospective — capture what went well, what went wrong, and what to do differently. Records learnings, user feedback, and agent mistakes for future sessions. Use after completing a feature or at the end of any session.
argument-hint: "[feature-name]"
context: fork
---

# Retrospective & Learning

You are running a retrospective for feature: **$ARGUMENTS**

## Purpose

This is the learning stage. Its output improves all future sessions by recording:
- What went well (to repeat)
- What went wrong (to avoid)
- What was surprising (to prepare for)
- Developer feedback (to adapt to preferences)
- Agent mistakes (to self-correct)

## No Gate Check

This stage has no prerequisites. It can be run at any time — after completing a full workflow, after any individual stage, or at the end of any session.

## Pipeline Skip Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md`.

If `retro` is **disabled** in the effective pipeline AND this skill was invoked by `/workflow` (not directly by the developer):
- Print: "Retro stage is disabled in pipeline configuration. Skipping."
- Exit.

If invoked directly by the developer (`/retro`), always run regardless of pipeline config.

## Process

### Step 1: Review the Session

If a feature name is provided, review the design documents:
1. Read `docs/requirements/$ARGUMENTS.md`
2. Read `docs/hld/$ARGUMENTS.md` (if it exists)
3. Read `docs/lld/$ARGUMENTS.md` (including review notes and staging results)
4. Review any implementation notes and deviations

If no feature name, review the current session's conversation and actions.

### Step 2: Self-Assessment

Assess the agent's performance honestly:

1. **Accuracy**: Did the agent make correct decisions? Were there errors in design, implementation, or review?
2. **Completeness**: Were any steps skipped or done superficially? Were any edge cases missed?
3. **Efficiency**: Were there unnecessary iterations? Could the work have been done in fewer steps?
4. **Communication**: Were questions clear? Were recommendations well-justified? Was the developer kept informed?
5. **Preferences**: Did the agent respect developer preferences? Did it ask when unsure?

### Step 3: Ask the Developer

Ask the developer for feedback. Prompt with specific questions:

1. **What went well?** What parts of the workflow were most helpful?
2. **What was frustrating?** Where did the agent slow you down or make wrong assumptions?
3. **What was missing?** Were there gaps in the design, implementation, or documentation?
4. **What would you change?** How should the workflow be adjusted for next time?
5. **Any specific mistakes?** Did the agent do something that should never be repeated?
6. **Preference updates?** Should any preferences in `.dev-workflow/preferences.yml` be changed?

Listen carefully. Record their exact words, not your interpretation.

### Step 4: Update Preferences

If the developer requested preference changes:
1. Read `.dev-workflow/preferences.yml`
2. Apply the changes
3. Confirm the changes with the developer

### Step 5: Record Learnings

Create a dated entry in `.dev-workflow/learnings/LEARNINGS.md`:

```markdown
## <YYYY-MM-DD> — <Feature Name or Session Description>

### What Went Well
- <specific thing that worked>
- <specific thing that worked>

### What Went Wrong
- <specific mistake or issue>
  - **Root cause**: <why it happened>
  - **Prevention**: <how to avoid it next time>

### Surprises
- <unexpected discovery or insight>

### Developer Feedback
- <verbatim feedback from the developer>

### Action Items
- [ ] <concrete change to make for next time>
- [ ] <preference to update>
- [ ] <rule to add or modify>

### Agent Mistakes
- <specific error the agent made>
  - **Impact**: <what went wrong because of it>
  - **Correction**: <what should have been done instead>
```

### Step 6: Update Learnings Index

Ensure `.dev-workflow/learnings/LEARNINGS.md` has a header and the entries are ordered newest-first:

```markdown
# Learnings

This file records lessons learned from past development sessions. Agents MUST read this file before starting any new work and apply relevant learnings proactively.

---

## <newest entry>
...

## <older entry>
...
```

### Step 7: Rotate Learnings (if needed)

After adding the new entry, count the total number of `##` entries in `LEARNINGS.md`.

Read `workflow.max_learnings` from `.dev-workflow/preferences.yml` (default: 20).

If the entry count exceeds `max_learnings`:
1. Identify the oldest entries to archive (those beyond the limit)
2. Create or append to `.dev-workflow/learnings/archive/<YYYY-MM>.md` (current year-month)
3. Move the overflow entries there, preserving the full entry text
4. Remove the moved entries from `LEARNINGS.md`
5. Leave `LEARNINGS.md` with at most `max_learnings` entries

This keeps the auto-loaded context bounded as the project matures.

### Step 8: Cross-Reference with Rules

If any learning suggests a rule change:
1. Identify which rule file should be updated (`.claude/rules/*.md`)
2. Suggest the change to the developer
3. If approved, note it as an action item (the developer or a future session can apply it)

Do NOT modify rules files during retro — only suggest changes.

## What to Record — Examples

**Good learnings:**
- "The payment service returns 429 under load — always add retry with backoff when calling it"
- "The team prefers function components over class components in React"
- "Database migrations must be backward-compatible because we use rolling deployments"
- "The /api/v2 prefix is required for all new endpoints"

**Bad learnings (too vague):**
- "Things went well"
- "Could have been better"
- "Some tests were flaky"

## Output

Updated `.dev-workflow/learnings/LEARNINGS.md` and potentially updated `.dev-workflow/preferences.yml`.
