# Before Starting Any Work

Every agent and skill MUST perform these steps before beginning work:

1. **Read preferences**: Load `.dev-workflow/preferences.yml` for team settings (language, framework, test runner, logging, OTel exporter, dashboard platform, etc.). If a required preference is missing, ask the developer with a recommendation and save their answer.
2. **Read learnings**: Load `.dev-workflow/learnings/LEARNINGS.md` for past mistakes, insights, and patterns. Apply them proactively to the current task.
3. **Run gate check**: Verify the prior stage's document has `status: approved|complete`, `completion.percentage: 100`, and `completion.blockers: []` in its YAML frontmatter. Refuse to proceed if any condition fails.
4. **Check tech debt**: If `.dev-workflow/tech-debt.yml` exists and has items, load it. Cross-reference `open` items against the files you are about to read or edit. Follow the broken windows policy in `@rules/tech-debt.md` — fix small/medium-effort debt in files you touch and their adjacent files (test files, direct imports).
