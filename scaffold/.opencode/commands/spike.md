---
description: Time-boxed investigation of a technical question — hypothesis, minimal code, decision
agent: architect
subtask: true
---

Run a spike for: $ARGUMENTS

## Instructions

Parse `$ARGUMENTS` as `<topic> <question>`. If no question, ask for one.

1. Read `.dev-workflow/preferences.yml` for language/framework
2. Read `.learn/topics/<topic>/state.yml` if exists
3. Check `.learn/topics/<topic>/decisions.yml` — question may already be answered

## Process

1. **Define**: Agree on hypothesis (falsifiable), scope (minimum code), timebox (default 30min)
2. **Build**: Create `.learn/topics/<topic>/spikes/<spike-name>/` with disposable, runnable code. Build collaboratively.
3. **Observe**: Run it. "Does this answer the question? Anything surprising?"
4. **Record**: Write spike README (hypothesis, result, finding, decision, run command). Append to `decisions.yml`. Update `state.yml` and `journal.md`.

## Rules

- Spikes answer questions. They don't build features.
- Code is disposable. The decision is the artifact.
- Respect the timebox. If it's too big, break the question down.
