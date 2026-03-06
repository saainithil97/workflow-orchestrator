# Development Workflow — Project Rules

This project uses a structured, gated development workflow. Read `@rules/preamble.md` before starting any work.

## Pipeline

```
/requirement → /hld → /lld → /implement → /review → /staging → /docs → /retro
```

The pipeline is **configurable**. Stages can be enabled or disabled via `workflow.pipeline` in `.dev-workflow/preferences.yml`. Mandatory stages (`requirement`, `lld`, `implement`, `review`) cannot be skipped. Individual features can further override the pipeline via `pipeline_overrides` in their requirement document.

**Parallel execution**: Independent tasks within `/implement` run in concurrent waves computed from the LLD dependency graph. Pipeline stages can also run in parallel via `workflow.pipeline.parallel_groups` (e.g., `[observe, staging]` and `[docs, retro]`).

**Model routing**: Each agent role (architect, implementer, reviewer, documenter) can use a different model via `workflow.models` in preferences. Run `/preferences` to configure — it auto-syncs to `agents/*.md` and `.opencode/agents/*.md`.

Each stage is gated — you MUST NOT proceed to the next stage until the current stage's document has `status: approved|complete`, `completion.percentage: 100`, and `completion.blockers: []` in its YAML frontmatter. When a stage is skipped, gate on the nearest enabled predecessor instead.

## Rules

Load on a need-to-know basis:
- @rules/workflow.md — Pipeline stages, gating logic, completion markers, pipeline config
- @rules/tdd.md — Pointer to TDD reference (load `.dev-workflow/references/tdd.md` for `/implement`)
- @rules/code-quality.md — Pointer to code quality reference (load `.dev-workflow/references/code-quality.md` for `/review`)
- @rules/observability.md — Pointer to observability reference (load `.dev-workflow/references/observability.md` for `/observe`, `/staging`)
- @rules/documentation.md — Pointer to docs reference (load `.dev-workflow/references/documentation.md` for `/docs`)
- @rules/tech-debt.md — Broken windows policy for tech debt
- @rules/review-dimensions.md — Pointer to review-dimensions reference (load for `/review-extended`)
- @rules/recommended-tools.md — Pointer to tools reference (load for `/tools`)

## Documentation

All documents in `docs/` (requirements, hld, lld, adr, runbooks, migrations, dashboards, observability). Templates in `.dev-workflow/templates/`. References in `.dev-workflow/references/`.

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
| `/preferences` | View or update developer/team preferences (includes pipeline config) |
| `/status <name>` | Show pipeline progress for a feature |
| `/reset <name> [stage\|task] [options]` | Manually fix pipeline state |
| `/tools` | Browse and configure recommended MCP servers and dev tools |
| `/doctor` | Scan codebase for tech debt, generate health report |
| `/onboard` | Generate codebase-aware CLAUDE.md and AGENTS.md |
| `/workflow <name>` | Run the full pipeline end-to-end (respects pipeline config) |
