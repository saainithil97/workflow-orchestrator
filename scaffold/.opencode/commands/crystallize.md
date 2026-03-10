---
description: Transition from exploration to building — synthesize learnings into a draft requirement
agent: architect
subtask: true
---

Crystallize exploration of: $ARGUMENTS

## Instructions

1. Read `.dev-workflow/preferences.yml`
2. Read all artifacts: `.learn/topics/$ARGUMENTS/state.yml`, `journal.md`, `decisions.yml`, `spikes/*/README.md`
3. If insufficient exploration (< 2 explored items, no decisions), suggest exploring more first

## Process

1. **Synthesize**: Present what was learned — explored areas, key decisions, open questions, original goal. Ask: "Has your goal changed? What do you actually want to build?"
2. **Scope**: Challenge scope — MVP, users, risk, differentiation. Push back on gold-plating.
3. **Map**: Decisions → technical constraints. Frontier gaps → scope boundaries or risk items. Shaky concepts → review attention areas.
4. **Draft**: Write requirement using `.dev-workflow/templates/requirement.md`. Include an "Exploration Context" section with decision table, spike references, and untested assumptions.
5. **Decide**: User approves draft (save as `approved` to `docs/requirements/`) or runs `/requirement <name>` to refine further.
6. **Update**: Set learning state to `applying`, link to feature name.
