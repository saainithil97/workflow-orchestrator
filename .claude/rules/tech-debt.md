# Tech Debt & Broken Windows

## The Rule

**Fix broken windows in files you touch.** When you edit a file that has known tech debt, fix the debt as part of your work. Do not leave it worse than you found it.

## How It Works

1. **Before editing any file**, check `.dev-workflow/tech-debt.yml` for `open` items matching that file path.
2. **Check adjacent files too**: the corresponding test file (e.g., `auth.ts` → `auth.test.ts`, `auth_test.go`) and files that the modified file directly imports from (one hop only).
3. **Fix items scoped to your work**: fix `open` items where `effort` is `small` or `medium`. Leave `large`-effort items alone — those need their own requirement/LLD cycle.
4. **Update the tracker**: when you fix an item, set `status: fixed` and `fixed: <YYYY-MM-DD>` in `.dev-workflow/tech-debt.yml`.
5. **Report what you fixed**: at the end of your work, note which tech debt items you resolved in the commit message or LLD implementation notes.

## Boundaries — What NOT to Do

- **Do not fix debt in files you are not already touching.** Opportunistic fixes only.
- **Do not spend more than ~20% of task time on debt fixes.** If a fix would take significant effort, change the item's `status` to `in-progress` and move on.
- **Do not refactor beyond the item's `suggested_fix`.** Stick to what was cataloged.
- **Do not introduce new patterns to fix old debt.** Use the project's existing conventions.
- **Do not fix `wont-fix` items.** Those were intentionally deprioritized.

## When You Find NEW Debt

If you discover tech debt that is not in `tech-debt.yml` while working:

1. Add it as a new item with the next available `TD-XXX` ID.
2. Set `status: open`, `found: <today>`, and estimate `effort` and `severity`.
3. If it is in a file you are already modifying AND it is `small` effort, fix it immediately and set `status: fixed`.
4. Otherwise, leave it `open` for a future pass.

## Priority Order for Fixes

When multiple debt items exist in a file, fix in this order:

1. **Security concerns** — always fix, regardless of effort
2. **Critical severity** — fix if `small` or `medium` effort
3. **High severity** — fix if `small` effort, attempt `medium` if time allows
4. **Medium/low severity** — fix only `small` effort items

## Tech Debt Categories

| Category | Examples |
|----------|---------|
| `code-quality` | Long functions, deep nesting, dead code, `any` types, TODO/FIXME comments |
| `testing-gaps` | Missing tests, low coverage, no test infrastructure |
| `dependency-health` | Outdated deps, missing lockfile, unused dependencies |
| `architecture-smells` | God files, circular imports, mixed concerns, barrel re-exports |
| `devops-gaps` | Missing CI/CD, no linting, no formatting, no pre-commit hooks |
| `documentation-gaps` | Missing README, undocumented APIs, stale comments |
| `security-concerns` | Hardcoded secrets, unsafe patterns, missing input validation |
| `observability-gaps` | No logging, no metrics, no tracing, no error tracking |

## Health Score

The health score in `tech-debt.yml` metadata is 0–100, calculated as:

```
score = 100 - (critical × 10) - (high × 3) - (medium × 1) - (low × 0.5)
```

Clamped to [0, 100]. A score below 50 indicates significant accumulated debt.
