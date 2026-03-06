---
feature: <feature-name>
stage: requirement
status: draft
version: 1
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
author: <name>
approver: pending
depends_on: []
# Optional: override the project-wide pipeline for this specific feature.
# Only non-mandatory stages can be overridden. Mandatory stages (requirement,
# lld, implement, review) are always enabled.
# pipeline_overrides:
#   hld: false       # skip HLD for this small feature
#   staging: true    # require staging even if project preset omits it
#   observe: true    # add observability step for this feature
#   docs: true
#   retro: true
completion:
  checklist:
    - item: "Problem statement defined"
      done: false
    - item: "User stories or use cases listed"
      done: false
    - item: "Acceptance criteria specified (BDD format)"
      done: false
    - item: "Constraints and assumptions documented"
      done: false
    - item: "Out of scope explicitly stated"
      done: false
    - item: "Dependencies identified"
      done: false
    - item: "Non-functional requirements captured"
      done: false
    - item: "Status set to approved"
      done: false
  percentage: 0
  blockers: []
---

# <Feature Name>

## Problem Statement

What problem does this solve? Who is affected? What is the impact of not solving it?

<Replace with a clear, concise description of the problem.>

## User Stories

- **As a** <role>, **I want** <capability>, **so that** <benefit>
- **As a** <role>, **I want** <capability>, **so that** <benefit>

## Acceptance Criteria

### Scenario: Happy path — <primary use case>
- **Given** <precondition>
- **When** <action>
- **Then** <expected outcome>
- **And** <additional outcome>

### Scenario: Error case — <error description>
- **Given** <precondition>
- **When** <action that causes error>
- **Then** <expected error behavior>

### Scenario: Edge case — <edge description>
- **Given** <unusual but valid precondition>
- **When** <action>
- **Then** <expected behavior>

### Scenario: Security — <security consideration>
- **Given** <security-relevant precondition>
- **When** <potentially malicious action>
- **Then** <expected security behavior>

## Constraints

### Technical
- <constraint>

### Business
- <constraint>

### Regulatory / Compliance
- <constraint or "None identified">

## Dependencies

| Dependency | Type | Status | Notes |
|-----------|------|--------|-------|
| <service/feature> | Service / Feature / Team | Available / In Progress / Blocked | <notes> |

## Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | <latency, throughput targets> |
| Availability | <uptime target> |
| Scalability | <expected load, growth> |
| Security | <auth, encryption, data sensitivity> |
| Observability | <monitoring, alerting needs> |

## Out of Scope

Explicitly list what this feature does NOT cover:

- <item>
- <item>

## Open Questions

- [ ] <question>
- [ ] <question>

## Assumptions

- <assumption>
- <assumption>
