# Development Workflow — Plugin Entry Point

This plugin provides a structured, gated development workflow. Read `${CLAUDE_PLUGIN_ROOT}/rules/preamble.md` before starting any work.

## Exploration → Build Flow

When entering unfamiliar territory, use the pre-pipeline exploration flow before committing to build:

```
/dev-workflow:explore <topic> → /dev-workflow:spike <topic> <question> → /dev-workflow:crystallize <topic> → /dev-workflow:requirement ...
```

- **`/explore`** — Learn a topic with a sharp collaborator. Code-first, curiosity-driven. State tracked in `.learn/topics/<topic>/`.
- **`/spike`** — Time-boxed investigation. Hypothesis → minimal code → decision. Answers questions, doesn't build features.
- **`/crystallize`** — Bridge to building. Synthesizes exploration into a draft requirement, carrying decisions and constraints forward.

These are NOT pipeline stages. No gates, no frontmatter schemas. Use them when you need to, skip them when you don't.

## Pipeline

```
/dev-workflow:requirement → /dev-workflow:hld → /dev-workflow:lld → /dev-workflow:implement → /dev-workflow:review → /dev-workflow:staging → /dev-workflow:docs → /dev-workflow:retro
```

The pipeline is **configurable**. Stages can be enabled or disabled via `workflow.pipeline` in `.dev-workflow/preferences.yml`. Mandatory stages (`requirement`, `lld`, `implement`, `review`) cannot be skipped. Individual features can further override the pipeline via `pipeline_overrides` in their requirement document.

**Parallel execution**: Independent tasks within `/implement` run in concurrent waves computed from the LLD dependency graph. Pipeline stages can also run in parallel via `workflow.pipeline.parallel_groups` (e.g., `[observe, staging]` and `[docs, retro]`).

**Model routing**: Each agent role (architect, implementer, reviewer, documenter) can use a different model via `workflow.models` in preferences. Run `/preferences` to configure — it auto-syncs to `agents/*.md` and `.opencode/agents/*.md`.

Each stage is gated — you MUST NOT proceed to the next stage until the current stage's document has `status: approved|complete`, `completion.percentage: 100`, and `completion.blockers: []` in its YAML frontmatter. When a stage is skipped, gate on the nearest enabled predecessor instead.

## Rules

Loaded from the plugin — read on a need-to-know basis:
- `${CLAUDE_PLUGIN_ROOT}/rules/workflow.md` — Pipeline stages, gating logic, completion markers, pipeline config
- `${CLAUDE_PLUGIN_ROOT}/rules/tdd.md` — Pointer to TDD reference (full content in `.dev-workflow/references/tdd.md`)
- `${CLAUDE_PLUGIN_ROOT}/rules/code-quality.md` — Pointer to code quality reference (full content in `.dev-workflow/references/code-quality.md`)
- `${CLAUDE_PLUGIN_ROOT}/rules/observability.md` — Pointer to observability reference (full content in `.dev-workflow/references/observability.md`)
- `${CLAUDE_PLUGIN_ROOT}/rules/documentation.md` — Pointer to docs reference (full content in `.dev-workflow/references/documentation.md`)
- `${CLAUDE_PLUGIN_ROOT}/rules/tech-debt.md` — Broken windows policy for tech debt
- `${CLAUDE_PLUGIN_ROOT}/rules/review-dimensions.md` — Pointer to review-dimensions reference
- `${CLAUDE_PLUGIN_ROOT}/rules/recommended-tools.md` — Pointer to tools reference

## Documentation

All documents in `docs/` (requirements, hld, lld, adr, runbooks, migrations, dashboards, observability). Templates in `.dev-workflow/templates/`. References in `.dev-workflow/references/`.

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
| `/dev-workflow:preferences` | View or update developer/team preferences (includes pipeline config) |
| `/dev-workflow:status <name>` | Show pipeline progress for a feature |
| `/dev-workflow:reset <name> [stage\|task] [options]` | Manually fix pipeline state |
| `/dev-workflow:tools` | Browse and configure recommended MCP servers and dev tools |
| `/dev-workflow:doctor` | Scan codebase for tech debt, generate health report |
| `/dev-workflow:onboard` | Generate codebase-aware CLAUDE.md and AGENTS.md |
| `/dev-workflow:workflow <name>` | Run the full pipeline end-to-end (respects pipeline config) |
| `/dev-workflow:explore <topic>` | Explore a new topic — code-first, curiosity-driven, state tracked |
| `/dev-workflow:spike <topic> <question>` | Time-boxed spike — hypothesis, minimal code, decision |
| `/dev-workflow:crystallize <topic>` | Bridge exploration to building — synthesize into a requirement |
