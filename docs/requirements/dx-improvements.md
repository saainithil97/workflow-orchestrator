---
feature: dx-improvements
stage: requirement
status: approved
version: 1
created: 2026-03-06
updated: 2026-03-06
author: session
approver: developer
depends_on: []
completion:
  checklist:
    - item: "Document all DX issues from analysis"
      done: true
    - item: "Prioritize and phase the work"
      done: true
    - item: "Get developer approval"
      done: true
  percentage: 100
  blockers: []
pipeline_overrides:
  hld: false
---

# DX Improvements

## Problem

A thorough DX analysis of the kit identified 10 issues across onboarding, first-run experience, cross-platform consistency, command discovery, progress visibility, and template quality. Three of these cause outright failures (OpenCode users on non-default pipeline configs hit unexplained gate errors). The rest degrade the experience enough to slow adoption.

## Goals

1. Fix all cross-platform consistency bugs so OpenCode and Claude Code produce identical behaviour
2. Reduce the friction of first-run setup
3. Add missing commands for pipeline introspection and manual state management
4. Improve progress visibility during long operations
5. Make templates language-agnostic

## Acceptance Criteria

### Phase 1 — OpenCode Consistency (Critical)
- **Given** a user on `pipeline.preset: minimal` (HLD skipped) runs `/lld` in OpenCode, **when** the LLD command executes, **then** it gates on the requirement doc, not the HLD doc
- **Given** a user on any pipeline preset runs `/workflow` in OpenCode, **when** the command resolves the pipeline, **then** it skips disabled stages (same as Claude Code)
- **Given** the OpenCode implementer agent runs, **when** a task is complete, **then** it returns results to the orchestrator and does NOT update the LLD directly
- **Given** any optional stage (hld, observe, staging, docs, retro) is disabled, **when** its OpenCode command is invoked directly, **then** it prints a skip message and exits (same as Claude Code)

### Phase 2 — Quick-start Preferences (High)
- **Given** a new user runs `/preferences`, **when** the skill starts, **then** it asks: "Quick start or full setup?" Quick start asks only 4 questions (language, framework, test_framework, pipeline_preset) and exits
- **Given** a user opens `preferences.yml` after `init`, **when** they look at the file, **then** they see 5 defaults already uncommented (pipeline.preset, branching_strategy, commit_convention, enforcement, max_learnings)
- **Given** a user runs their first `/requirement` on an empty preferences file, **when** the preamble loads preferences, **then** it only asks for preferences required by the current stage, not all 41

### Phase 3 — /status command (High)
- **Given** a user runs `/status user-auth`, **when** the command executes, **then** it displays a table showing each enabled pipeline stage with its current status (pending/in-progress/complete/skipped), document path, and key metric
- **Given** a feature has not started, **when** `/status` runs, **then** it shows all stages as pending and suggests the first command to run
- **Given** a feature is mid-pipeline, **when** `/status` runs, **then** it marks the current stage with an arrow and shows the next suggested command

### Phase 4 — /reset command (High)
- **Given** a user runs `/reset user-auth lld --complete`, **when** the command executes, **then** it updates the LLD frontmatter status to complete and prints what changed
- **Given** a user runs `/reset user-auth task 3 --pending`, **when** the command executes, **then** it resets task 3 to pending status and recalculates completion.percentage
- **Given** the frontmatter is malformed, **when** `/reset` runs, **then** it detects the malformation, attempts repair, and reports what it changed

### Phase 5 — Init fixes (Medium)
- **Given** a user runs `npx @dev-workflow/kit init` for the first time, **when** init completes, **then** each file is correctly labelled CREATE (new) or UPDATE (existing)
- **Given** a user runs `npx @dev-workflow/kit init --claude-only`, **when** init completes, **then** `.opencode/` files are not created
- **Given** a user runs `npx @dev-workflow/kit init --opencode-only`, **when** init completes, **then** `.claude/` files are not created

### Phase 6 — Progress feedback (Medium)
- **Given** the `/implement` orchestrator starts a wave, **when** forked agents are launched, **then** it prints "Starting Wave N/M (K tasks)..." before forking and "Wave N/M complete. X% done." after validation
- **Given** the `/workflow` orchestrator completes a stage, **when** it records the result, **then** it prints "Stage N/M (<stage>) complete. Next: <stage>."
- **Given** the pipeline fails at a stage, **when** error recovery runs, **then** it prints a partial completion summary: "Completed: [stages]. Failed at: <stage>."

### Phase 7 — Template language-agnosticism (Medium)
- **Given** a Go project uses the LLD template, **when** it renders, **then** the data model example uses Go structs, not TypeScript interfaces
- **Given** a Datadog user uses the dashboard template, **when** it renders, **then** the metric examples use Datadog syntax, not PromQL
- All templates include a language/platform-aware comment: "Adjust examples for your project's language (detected: <language from preferences>)"

## Out of Scope

- Real-time streaming progress (not possible with current agent architecture)
- Automatic language detection during `init` (deferred — complex, `/onboard` already handles this)
- `/help` command (the command table in AGENTS.md/CLAUDE.md serves this purpose adequately)

## Files Affected

### New files (8)
- `.claude/skills/status/SKILL.md`
- `skills/status/SKILL.md`
- `.opencode/commands/status.md`
- `scaffold/.opencode/commands/status.md`
- `.claude/skills/reset/SKILL.md`
- `skills/reset/SKILL.md`
- `.opencode/commands/reset.md`
- `scaffold/.opencode/commands/reset.md`

### Modified files (~63 unique)
- Phase 1: All 15 `.opencode/commands/*.md` + 15 `scaffold/.opencode/commands/*.md` + 2 agent files
- Phase 2: `preferences.yml` (×2), `preamble.md` (×2), `preferences/SKILL.md` (×2), `preferences.md` (×2 opencode)
- Phase 3/4: `AGENTS.md`, `CLAUDE.md`, `README.md`, `agents-md.md`, `claude-md.md` templates
- Phase 5: `bin/init.js`
- Phase 6: `implement/SKILL.md` (×2), `workflow/SKILL.md` (×2), opencode mirrors (×4)
- Phase 7: `lld.md` template (×2), `dashboard.yml` template (×2)
