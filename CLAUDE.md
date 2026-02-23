# Development Workflow — Plugin Entry Point

This plugin provides a structured, gated development workflow. Read `${CLAUDE_PLUGIN_ROOT}/rules/preamble.md` before starting any work.

## Pipeline

```
/dev-workflow:requirement → /dev-workflow:hld → /dev-workflow:lld → /dev-workflow:implement → /dev-workflow:review → /dev-workflow:staging → /dev-workflow:docs → /dev-workflow:retro
```

Each stage is gated — you MUST NOT proceed to the next stage until the current stage's document has `status: approved|complete`, `completion.percentage: 100`, and `completion.blockers: []` in its YAML frontmatter.

## Rules

Loaded from the plugin — read on a need-to-know basis:
- `${CLAUDE_PLUGIN_ROOT}/rules/workflow.md` — Pipeline stages, gating logic, completion markers
- `${CLAUDE_PLUGIN_ROOT}/rules/tdd.md` — TDD methodology
- `${CLAUDE_PLUGIN_ROOT}/rules/code-quality.md` — 5 core review dimensions
- `${CLAUDE_PLUGIN_ROOT}/rules/observability.md` — OTel, structured logging, metrics, dashboards
- `${CLAUDE_PLUGIN_ROOT}/rules/documentation.md` — Doc standards, sync rules
- `${CLAUDE_PLUGIN_ROOT}/rules/tech-debt.md` — Broken windows policy for tech debt
- `${CLAUDE_PLUGIN_ROOT}/rules/review-dimensions.md` — Full 20-dimension reference (on demand)
- `${CLAUDE_PLUGIN_ROOT}/rules/recommended-tools.md` — MCP servers and tools per workflow stage

## Documentation

All documents in `docs/` (requirements, hld, lld, adr, runbooks, migrations, dashboards, observability). Templates in `.dev-workflow/templates/`.

## Commands

| Command | Purpose |
|---------|---------|
| `/dev-workflow:requirement <name>` | Gather and clarify a requirement |
| `/dev-workflow:hld <name>` | Create high-level design |
| `/dev-workflow:lld <name>` | Create low-level design with task checklist |
| `/dev-workflow:implement <name>` | TDD implementation of LLD tasks |
| `/dev-workflow:review <name>` | Code review (5 core dimensions) |
| `/dev-workflow:review-extended <name>` | Full review (all 20 dimensions) |
| `/dev-workflow:observe <name>` | Add OTel instrumentation, logging, metrics, dashboards |
| `/dev-workflow:staging <name>` | Deploy to staging, run integration tests, validate |
| `/dev-workflow:docs <name>` | Update all documentation |
| `/dev-workflow:retro <name>` | Retrospective — capture learnings and feedback |
| `/dev-workflow:preferences` | View or update developer/team preferences |
| `/dev-workflow:tools` | Browse and configure recommended MCP servers and dev tools |
| `/dev-workflow:doctor` | Scan codebase for tech debt, generate health report |
| `/dev-workflow:onboard` | Generate codebase-aware CLAUDE.md and AGENTS.md |
| `/dev-workflow:workflow <name>` | Run the full pipeline end-to-end |
