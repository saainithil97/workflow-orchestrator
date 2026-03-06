---
name: doctor
description: Scan the codebase for tech debt, code quality issues, security concerns, testing gaps, and more. Produces a structured inventory at .dev-workflow/tech-debt.yml.
argument-hint: "[--full | --category <name>]"
---

# Codebase Doctor

Scan this codebase for tech debt and produce a structured inventory.

Read the full instructions from `.claude/skills/doctor/SKILL.md` and follow them exactly.

## Quick Reference

### Categories

1. **Code Quality** — long files/functions, TODO/FIXME, type safety gaps, dead code
2. **Testing Gaps** — missing tests, no coverage config, empty test files
3. **Dependency Health** — missing lockfile, deprecated deps, loose pinning
4. **Architecture Smells** — god files, mixed concerns, circular deps, deep nesting
5. **DevOps Gaps** — missing CI/CD, no linter, no formatter, no pre-commit hooks
6. **Documentation Gaps** — missing README, undocumented API, stale comments
7. **Security Concerns** — hardcoded secrets, unsafe code patterns, missing validation
8. **Observability Gaps** — no logging, no error tracking, no metrics, no tracing

### Usage

- No arguments: scan all 8 categories
- `--category <name>`: scan only the named category
- `--full`: deeper analysis across all categories

### Output

Updated `.dev-workflow/tech-debt.yml` plus a summary health report.

### Re-running

The doctor is incremental. On subsequent runs, it updates existing items (marking fixed ones) and discovers new issues.
