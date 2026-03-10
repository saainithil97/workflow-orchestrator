# .learn/

Personal exploration workspace. Used by `/explore`, `/spike`, and `/crystallize`.

## Structure

```
.learn/
  topics/
    <topic>/
      state.yml        # Current position, frontier, stage (~80 tokens)
      journal.md       # Dev log — what was explored, gaps, decisions
      decisions.yml    # Structured decision log from spikes
      spikes/
        <spike-name>/
          README.md    # Hypothesis → Result → Decision
          ...code...   # Disposable spike code
```

## Design Principles

- **Files are memory, context is working memory.** State persists on disk. Each session loads only what's needed (~300-700 tokens).
- **Dev log, not lesson plan.** Journal reads like project notes, not a gradebook.
- **Decisions over notes.** Capture what was decided, not what was explained.
- **Spikes answer questions.** Each spike has a hypothesis and a conclusion. Code is disposable; the decision is the artifact.

## Lifecycle

1. `/explore <topic>` — Creates topic, starts exploration
2. `/spike <topic> <question>` — Runs time-boxed investigation
3. `/crystallize <topic>` — Synthesizes into a draft requirement → feeds into `/requirement`

The `topics/` directory is gitignored by default (personal exploration state). Remove the gitignore entry if you want to share learning artifacts with your team.
