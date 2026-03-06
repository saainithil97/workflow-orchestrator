# @dev-workflow/kit

Structured, gated development workflow orchestration for **Claude Code** and **OpenCode**.

Enforces a strict pipeline for every feature:

```
Requirement → HLD → LLD → TDD Implementation → Review → Staging → Docs → Retro
```

Each stage is gated — the agent cannot proceed until the prior stage's document is approved, 100% complete, and has no blockers.

## Features

- **Strict gating** with YAML frontmatter validation (status, completion percentage, blockers)
- **TDD enforcement** — Red-Green-Refactor for every implementation task
- **Parallel task execution** — `/implement` computes execution waves from the LLD dependency graph and runs independent tasks concurrently via forked agents; full test suite runs after each wave
- **Configurable pipeline** — enable/disable stages via presets (`minimal`/`standard`/`full`) or per-stage overrides; per-feature overrides via `pipeline_overrides` in the requirement doc
- **Parallel pipeline stages** — configure `parallel_groups` (e.g., `[observe, staging]`, `[docs, retro]`) to run post-review stages concurrently
- **Model routing** — assign different models per agent role (`opus` for architect/reviewer, `sonnet` for implementer/documenter); managed by `/preferences`, auto-synced to agent definition files
- **Observability built-in** — OpenTelemetry spans, structured logging, metrics, dashboards-as-code
- **5-dimension code review** (core) with optional 20-dimension extended review
- **Architecture Decision Records** (MADR v3) inline and standalone
- **Session-to-session learning** — retrospectives capture mistakes, agents read them before starting
- **Developer preferences** — ask-don't-assume pattern with persistent team/personal config
- **Configurable enforcement** — pre-push hooks default to warn, configurable to strict
- **Curated tool catalog** — recommended MCP servers and dev tools per workflow stage, with install commands
- **Legacy codebase support** — codebase doctor scans for tech debt, onboarding generates project-aware CLAUDE.md/AGENTS.md
- **Broken windows policy** — agents fix tech debt in files they touch, tracked in a structured YAML inventory

## Installation

### Claude Code (Plugin)

```bash
/plugin install dev-workflow@marketplace
```

This installs skills, agents, rules, and hooks. It also scaffolds project-local files (`.dev-workflow/`, `.opencode/`, `docs/`).

Commands become available as `/dev-workflow:requirement`, `/dev-workflow:hld`, etc.

### OpenCode / CLI (npm)

```bash
npx @dev-workflow/kit init
```

This copies the project-local files into your project:
- `.dev-workflow/` — templates, preferences, learnings, tools catalog
- `.claude/rules/` — 9 shared rule files (workflow, TDD, code quality, tech debt, etc.)
- `.claude/skills/` — 15 skill files (OpenCode reads `.claude/skills/*/SKILL.md` natively)
- `.opencode/commands/` — 15 command files mirroring Claude Code skills
- `.opencode/agents/` — 4 agent files (architect, implementer, reviewer, documenter)
- `docs/` — 8 documentation subdirectories
- `opencode.json` — config referencing shared rules

Commands become available as `/requirement`, `/hld`, etc. Skills are auto-discovered by OpenCode from `.claude/skills/`.

### Local Installation (from a cloned repo)

If the package is not published to npm, or you want to use a local fork/clone, there are three options. All scaffold the same files into your target project's working directory.

#### Option A: `npm link` (recommended for repeated use)

```bash
# 1. Link the kit globally from its local clone
cd /path/to/dev-workflow-kit
npm link

# 2. Run init in your target project
cd /path/to/your-project
dev-workflow init
```

To unlink later: `npm unlink -g @dev-workflow/kit`

#### Option B: Direct `node` execution (one-off, no install)

```bash
cd /path/to/your-project
node /path/to/dev-workflow-kit/bin/init.js init
```

#### Option C: `npx` with local path

```bash
cd /path/to/your-project
npx /path/to/dev-workflow-kit init
```

All methods accept `--force` to overwrite existing files. User data (preferences, learnings, tech debt) is always preserved regardless of `--force`.

#### What gets created

After running init, your project will contain:

```
your-project/
├── .claude/
│   ├── rules/              # 9 rule files (pipeline, TDD, code quality, etc.)
│   └── skills/             # 15 skill directories (one SKILL.md each)
├── .dev-workflow/
│   ├── preferences.yml     # Team preferences (committed)
│   ├── preferences.local.yml  # Personal overrides (gitignored)
│   ├── tools-catalog.yml   # Curated MCP server and tool catalog
│   ├── references/         # Full rule content (loaded on demand by skills)
│   ├── learnings/
│   │   └── LEARNINGS.md    # Session-to-session learning log
│   └── templates/          # 10 document templates
├── .opencode/
│   ├── agents/             # 4 agent definitions
│   └── commands/           # 15 command files
├── docs/                   # 8 empty doc subdirectories with .gitkeep
├── opencode.json           # OpenCode config
└── .gitignore              # Updated with dev-workflow entries
```

#### Preserved files (never overwritten)

These files are always preserved during `init` and `update`, even with `--force`:

| File | Purpose |
|------|---------|
| `.dev-workflow/preferences.yml` | Team preferences |
| `.dev-workflow/preferences.local.yml` | Personal preference overrides |
| `.dev-workflow/learnings/LEARNINGS.md` | Accumulated learnings across sessions |
| `.dev-workflow/tech-debt.yml` | Tech debt inventory |

#### Optional: Runtime enforcement plugin (OpenCode only)

```bash
npm install @dev-workflow/kit
```

Add to your `opencode.json`:

```json
{
  "plugin": ["@dev-workflow/kit/plugin/workflow-enforcer"]
}
```

This hooks into OpenCode's runtime to:
- Remind agents to read learnings on session start
- Warn (or block) implementation writes without an approved LLD
- Suggest retrospectives when the session goes idle

### Updating

```bash
npx @dev-workflow/kit update [--dry-run]
```

For local installations, use the same patterns:

```bash
# npm link approach
dev-workflow update [--dry-run]

# Direct node approach
node /path/to/dev-workflow-kit/bin/update.js [--dry-run]
```

Updates scaffold files (templates, commands, agents) while preserving user data (preferences, learnings, tech debt).

## Pipeline Stages

| Stage | Command | Gate | Agent |
|-------|---------|------|-------|
| Requirement | `/dev-workflow:requirement` | None | Architect |
| HLD | `/dev-workflow:hld` | Requirement approved | Architect |
| LLD | `/dev-workflow:lld` | HLD approved | Architect |
| Implement | `/dev-workflow:implement` | LLD approved | Implementer |
| Review | `/dev-workflow:review` | All tasks complete | Reviewer |
| Staging | `/dev-workflow:staging` | Review passed | Implementer |
| Docs | `/dev-workflow:docs` | Review passed | Documenter |
| Retro | `/dev-workflow:retro` | None | Any |

Additional commands:
- `/dev-workflow:review-extended` — full 20-dimension review
- `/dev-workflow:observe` — add observability instrumentation
- `/dev-workflow:preferences` — manage team/personal preferences
- `/dev-workflow:status <name>` — show pipeline progress for a feature
- `/dev-workflow:reset <name> [stage|task] [options]` — manually fix pipeline state
- `/dev-workflow:tools` — browse and configure recommended MCP servers and dev tools
- `/dev-workflow:doctor` — scan codebase for tech debt, generate health report
- `/dev-workflow:onboard` — analyze codebase, generate CLAUDE.md + AGENTS.md
- `/dev-workflow:workflow` — run the full pipeline end-to-end

## Configuration

### Team Preferences (`.dev-workflow/preferences.yml`)

Committed to version control. Covers:
- Project settings (language, framework, package manager)
- Testing (framework, coverage thresholds, E2E tool)
- Observability (OTel exporter, logging library, metrics format)
- Monitoring (dashboard platform, alert notifications)
- Documentation (API format, comment style)
- Code quality (linter, formatter, max function/file length)
- Workflow (branching strategy, commit convention, enforcement level)
- Staging (URL, deploy command, test commands, CI/CD platform)

### Personal Preferences (`.dev-workflow/preferences.local.yml`)

Gitignored. Overrides team preferences for local development.

### Model Routing

Assign different models to different agent roles. Run `/preferences` to configure — it auto-syncs to `agents/*.md` and `.opencode/agents/*.md`.

```yaml
workflow:
  models:
    architect: opus       # complex design reasoning
    implementer: sonnet   # code generation — cost-effective
    reviewer: opus        # thorough security + correctness analysis
    documenter: sonnet    # documentation sync
    default: sonnet       # fallback
```

### Parallel Execution

**Within `/implement`**: Tasks are automatically grouped into execution waves from the LLD dependency graph. Independent tasks in the same wave run concurrently as forked agents. The full test suite runs after each wave.

To ensure parallel safety, the LLD architect marks accurate `files` lists per task. Tasks that write to the same file must have a `depends_on` relationship to avoid write conflicts.

**Pipeline stage parallelism**: Configure stages to run concurrently after their shared gate passes:

```yaml
workflow:
  pipeline:
    preset: full
    parallel_groups:
      - [observe, staging]   # both gate on review pass
      - [docs, retro]        # both gate on review/staging pass
```

### Pipeline Configuration

```yaml
workflow:
  pipeline:
    preset: standard    # minimal | standard | full
    staging: false      # per-stage override
```

Presets:
- `minimal`: requirement → lld → implement → review
- `standard` (default): adds hld, docs, retro
- `full`: adds observe, staging

Per-feature overrides in `docs/requirements/<feature>.md` frontmatter:
```yaml
pipeline_overrides:
  hld: false     # skip HLD for this small bugfix
  staging: true  # require staging for this risky change
```

### Enforcement Level

In `.dev-workflow/preferences.yml`:

```yaml
workflow:
  enforcement: warn    # warn (default) or strict
```

- `warn` — pre-push hook prints a warning but allows push
- `strict` — pre-push hook blocks push if review hasn't passed

## Legacy Codebase Support

For existing or inherited codebases, the plugin provides two additional commands that should be run after `init`:

### Codebase Onboarding (`/dev-workflow:onboard`)

Analyzes the project and generates tailored `CLAUDE.md` and `AGENTS.md` files that combine:
- **Project-specific context**: detected language, framework, directory structure, conventions, build/test commands
- **Workflow integration**: pipeline commands, rules references, tech debt awareness

The `init` command automatically detects existing codebases (presence of `src/`, `package.json`, etc. without a `CLAUDE.md`) and suggests running `/dev-workflow:onboard`.

### Codebase Doctor (`/dev-workflow:doctor`)

Scans the codebase across 8 categories and produces a structured tech debt inventory at `.dev-workflow/tech-debt.yml`:

| Category | What it scans for |
|----------|------------------|
| Code Quality | Long files/functions, TODO/FIXME, type safety gaps, dead code |
| Testing Gaps | Missing tests, no coverage config, empty test files |
| Dependency Health | Missing lockfile, deprecated deps, loose pinning |
| Architecture Smells | God files, mixed concerns, circular deps |
| DevOps Gaps | Missing CI/CD, no linter, no formatter |
| Documentation Gaps | Missing README, undocumented API, stale comments |
| Security Concerns | Hardcoded secrets, unsafe patterns, missing validation |
| Observability Gaps | No logging, no error tracking, no metrics |

Each item includes file path, line numbers, severity, suggested fix, and effort estimate. The doctor is re-runnable — subsequent runs update existing items and discover new ones. A health score (0–100) summarizes overall codebase condition.

### Broken Windows Policy

When agents work on code, they automatically check `.dev-workflow/tech-debt.yml` for known debt in the files they are editing. The policy:

- **Fix in-file + adjacent**: fix debt in files being modified AND closely related files (test files, direct imports)
- **Effort-gated**: only fix `small` and `medium` effort items opportunistically; `large` items need their own task
- **Time-bounded**: no more than ~20% of task time on debt fixes
- **Tracked**: every fix updates the item's status in `tech-debt.yml`
- **Reviewed**: the reviewer agent checks that debt was addressed and flags missed items

This is woven into the preamble (step 4), the implementer agent (refactor phase), and the reviewer agent (tech debt section in review output).

## Project Structure

```
your-project/
├── .claude/
│   ├── rules/              # 9 rule files (workflow, TDD, code quality, tech debt, etc.)
│   └── skills/             # 15 skills (requirement, HLD, LLD, implement, doctor, onboard, etc.)
│       └── */SKILL.md      # OpenCode auto-discovers these as agent skills
├── .dev-workflow/
│   ├── templates/          # Document templates (requirement, HLD, LLD, ADR, etc.)
│   ├── references/         # Full rule content, loaded on demand by skills
│   ├── tools-catalog.yml   # MCP server and tool catalog
│   ├── tech-debt.yml       # Tech debt inventory (generated by /doctor)
│   ├── preferences.yml     # Team preferences (committed)
│   ├── preferences.local.yml  # Personal overrides (gitignored)
│   └── learnings/
│       └── LEARNINGS.md    # Session-to-session learning log
├── .opencode/              # (OpenCode users only)
│   ├── commands/           # 15 command files
│   └── agents/             # 4 agent files
├── docs/
│   ├── requirements/       # Requirement documents
│   ├── hld/                # High-Level Design documents
│   ├── lld/                # Low-Level Design documents
│   ├── adr/                # Architecture Decision Records
│   ├── runbooks/           # Operational runbooks
│   ├── migrations/         # Migration guides
│   ├── dashboards/         # Dashboard-as-code definitions
│   └── observability/      # Observability specifications
└── opencode.json           # (OpenCode users only)
```

## Tools & MCP Servers

The plugin includes a curated catalog of recommended MCP servers and developer tools at `.dev-workflow/tools-catalog.yml`. Run `/dev-workflow:tools` to browse interactively.

| Category | Examples |
|----------|---------|
| Version Control | `github-mcp`, `gitlab-mcp`, `git-mcp` |
| Database | `postgres-mcp`, `sqlite-mcp`, `prisma-mcp` |
| Search & Research | `web-search-mcp`, `context7`, `web-fetch-mcp` |
| Infrastructure | `docker-mcp`, `kubernetes-mcp` |
| Observability | `grafana-mcp`, `prometheus-mcp`, `sentry-mcp` |
| Testing | `playwright-mcp` |
| Code Quality | `eslint-mcp`, `sequential-thinking` |
| Communication | `slack-mcp`, `linear-mcp`, `notion-mcp` |

No tools are required — the workflow works without any MCP servers. Tools are recommended based on your project stack and configured via preferences.

## Rules

The plugin ships with 9 rule files in `.claude/rules/`. They are auto-loaded into every agent session. To keep context lean, most are **thin stubs** (7 lines) that point to full content in `.dev-workflow/references/` — skills load that content on demand only when needed for the current stage.

| Rule | Auto-loaded | Full content |
|------|-------------|-------------|
| `preamble.md` | Full — pre-work checklist (preferences, learnings, gate check, tech debt) | — |
| `workflow.md` | Full — pipeline stages, gating logic, pipeline config, skipped-stage resolution | — |
| `tech-debt.md` | Full — broken windows policy, effort gating, priority order | — |
| `tdd.md` | Stub → loaded by `/implement` | `references/tdd.md` |
| `code-quality.md` | Stub → loaded by `/review`, `/review-extended` | `references/code-quality.md` |
| `observability.md` | Stub → loaded by `/observe`, `/staging` | `references/observability.md` |
| `documentation.md` | Stub → loaded by `/docs` | `references/documentation.md` |
| `review-dimensions.md` | Stub → loaded by `/review-extended` | `references/review-dimensions.md` |
| `recommended-tools.md` | Stub → loaded by `/tools` | `references/recommended-tools.md` |

## Agents

| Agent | Role | Tools |
|-------|------|-------|
| Architect | Requirements, HLD, LLD | Read-only |
| Implementer | TDD implementation, OTel instrumentation | Full access |
| Reviewer | Code review, security audit | Read + bash |
| Documenter | Docs, runbooks, dashboards | Read + write |

## License

MIT
