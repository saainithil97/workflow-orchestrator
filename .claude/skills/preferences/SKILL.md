---
name: preferences
description: View, update, or initialize developer and team preferences. Covers language, framework, testing, logging, OTel, dashboards, review dimensions, pipeline config, model routing, and parallelism. Use at any time to configure the workflow.
---

# Developer Preferences

## Purpose

Manage the team and personal preferences that control how the development workflow operates. Preferences determine which tools, libraries, conventions, platforms, models, and pipeline stages are used.

## Process

### Step 0: Choose Setup Mode

Ask the developer:
> "Quick start (4 essential questions, ~1 minute) or full setup (all preferences, ~10 minutes)?"

**Quick start**: Ask only:
1. Language (e.g., TypeScript, Python, Go, Rust)
2. Framework (e.g., Next.js, FastAPI, Gin, Axum)
3. Test framework (e.g., vitest, pytest, go test, cargo test)
4. Pipeline preset — explain each option briefly:
   - `minimal`: requirement → lld → implement → review (fastest, no design docs)
   - `standard` (recommended): adds hld, docs, retro — good for most teams
   - `full`: adds observe, staging — best for production services

Save these 4 values to `.dev-workflow/preferences.yml` and exit.
Print: "Quick setup complete. Run `/preferences` again for full configuration."

**Full setup**: Continue to Step 1 (existing walkthrough) below.

### Step 1: Read Current Preferences

Read `.dev-workflow/preferences.yml`. If it does not exist, inform the developer that no preferences are set and offer to initialize them.

### Step 2: Determine Action

Ask the developer what they want to do:
1. **View**: Display current preferences
2. **Update**: Change specific preferences
3. **Initialize**: Set up all preferences from scratch (guided walkthrough)

### Step 3A: View Preferences

Display the current preferences in a readable format, organized by category.

### Step 3B: Update Preferences

Ask which preference to change. Show the current value and ask for the new value. Provide a recommendation if applicable.

**If the changed preference is in `workflow.models`**, run the Agent File Sync (Step 5) after saving.

### Step 3C: Initialize Preferences (Guided Walkthrough)

Walk through each category in order, providing recommendations based on codebase analysis.

#### Project Basics
| Preference | Description | Recommendation Logic |
|-----------|-------------|---------------------|
| `project_name` | Project name | Read from package.json, Cargo.toml, go.mod, etc. |
| `language` | Primary language | Detect from file extensions |
| `framework` | Primary framework | Detect from dependencies |
| `package_manager` | Package manager | Detect from lock files |

#### Testing
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `test_framework` | Test runner | jest/vitest (JS/TS), pytest (Python), go test (Go), cargo test (Rust) |
| `test_location` | Where tests live | Colocated `.test.ts` files (recommended) or `tests/` directory |
| `coverage_target_branch` | Branch coverage target | 90% |
| `coverage_target_line` | Line coverage target | 95% |
| `e2e_framework` | E2E test framework | Playwright (recommended), Cypress, Selenium |

#### Observability
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `otel_exporter` | OTel exporter type | otlp (recommended) |
| `otel_endpoint` | Collector URL | http://localhost:4318 (local dev) |
| `otel_service_name` | Service name for traces | Derived from project_name |
| `logging_library` | Structured logging library | pino (Node), zerolog (Go), structlog (Python) |
| `metrics_format` | Metrics exposition | prometheus (recommended) |

#### Dashboards & Monitoring
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `dashboard_platform` | Dashboard tool | grafana (recommended), datadog, generic |
| `alert_notification` | Where alerts go | slack, pagerduty, email |

#### Documentation
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `api_doc_format` | API documentation format | openapi (REST), graphql-schema, protobuf |
| `adr_format` | ADR template format | madr-v3 (recommended) |
| `doc_comment_style` | Doc comment format | jsdoc (JS/TS), docstring (Python), godoc (Go) |

#### Code Quality
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `linter` | Linter tool | eslint (JS/TS), ruff (Python), golangci-lint (Go), clippy (Rust) |
| `formatter` | Code formatter | prettier (JS/TS), ruff (Python), gofmt (Go), rustfmt (Rust) |
| `max_function_length` | Max function line count | 30 |
| `max_file_length` | Max file line count | 300 |

#### Workflow
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `branching_strategy` | Git branching model | trunk-based (recommended), gitflow, github-flow |
| `commit_convention` | Commit message format | conventional-commits (recommended) |
| `review_dimensions` | Enabled Tier 2/3 review dimensions | See `.dev-workflow/references/review-dimensions.md` |

#### Pipeline Configuration
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `pipeline.preset` | Base stage set | `standard` (recommended): requirement→hld→lld→implement→review→docs→retro |
| `pipeline.hld` | Include HLD stage | `true` for complex features, `false` for small bugfixes |
| `pipeline.observe` | Include dedicated /observe step | `true` for full preset; otherwise inline during implement |
| `pipeline.staging` | Include staging validation | `true` if a staging URL is available |
| `pipeline.docs` | Include documentation sync | `true` (recommended for most teams) |
| `pipeline.retro` | Include retrospective | `true` (recommended — drives learning) |
| `pipeline.parallel_groups` | Stages to run concurrently | See below |
| `max_learnings` | Max LEARNINGS.md entries before archival | 20 (recommended) |

**Pipeline preset options:**
- `minimal`: requirement, lld, implement, review — fastest, no design docs or docs sync
- `standard` (default): adds hld, docs, retro — good for most teams
- `full`: adds observe, staging — best for production services with staging environments

Ask the developer which preset fits their workflow, then ask if any per-stage overrides are needed.

If the developer mentions they have no staging environment, set `pipeline.staging: false`.
If the developer says they skip HLD for small features, recommend using `pipeline_overrides` in individual requirement docs rather than disabling HLD project-wide.

**Parallel groups** let pipeline stages run concurrently when their gates are satisfied. Ask:
> "Would you like to run any stages in parallel? For example, observe + staging can run concurrently (both gate on review passing), and docs + retro can run concurrently (both gate on review/staging passing). This can significantly reduce total pipeline time."

Safe built-in combinations to suggest:
- `[observe, staging]` — post-review; no file conflicts
- `[docs, retro]` — post-validation; docs writes doc files, retro writes learnings

#### Model Routing
| Preference | Description | Recommendation |
|-----------|-------------|---------------|
| `workflow.models.architect` | Model for HLD/LLD/requirement | `opus` — complex design reasoning |
| `workflow.models.implementer` | Model for TDD code generation | `sonnet` — cost-effective, fast |
| `workflow.models.reviewer` | Model for code review | `opus` — thorough security + correctness |
| `workflow.models.documenter` | Model for documentation sync | `sonnet` — simpler reasoning task |
| `workflow.models.default` | Fallback for unassigned roles | `sonnet` |

Ask the developer: "Would you like to assign different models to different agent roles? Using opus for architect and reviewer gives deeper reasoning for design and security analysis, while sonnet for implementer and documenter is more cost-effective."

Supported model values (common):
- `opus` or `anthropic/claude-opus-4` — highest reasoning, highest cost
- `sonnet` or `anthropic/claude-sonnet-4-5` — balanced (current default for all agents)
- `haiku` or `anthropic/claude-haiku-3-5` — fastest, lowest cost, for simple tasks

**After saving model preferences, run Agent File Sync (Step 5).**

#### Staging & Deployment
| Preference | Description | Ask developer |
|-----------|-------------|--------------|
| `staging_url` | Staging environment URL | No default — must ask |
| `staging_deploy_command` | Deploy to staging | No default — must ask |
| `integration_test_command` | Run integration tests | No default — must ask |
| `e2e_test_command` | Run E2E tests | No default — must ask |
| `ci_cd` | CI/CD platform | github-actions, gitlab-ci, jenkins |

### Step 4: Save

Write the updated preferences to `.dev-workflow/preferences.yml` in YAML format.

For each preference, include a comment with the recommendation if the developer chose something different:

```yaml
# Recommended: vitest (faster, native ESM support)
test_framework: jest  # Developer preference
```

### Step 5: Agent File Sync (run when `workflow.models` changes)

When any `workflow.models.*` value is set or changed, automatically sync the model to the corresponding agent definition files. Show the developer a diff of what will change and confirm before writing.

#### Claude Code agents (`agents/*.md`):

The `model:` field in each agent's YAML frontmatter controls which model Claude Code uses when that agent handles a skill.

Read each agent file and update the `model:` field:

| `workflow.models` key | Agent file |
|-----------------------|-----------|
| `architect` | `agents/architect.md` |
| `implementer` | `agents/implementer.md` |
| `reviewer` | `agents/reviewer.md` |
| `documenter` | `agents/documenter.md` |

Example: if `workflow.models.architect: opus`, update `agents/architect.md`:
```yaml
# Before:
model: sonnet

# After:
model: opus
```

#### OpenCode agents (`.opencode/agents/*.md`):

The OpenCode agent format also supports a `model:` field in the YAML frontmatter. Apply the same mapping:

| `workflow.models` key | OpenCode agent file |
|-----------------------|---------------------|
| `architect` | `.opencode/agents/architect.md` |
| `implementer` | `.opencode/agents/implementer.md` |
| `reviewer` | `.opencode/agents/reviewer.md` |
| `documenter` | `.opencode/agents/documenter.md` |

**Note**: If the OpenCode platform version in use does not support the `model:` field (it will be silently ignored if unsupported), document this in a comment above the field:
```yaml
# model: controls which LLM this agent uses. Supported in OpenCode ≥ 1.x.
model: opus
```

#### Scaffold copies (if present):

If `scaffold/.opencode/agents/` exists, apply the same model updates there so new project scaffolds inherit the correct models.

#### Confirmation:

After syncing, report:
```
Agent model sync complete:
  agents/architect.md       model: sonnet → opus
  agents/reviewer.md        model: sonnet → opus
  agents/implementer.md     model: sonnet  (unchanged)
  agents/documenter.md      model: sonnet  (unchanged)
  .opencode/agents/architect.md   model: sonnet → opus
  .opencode/agents/reviewer.md    model: sonnet → opus
```

## Preference File Format

```yaml
# Project preferences — managed by /preferences command
# Last updated: <YYYY-MM-DD>

project:
  name: my-project
  language: typescript
  framework: nextjs
  package_manager: pnpm

testing:
  framework: vitest
  location: colocated  # colocated | separate
  coverage_branch: 90
  coverage_line: 95
  e2e_framework: playwright

observability:
  otel_exporter: otlp
  otel_endpoint: http://localhost:4318
  otel_service_name: my-project
  logging_library: pino
  metrics_format: prometheus

monitoring:
  dashboard_platform: grafana
  alert_notification: slack

documentation:
  api_format: openapi
  adr_format: madr-v3
  doc_comment_style: tsdoc

quality:
  linter: eslint
  formatter: prettier
  max_function_length: 30
  max_file_length: 300

workflow:
  branching_strategy: trunk-based
  commit_convention: conventional-commits
  review_dimensions:
    api-design: true
    observability: true
    data-integrity: true
  pipeline:
    preset: full
    parallel_groups:
      - [observe, staging]   # run concurrently after review passes
      - [docs, retro]        # run concurrently after staging passes
  models:
    architect: anthropic/claude-opus-4-6
    implementer: anthropic/claude-sonnet-4-6
    reviewer: anthropic/claude-opus-4-6
    documenter: anthropic/claude-sonnet-4-6
    default: anthropic/claude-sonnet-4-6
  max_learnings: 20

staging:
  url: https://staging.example.com
  deploy_command: "npm run deploy:staging"
  integration_test_command: "npm run test:integration"
  e2e_test_command: "npm run test:e2e"
  ci_cd: github-actions
```

## Output

Updated `.dev-workflow/preferences.yml` and synced `agents/*.md` / `.opencode/agents/*.md` if model preferences changed.
