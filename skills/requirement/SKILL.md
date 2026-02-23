---
name: requirement
description: Gather, clarify, and document a feature requirement. Asks structured questions, captures acceptance criteria in BDD format, identifies constraints and dependencies. Use when starting work on a new feature.
argument-hint: "[feature-name]"
context: fork
agent: architect
---

# Requirement Gathering

You are gathering requirements for feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md`, then check if `docs/requirements/$ARGUMENTS.md` already exists — if so, read it and ask if the developer wants to update it or start fresh.

## Gate Check

This is the first stage — no prerequisites required.

## Process

### Step 1: Initial Understanding

Read the developer's description. Then ask clarifying questions. You MUST ask at minimum:

1. **Who** are the users/consumers of this feature? (End users, other services, internal tools?)
2. **What** is the expected behavior? Can you walk me through the primary use case step by step?
3. **Why** is this needed? What problem does it solve? What is the impact of NOT building it?
4. **What does success look like?** How will you know this feature works correctly?
5. **What are the constraints?** (Time, technology, compliance, budget, team size)
6. **What is explicitly out of scope?** What should this feature NOT do?
7. **Are there performance requirements?** Expected load, latency targets, data volume?
8. **Are there monitoring/alerting requirements?** What should we observe in production?
9. **Are there dependencies?** Other features, services, or teams this depends on?
10. **Are there security considerations?** Authentication, authorization, data sensitivity?

### Step 2: Check Preferences

If `.dev-workflow/preferences.yml` is missing any of these, ask the developer now with a recommendation:

- **Language/framework**: What language and framework is this project using?
- **Test framework**: What testing framework should we use?
- **Logging library**: What structured logging library?
- **OTel exporter**: Where should traces go?
- **Dashboard platform**: Grafana, Datadog, or generic?
- **API doc format**: OpenAPI, GraphQL schema, or other?

Save their answers to `.dev-workflow/preferences.yml`.

### Step 3: Write the Requirement Document

Use the template at `.dev-workflow/templates/requirement.md`. Fill in every section.

Write acceptance criteria in BDD format:
```
### Scenario: <name>
- **Given** <precondition>
- **When** <action>
- **Then** <expected outcome>
```

Write at least one scenario for:
- The primary happy path
- A key error case
- An edge case
- A security-relevant case (if applicable)

### Step 4: Present and Confirm

Present the completed requirement document to the developer. Ask:

1. Is anything missing or incorrect?
2. Are the acceptance criteria complete?
3. Are the constraints accurate?
4. Do you approve this requirement?

### Step 5: Finalize

Once approved:
1. Set `status: approved` in the frontmatter
2. Set all checklist items to `done: true`
3. Set `completion.percentage: 100`
4. Set `approver` to the developer's name or "self-reviewed"
5. Save to `docs/requirements/$ARGUMENTS.md`

## Output

The completed requirement document saved to `docs/requirements/$ARGUMENTS.md`.
