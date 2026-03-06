---
name: hld
description: Create a High-Level Design document for a feature. Analyzes the codebase, designs architecture with C4 diagrams, documents API contracts, technology decisions (ADRs), observability strategy, and non-functional requirements. Use after requirement is approved.
argument-hint: "[feature-name]"
context: fork
agent: architect
---

# High-Level Design

You are creating an HLD for feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md`.

## Pipeline Skip Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md` (preset + per-stage overrides + per-feature overrides from `docs/requirements/$ARGUMENTS.md` if it exists).

If `hld` is **disabled** in the effective pipeline:
- Print: "HLD stage is disabled in pipeline configuration (preset: <preset>). Skipping."
- Exit. The `/lld` stage will gate on the requirement doc instead.

## Gate Check

Follow the gate check protocol from `@rules/workflow.md` for this stage.

Read `docs/requirements/$ARGUMENTS.md` and verify:
- `status` is `approved` or `complete`
- `completion.percentage` is `100`
- `completion.blockers` is empty

If ANY condition fails: print what is missing, refuse to proceed, and suggest running `/requirement $ARGUMENTS` first.

## Process

### Step 1: Understand the Requirement

Read `docs/requirements/$ARGUMENTS.md` thoroughly. Identify:
- The primary use cases
- The acceptance criteria (these constrain your design)
- The constraints (these limit your options)
- The non-functional requirements (these drive architecture)

### Step 2: Explore the Existing Codebase

Before designing anything, understand what exists:
- What is the project structure? (monorepo, microservices, monolith?)
- What patterns are used? (MVC, hexagonal, event-driven?)
- What technologies are in use? (database, cache, queue, auth?)
- What observability exists? (logging, tracing, metrics?)
- Where would the new feature fit architecturally?

### Step 3: Design

Using the template at `.dev-workflow/templates/hld.md`, create the design:

1. **Context View**: ASCII diagram showing how the feature fits in the overall system. Show actors, external systems, and communication protocols.

2. **Container View**: ASCII diagram showing the deployable units involved. Show which containers are new vs modified.

3. **Component View**: For each modified container, ASCII diagram showing internal components. Focus on the new/changed components.

4. **Data Flow**: Step-by-step description of the primary use case flowing through the system.

5. **Data Model**: New or modified entities with fields, types, and relationships.

6. **API Contract**: New or modified endpoints with method, path, request/response shapes, auth requirements.

7. **Technology Decisions**: For each significant choice, create an inline ADR:
   - What decision was made and why
   - What alternatives were considered
   - What are the trade-offs
   - Also create standalone ADRs in `docs/adr/` for decisions that affect the broader system

8. **Observability Architecture**:
   - What spans are needed (name, attributes, parent-child relationships)
   - What metrics to emit (name, type, labels)
   - What log events at what levels
   - What dashboards to create
   - What alert rules and thresholds
   - Link to runbooks for each alert

9. **Non-Functional Requirements**: For each NFR from the requirement, specify the approach:
   - Performance: latency targets, throughput, caching strategy
   - Availability: redundancy, circuit breakers, retry policy
   - Security: auth model, encryption, input validation
   - Scalability: horizontal scaling, sharding, partitioning

10. **Risks & Mitigations**: What could go wrong and how to address it.

### Step 4: Ask for Missing Preferences

If any technology decisions require preferences not in `.dev-workflow/preferences.yml`, ask the developer with a recommendation. Save their answers.

### Step 5: Present and Confirm

Present the HLD to the developer. Ask:
1. Does the architecture make sense for your team and constraints?
2. Are the technology decisions acceptable?
3. Is the observability strategy sufficient?
4. Are there any risks I missed?
5. Do you approve this HLD?

### Step 6: Finalize

Once approved:
1. Set `status: approved` in frontmatter
2. Set all checklist items to `done: true`
3. Set `completion.percentage: 100`
4. Save to `docs/hld/$ARGUMENTS.md`
5. Save any standalone ADRs to `docs/adr/`

## Output

The completed HLD at `docs/hld/$ARGUMENTS.md` and any ADRs in `docs/adr/`.
