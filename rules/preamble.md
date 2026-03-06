# Before Starting Any Work

Every agent and skill MUST perform these steps before beginning work:

1. **Read preferences**: Load `.dev-workflow/preferences.yml` for team settings (language, framework, test runner, logging, OTel exporter, dashboard platform, pipeline config, etc.).

   **On first run** (detected by: `language`, `framework`, and `testing.framework` are all missing or commented out):
   - Load only the defaults that are already set (e.g., `workflow.pipeline.preset`)
   - For the current stage, ask only for preferences that stage specifically requires (see table below)
   - Defer all other preferences — do not ask for OTel exporters, dashboard platforms, model routing, etc. during `/requirement`
   - Inform the developer: "Run `/preferences` for full setup. For now I'll ask only what's needed for this stage."

   **Stage-specific minimum preferences:**
   | Stage | Minimum preferences to ask |
   |-------|---------------------------|
   | `/requirement` | `project.language`, `project.framework` |
   | `/hld` | Same as requirement |
   | `/lld` | Same as requirement |
   | `/implement` | `testing.framework`, `project.language` |
   | `/review` | `quality.linter` (optional — skip if not configured) |
   | `/observe` | `observability.otel_exporter`, `observability.logging_library` |
   | `/staging` | `staging.url`, `staging.deploy_command` |
   | `/docs` | None beyond what's already set |
   | `/retro` | None |

   If a **required preference** for the current stage is missing (even on first run), ask for it with a recommendation and save the answer.

2. **Read learnings**: If `.dev-workflow/learnings/LEARNINGS.md` exists and is non-empty, load it for past mistakes, insights, and patterns. Apply them proactively to the current task. Skip this step if the file does not exist or is empty.

3. **Run gate check**: Verify the prior stage's document meets the required conditions per `@rules/workflow.md`. Skip this step for stages with no prerequisites (`/requirement`, `/retro`). When a stage is skipped in the pipeline, gate on the nearest enabled predecessor instead.

4. **Check tech debt**: If `.dev-workflow/tech-debt.yml` exists and has `open` items, load it. Cross-reference against files you are about to read or edit. Follow the broken windows policy in `@rules/tech-debt.md` — fix small/medium-effort debt in files you touch and their adjacent files (test files, direct imports). Skip this step for stages that do not touch code files (`/requirement`, `/hld`, `/retro`).
