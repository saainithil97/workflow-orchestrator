---
name: doctor
description: Scan an existing codebase for tech debt, code quality issues, security concerns, testing gaps, and more. Produces a structured inventory at .dev-workflow/tech-debt.yml. Re-runnable — updates existing items and discovers new ones. Use on legacy or inherited codebases.
argument-hint: "[--full | --category <name>]"
context: fork
agent: reviewer
---

# Codebase Doctor

Scan this codebase for tech debt and produce a structured inventory.

## Before You Start

1. Read `.dev-workflow/preferences.yml` for project language, framework, and tooling context.
2. If `.dev-workflow/tech-debt.yml` already exists with items, load it — this is an incremental scan. You will update existing items and add new ones.
3. Read `.dev-workflow/learnings/LEARNINGS.md` for any past doctor findings or patterns.

## Arguments

- No arguments: run all 8 categories
- `--category <name>`: run only the named category (e.g., `--category security-concerns`)
- `--full`: run all 8 categories with deeper analysis (check more files, follow more imports)

Parse `$ARGUMENTS` for these flags.

## Process

### Step 1: Project Discovery

Before scanning for debt, understand the project:

1. **Detect language(s)**: look for `package.json` (JS/TS), `go.mod` (Go), `Cargo.toml` (Rust), `pyproject.toml`/`requirements.txt`/`setup.py` (Python), `pom.xml`/`build.gradle` (Java), `Gemfile` (Ruby), `*.csproj` (C#).
2. **Detect framework**: scan imports and config files (React, Next.js, Express, Django, FastAPI, Rails, Spring, etc.).
3. **Detect test framework**: Jest, Vitest, pytest, go test, cargo test, JUnit, RSpec, etc.
4. **Map source directories**: identify where source code lives (`src/`, `lib/`, `pkg/`, `app/`, etc.) versus config, docs, scripts.
5. **Count files by type**: get a rough scale of the codebase.

Record this context — you will need it for category-specific scans.

### Step 2: Scan Categories

For each category below, search the codebase systematically. Record every finding as a tech debt item. Be specific — include file paths and line numbers.

---

#### Category 1: Code Quality (`code-quality`)

Search for:

- **Long files**: files exceeding 300 lines (source files only, excluding generated/vendored)
- **Long functions/methods**: functions exceeding 50 lines. Search for function definitions and count lines to the closing brace/dedent.
- **Deep nesting**: conditionals nested more than 3 levels deep
- **TODO/FIXME/HACK/XXX comments**: search for these markers. Each is a debt item.
- **Type safety gaps**: in TypeScript, search for `: any`, `as any`, `@ts-ignore`, `@ts-expect-error`. In Python, look for missing type hints in public functions.
- **Console/print statements in production code**: `console.log`, `console.warn`, `print()` (Python), `fmt.Println` (Go) in non-test, non-script files.
- **Dead code indicators**: commented-out code blocks (more than 3 consecutive commented lines that look like code, not documentation).
- **Magic numbers/strings**: hardcoded values that should be constants (use judgment — not every literal is magic).

Severity guide: long files/functions = medium, TODO/FIXME = low, HACK/XXX = medium, type safety gaps = high, console statements = low, dead code = medium.

---

#### Category 2: Testing Gaps (`testing-gaps`)

Search for:

- **Source files without test files**: for each source file in the main source directory, check if a corresponding test file exists. Use the project's test naming convention (`.test.ts`, `_test.go`, `test_*.py`, `*_spec.rb`, etc.).
- **Missing test framework config**: is there a test configuration file (jest.config, vitest.config, pytest.ini, etc.)?
- **Missing test scripts**: does `package.json` have a `test` script? Does `Makefile` have a `test` target?
- **No coverage configuration**: is there a coverage config or coverage script?
- **Test files with no assertions**: test files that exist but contain no `expect`, `assert`, `should`, or equivalent.
- **Integration test gaps**: are there only unit tests? Look for E2E or integration test directories.

Severity guide: no test framework = critical, source files without tests = high (for business logic) or medium (for utilities), no coverage config = medium, empty test files = high.

---

#### Category 3: Dependency Health (`dependency-health`)

Search for:

- **Missing lockfile**: project has a manifest (`package.json`, `Cargo.toml`, `go.mod`) but no lockfile (`package-lock.json`/`yarn.lock`/`pnpm-lock.yaml`, `Cargo.lock`, `go.sum`).
- **Deprecated patterns**: in `package.json`, look for engines that suggest old Node.js versions. In Python, look for `setup.py` without `pyproject.toml`. Look for `var` instead of `const`/`let` in JS.
- **Pinning issues**: in `package.json`, dependencies using `*` or very loose ranges.
- **Known problematic dependencies**: `moment` (use `date-fns` or `dayjs`), `request` (deprecated), `node-uuid` (use `uuid`), `lodash` full package (use individual imports or native methods).

Severity guide: missing lockfile = high, deprecated deps = medium, loose pinning = medium, old patterns = low.

Note: do NOT run `npm audit` or similar tools. Only do static analysis of manifest and lockfiles.

---

#### Category 4: Architecture Smells (`architecture-smells`)

Search for:

- **God files**: source files exceeding 500 lines that also export more than 10 symbols. These do too much.
- **Mixed concerns**: files that import from both database/ORM layers AND HTTP/routing layers — they mix data access with request handling.
- **Barrel files**: `index.ts`/`__init__.py`/`mod.rs` files that only re-export from other modules. Flag if they re-export more than 10 items (becomes a dependency magnet).
- **Deeply nested directories**: source files more than 5 levels deep from the project root.
- **Circular dependency indicators**: file A imports from file B which imports from file A. Check the most central files (those with the most imports).
- **Inconsistent structure**: some modules follow one pattern (e.g., `feature/model.ts`, `feature/service.ts`, `feature/route.ts`) while others do not.

Severity guide: god files = high, mixed concerns = high, barrel overuse = medium, deep nesting = low, circular deps = critical, inconsistent structure = medium.

---

#### Category 5: DevOps Gaps (`devops-gaps`)

Search for:

- **Missing CI/CD**: no `.github/workflows/`, `.gitlab-ci.yml`, `.circleci/`, `Jenkinsfile`, `.buildkite/`, `azure-pipelines.yml`.
- **Missing linter config**: no `.eslintrc*`, `biome.json`, `.pylintrc`, `.golangci.yml`, `.rubocop.yml`, `rustfmt.toml` or equivalent.
- **Missing formatter config**: no `.prettierrc*`, `biome.json` (with format config), `black` config, `gofmt` (Go has this built-in).
- **Missing pre-commit hooks**: no `.husky/`, `.lefthook.yml`, `.pre-commit-config.yaml`.
- **Missing `.env.example`**: project uses environment variables (has `.env` in `.gitignore` or references `process.env`/`os.environ`) but no `.env.example` or `.env.template`.
- **Missing Docker**: no `Dockerfile` or `docker-compose.yml` (flag as low — not all projects need Docker).

Severity guide: no CI = high, no linter = medium, no formatter = low, no pre-commit hooks = low, no .env.example = medium.

---

#### Category 6: Documentation Gaps (`documentation-gaps`)

Search for:

- **Missing README**: no `README.md` at project root.
- **Thin README**: `README.md` exists but is under 20 lines or missing sections (no install instructions, no usage, no contributing).
- **Missing CONTRIBUTING.md**: for projects with more than 20 source files.
- **Missing CHANGELOG.md**: for projects that appear to be published (have a `version` in manifest).
- **Undocumented public API**: exported functions/classes without JSDoc, docstrings, or doc comments. Sample the top 10 most-imported modules.
- **Stale comments**: comments referencing things that no longer exist (old function names, removed features). Search for comments containing TODO with dates more than 6 months old.

Severity guide: no README = critical, thin README = high, no CONTRIBUTING = low, undocumented API = medium, stale comments = low.

---

#### Category 7: Security Concerns (`security-concerns`)

Search for:

- **Hardcoded secrets**: strings matching patterns like `sk-`, `sk_live`, `sk_test`, `AKIA`, `ghp_`, `glpat-`, `xox[bps]-`, passwords in config files. Also look for `password = "..."`, `secret = "..."`, `api_key = "..."` patterns.
- **`.env` not in `.gitignore`**: if `.env` files exist but `.gitignore` does not exclude them.
- **Unsafe code patterns**:
  - JavaScript/TypeScript: `eval(`, `innerHTML =`, `dangerouslySetInnerHTML`, `document.write(`
  - Python: `eval(`, `exec(`, `os.system(`, `subprocess.call(` with `shell=True`
  - SQL injection: string concatenation in SQL queries (`"SELECT * FROM " + `, `` `SELECT * FROM ${` ``)
  - Go: `exec.Command(` with user input
- **Missing input validation**: route handlers or API endpoints that use request parameters without validation (search for `req.body`, `req.params`, `req.query` usage without validation middleware).
- **Permissive CORS**: `Access-Control-Allow-Origin: *` or `cors({ origin: '*' })` in non-development config.

Severity guide: hardcoded secrets = critical, .env exposure = critical, unsafe code patterns = high, missing input validation = high, permissive CORS = medium.

---

#### Category 8: Observability Gaps (`observability-gaps`)

Search for:

- **No structured logging**: no imports of logging libraries (`winston`, `pino`, `bunyan`, `logging` (Python), `log` (Go), `log4j`, `slog`). Only `console.log` or `print`.
- **No error tracking**: no Sentry, Bugsnag, Rollbar, Honeybadger, or equivalent integration.
- **No metrics**: no Prometheus client, StatsD, DataDog, OpenTelemetry metrics imports.
- **No tracing**: no OpenTelemetry tracing, Jaeger, Zipkin, or X-Ray imports.
- **Empty catch blocks**: `catch` blocks that swallow errors silently (no logging, no re-throw).
- **Missing health check**: no `/health`, `/healthz`, `/ready`, or `/readiness` endpoint.

Severity guide: no structured logging = high, no error tracking = medium, no metrics = medium, no tracing = low (depends on project type), empty catch blocks = high, no health check = low.

---

### Step 3: Compile Inventory

After scanning all categories (or the requested category):

1. **Assign IDs**: start from `TD-001` (or continue from the highest existing ID if updating).
2. **Deduplicate**: if multiple scans flagged the same file/line, merge into one item.
3. **Calculate health score**: `score = 100 - (critical × 10) - (high × 3) - (medium × 1) - (low × 0.5)`, clamped to [0, 100].
4. **Update metadata**: set `last_scan`, `health_score`, `total_items`, and breakdowns.

### Step 4: Handle Existing Items (Incremental Scan)

If `.dev-workflow/tech-debt.yml` already has items:

1. For each existing `open` item, check if the issue still exists at the recorded file/line.
2. If the issue is gone (file deleted, code refactored), set `status: fixed` and `fixed: <today>`.
3. If the issue still exists, leave it as-is.
4. Add new items discovered in this scan.
5. Do NOT remove items with `status: fixed` or `status: wont-fix` — they are historical records.

### Step 5: Write Output

1. Write the updated `.dev-workflow/tech-debt.yml` using the format from `.dev-workflow/templates/tech-debt.yml`.
2. Print a summary report to the user:

```
## Codebase Health Report

**Health Score**: <score>/100
**Total Items**: <N> (<X> new, <Y> resolved since last scan)

| Category            | Critical | High | Medium | Low |
|---------------------|----------|------|--------|-----|
| Code Quality        | ...      | ...  | ...    | ... |
| Testing Gaps        | ...      | ...  | ...    | ... |
| Dependency Health   | ...      | ...  | ...    | ... |
| Architecture Smells | ...      | ...  | ...    | ... |
| DevOps Gaps         | ...      | ...  | ...    | ... |
| Documentation Gaps  | ...      | ...  | ...    | ... |
| Security Concerns   | ...      | ...  | ...    | ... |
| Observability Gaps  | ...      | ...  | ...    | ... |

### Top Priority Items
1. [CRITICAL] TD-XXX — <title> (<file>)
2. [CRITICAL] TD-XXX — <title> (<file>)
3. [HIGH] TD-XXX — <title> (<file>)
...

### Recommended Next Steps
- Fix <N> critical issues immediately
- Run /dev-workflow:onboard to generate codebase-aware CLAUDE.md/AGENTS.md
- Schedule a tech debt sprint for <N> high-severity items
```

## Rules

- Be thorough but pragmatic. Not every pattern is debt — use judgment about project context.
- Do not flag vendored, generated, or third-party code (check for `vendor/`, `node_modules/`, `dist/`, `build/`, `.next/`, `__pycache__/`, `generated/`).
- Do not flag test files for code quality issues (long test files are normal).
- Do not flag configuration files for documentation gaps.
- When uncertain about severity, err on the side of lower severity. The developer can upgrade.
- For large codebases (>500 source files), sample rather than exhaustively scanning. Note the sampling in the report.

## Output

Updated `.dev-workflow/tech-debt.yml` with all findings, plus a summary report printed to the user.
