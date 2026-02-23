---
name: preferences
description: View, update, or initialize developer and team preferences. Covers language, framework, testing, logging, OTel, dashboards, review dimensions, and workflow settings. Use at any time to configure the workflow.
---

# Developer Preferences

## Purpose

Manage the team and personal preferences that control how the development workflow operates. Preferences determine which tools, libraries, conventions, and platforms are used.

## Process

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

Ask which preference to change. Show the current value and ask for the new value. Provide a recommendation if applicable. Save the change.

### Step 3C: Initialize Preferences (Guided Walkthrough)

Walk through each category, providing recommendations based on the codebase analysis.

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
| `review_dimensions` | Enabled Tier 2/3 review dimensions | See review-dimensions.md |

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

staging:
  url: https://staging.example.com
  deploy_command: "npm run deploy:staging"
  integration_test_command: "npm run test:integration"
  e2e_test_command: "npm run test:e2e"
  ci_cd: github-actions
```

## Output

Updated `.dev-workflow/preferences.yml`.
