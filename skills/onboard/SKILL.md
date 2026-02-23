---
name: onboard
description: Analyze an existing codebase and generate project-specific CLAUDE.md and AGENTS.md files with dev-workflow integration. Detects language, framework, conventions, directory structure, build commands, and known patterns. Use on legacy or inherited codebases that lack these files.
argument-hint: "[--claude-only | --agents-only]"
context: fork
agent: architect
---

# Codebase Onboarding

Analyze this codebase and generate tailored `CLAUDE.md` and `AGENTS.md` files that combine project-specific context with dev-workflow integration.

## Before You Start

1. Read `.dev-workflow/preferences.yml` — if it has project settings already filled in, use them.
2. Check if `CLAUDE.md` or `AGENTS.md` already exist at the project root:
   - If they exist, read them. Ask the developer: "I found an existing CLAUDE.md/AGENTS.md. Should I **replace** it with a fresh analysis, or **merge** my findings into the existing content?" Respect their answer.
3. Read `.dev-workflow/learnings/LEARNINGS.md` for any past onboarding notes.

## Arguments

- No arguments: generate both `CLAUDE.md` and `AGENTS.md`
- `--claude-only`: generate only `CLAUDE.md`
- `--agents-only`: generate only `AGENTS.md`

Parse `$ARGUMENTS` for these flags.

## Process

### Step 1: Detect Project Metadata

Scan for project manifest files and extract metadata:

| File | Extract |
|------|---------|
| `package.json` | name, description, scripts, dependencies (frameworks), engines |
| `go.mod` | module name, Go version, key dependencies |
| `Cargo.toml` | name, description, edition, dependencies |
| `pyproject.toml` | name, description, dependencies, build system |
| `requirements.txt` | key dependencies (framework detection) |
| `pom.xml` | groupId, artifactId, dependencies |
| `build.gradle` | plugins, dependencies |
| `Gemfile` | gem dependencies (Rails, Sinatra, etc.) |
| `*.csproj` | target framework, package references |

Record: **project name**, **description**, **language(s)**, **package manager**.

### Step 2: Detect Framework & Stack

From the manifest dependencies and import patterns, identify:

**Web frameworks**: React, Next.js, Remix, Vue, Nuxt, Angular, Svelte, SvelteKit, Express, Fastify, Hono, Koa, Django, Flask, FastAPI, Rails, Spring Boot, ASP.NET, Gin, Echo, Axum, Actix.

**Databases**: PostgreSQL, MySQL, MongoDB, SQLite, Redis (look for ORM configs: Prisma, Drizzle, TypeORM, Sequelize, SQLAlchemy, GORM, Diesel).

**Auth**: NextAuth, Clerk, Auth0, Passport, Firebase Auth, JWT libraries.

**Infrastructure**: Docker, Kubernetes, Terraform, Pulumi (look for config files).

Record the full stack profile.

### Step 3: Map Directory Structure

Build a map of key directories and their inferred purposes:

1. List all top-level directories.
2. For each directory with source code, infer its purpose from:
   - Directory name (`components/`, `services/`, `models/`, `routes/`, `api/`, `lib/`, `utils/`, `hooks/`, `middleware/`, `config/`, `scripts/`)
   - File contents (sample 2-3 files to confirm the inference)
3. Identify the **entry point(s)**: `main.ts`, `index.ts`, `app.py`, `main.go`, `App.tsx`, `server.ts`, etc.
4. Identify the **test directory**: `__tests__/`, `tests/`, `test/`, `spec/`, or co-located test files.

Format as a tree with annotations.

### Step 4: Detect Conventions

Scan source files (sample at least 10 representative files) to detect:

- **Naming**: camelCase, snake_case, PascalCase, kebab-case — for files, functions, classes, variables
- **Import style**: absolute vs relative imports, barrel files (index re-exports), path aliases (`@/`, `~/`)
- **Export style**: named exports vs default exports, module pattern
- **Error handling pattern**: try/catch, Result/Either types, error returns, custom error classes
- **Async pattern**: async/await, Promises, callbacks, channels (Go), tokio (Rust)
- **File organization**: co-located tests vs separate test directory, co-located styles, feature-based vs layer-based
- **Comment style**: JSDoc, docstrings, `///` doc comments, minimal comments

### Step 5: Detect Build/Test/Run Commands

From manifest files, CI configs, Makefiles, and Dockerfiles, extract:

| Command | Source | Value |
|---------|--------|-------|
| **Build** | `package.json` scripts.build, `Makefile`, `Cargo.toml` | `<command>` |
| **Dev/Run** | scripts.dev, scripts.start, `Procfile` | `<command>` |
| **Test** | scripts.test, `Makefile` test target | `<command>` |
| **Lint** | scripts.lint, linter config | `<command>` |
| **Format** | scripts.format, formatter config | `<command>` |
| **Type check** | scripts.typecheck, `tsconfig.json` | `<command>` |

Also detect the **test framework** and **test file naming pattern**.

### Step 6: Detect Logging & Observability

Search for:
- Logging library imports (winston, pino, bunyan, slog, log, logging)
- Error tracking (Sentry, Bugsnag)
- Metrics (Prometheus, StatsD, DataDog)
- Tracing (OpenTelemetry, Jaeger)

Record what exists and what is missing.

### Step 7: Generate CLAUDE.md

Use the template at `.dev-workflow/templates/claude-md.md` as a starting point. Replace ALL placeholders with actual detected values:

1. **Project name and description**: from manifest or README
2. **Language, framework, package manager**: from Step 1-2
3. **Architecture tree**: from Step 3, with real directory names and purposes
4. **Build/test/run commands**: from Step 5, actual commands
5. **Conventions**: from Step 4, actual patterns found
6. **Key files table**: real entry points, config files, route files
7. **Dev Workflow section**: keep as-is from the template — this is the workflow integration

Write the result to `CLAUDE.md` at the project root.

### Step 8: Generate AGENTS.md

Use the template at `.dev-workflow/templates/agents-md.md` as a starting point. Replace ALL placeholders:

1. **Project metadata**: same as CLAUDE.md
2. **Key directories table**: from Step 3, real directories
3. **Conventions**: from Step 4, concise summary
4. **All workflow references**: keep as-is from the template

Write the result to `AGENTS.md` at the project root.

### Step 9: Update Preferences

If `.dev-workflow/preferences.yml` has empty/default values, fill them in based on what was detected:

- `project.language`, `project.framework`, `project.package_manager`
- `testing.framework`, `testing.e2e_tool` (if detected)
- `code_quality.linter`, `code_quality.formatter` (if detected)
- `observability.logging_library`, `observability.otel_exporter` (if detected)

Ask the developer before writing: "I detected these project settings — should I save them to preferences.yml?" List what was detected.

### Step 10: Suggest Doctor Run

If `.dev-workflow/tech-debt.yml` has no items (empty or not yet created), suggest:

> "I have generated your CLAUDE.md and AGENTS.md. For a complete codebase assessment, run `/doctor` to scan for tech debt and generate a health report."

## Rules

- **Be accurate, not creative.** Every claim in CLAUDE.md/AGENTS.md must be based on actual files you read. Do not infer a convention from one file — sample at least 5-10.
- **Ask when uncertain.** If you cannot determine the framework, test runner, or a convention, ask the developer rather than guessing.
- **Preserve existing content.** If the developer chose "merge" for an existing file, integrate your findings with their existing content. Do not delete their custom sections.
- **Keep the workflow section intact.** The dev-workflow integration section at the bottom of the templates must not be modified — it is the bridge between project context and workflow commands.
- **Do not generate aspirational content.** If the project has no tests, do not write "Tests: `npm test`" — write "Tests: Not configured". Be honest about the current state.

## Output

`CLAUDE.md` and/or `AGENTS.md` written to the project root, with preferences optionally updated.
