---
description: Gather and clarify a feature requirement with structured questions and BDD acceptance criteria
agent: architect
subtask: true
---

Gather requirements for feature: $ARGUMENTS

## Instructions

1. Read `.dev-workflow/preferences.yml` for team preferences
2. Read `.dev-workflow/learnings/LEARNINGS.md` for past learnings
3. Check if `docs/requirements/$ARGUMENTS.md` already exists

## Requirement Gathering Process

Ask the developer at minimum:
1. Who are the users/consumers?
2. What is the expected behavior? Walk through the primary use case.
3. Why is this needed? What problem does it solve?
4. What does success look like?
5. What are the constraints (time, tech, compliance)?
6. What is explicitly out of scope?
7. Performance requirements?
8. Monitoring/alerting requirements?
9. Dependencies on other features/services/teams?
10. Security considerations?

If `.dev-workflow/preferences.yml` is missing language/framework/test preferences, ask now with recommendations and save answers.

## Output Format

Use the template at `.dev-workflow/templates/requirement.md`. Write acceptance criteria in BDD format (Given/When/Then). Write at least one scenario for: happy path, error case, edge case, security case.

Present the document for approval. Once approved, set `status: approved`, all checklist items `done: true`, `completion.percentage: 100`. Save to `docs/requirements/$ARGUMENTS.md`.
