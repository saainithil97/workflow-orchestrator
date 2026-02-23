---
name: onboard
description: Analyze an existing codebase and generate project-specific CLAUDE.md and AGENTS.md with dev-workflow integration.
argument-hint: "[--claude-only | --agents-only]"
---

# Codebase Onboarding

Analyze this codebase and generate tailored `CLAUDE.md` and `AGENTS.md` files.

Read the full instructions from `.claude/skills/onboard/SKILL.md` and follow them exactly.

## Quick Reference

### What It Does

1. **Detects** language, framework, build tools, test framework from config files
2. **Maps** directory structure with inferred purposes
3. **Identifies** conventions (naming, imports, error handling, async patterns)
4. **Extracts** build/test/run/lint commands from manifests and CI configs
5. **Generates** `CLAUDE.md` — project-specific context + workflow integration
6. **Generates** `AGENTS.md` — agent instructions + workflow commands
7. **Optionally updates** `.dev-workflow/preferences.yml` with detected settings

### Usage

- No arguments: generate both `CLAUDE.md` and `AGENTS.md`
- `--claude-only`: generate only `CLAUDE.md`
- `--agents-only`: generate only `AGENTS.md`

### Templates

Uses templates from `.dev-workflow/templates/claude-md.md` and `.dev-workflow/templates/agents-md.md`.

### If Files Already Exist

If `CLAUDE.md` or `AGENTS.md` already exist, the agent will ask whether to replace or merge before making changes.
