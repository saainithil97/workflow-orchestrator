# Development Workflow — Project Rules

This project uses a structured, gated development workflow. Read `@rules/preamble.md` before starting any work.

## Pipeline

```
/requirement → /hld → /lld → /implement → /review → /staging → /docs → /retro
```

Each stage is gated — you MUST NOT proceed to the next stage until the current stage's document has `status: approved|complete`, `completion.percentage: 100`, and `completion.blockers: []` in its YAML frontmatter.

## Rules

Load on a need-to-know basis:
- @rules/workflow.md — Pipeline stages, gating logic, completion markers
- @rules/tdd.md — TDD methodology
- @rules/code-quality.md — 5 core review dimensions
- @rules/observability.md — OTel, structured logging, metrics, dashboards
- @rules/documentation.md — Doc standards, sync rules
- @rules/tech-debt.md — Broken windows policy for tech debt
- @rules/review-dimensions.md — Full 20-dimension reference (on demand)
- @rules/recommended-tools.md — MCP servers and tools per workflow stage

## Documentation

All documents in `docs/` (requirements, hld, lld, adr, runbooks, migrations, dashboards, observability). Templates in `.dev-workflow/templates/`.

## Commands

| Command | Purpose |
|---------|---------|
| `/requirement <name>` | Gather and clarify a requirement |
| `/hld <name>` | Create high-level design |
| `/lld <name>` | Create low-level design with task checklist |
| `/implement <name>` | TDD implementation of LLD tasks |
| `/review <name>` | Code review (5 core dimensions) |
| `/review-extended <name>` | Full review (all 20 dimensions) |
| `/observe <name>` | Add OTel instrumentation, logging, metrics, dashboards |
| `/staging <name>` | Deploy to staging, run integration tests, validate |
| `/docs <name>` | Update all documentation |
| `/retro <name>` | Retrospective — capture learnings and feedback |
| `/preferences` | View or update developer/team preferences |
| `/tools` | Browse and configure recommended MCP servers and dev tools |
| `/doctor` | Scan codebase for tech debt, generate health report |
| `/onboard` | Generate codebase-aware CLAUDE.md and AGENTS.md |
| `/workflow <name>` | Run the full pipeline end-to-end |
