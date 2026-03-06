---
name: docs
description: Update all documentation to match the implementation. Syncs design docs, updates README, creates runbooks, migration guides, and validates dashboard definitions. Use after staging validation passes.
argument-hint: "[feature-name]"
context: fork
agent: documenter
---

# Documentation Sync

You are updating documentation for feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md` (note especially: api_doc_format, dashboard_platform in preferences).

Load the full documentation reference: `.dev-workflow/references/documentation.md`

## Pipeline Skip Check

Read `.dev-workflow/preferences.yml`. Resolve the effective pipeline using the rules in `@rules/workflow.md`.

If `docs` is **disabled** in the effective pipeline:
- Print: "Docs stage is disabled in pipeline configuration. Skipping."
- Exit.

## Gate Check

Follow the gate check protocol from `@rules/workflow.md` for this stage.

Read `docs/lld/$ARGUMENTS.md` and verify:
- `review.status` is `pass` or `pass-with-warnings`
- `review.critical_issues` is `0`

If staging ran (check if `staging` key exists in the LLD frontmatter), also verify:
- `staging.status` is `pass`

If not met: refuse to proceed and suggest the appropriate prior step.

## Process

### Step 1: Design Document Sync

For each design document:

#### Requirement (`docs/requirements/$ARGUMENTS.md`)
- Verify acceptance criteria still match what was built
- If any criteria changed during implementation, update the document
- Mark deviations: `> DEVIATION: Originally <X>. Changed to <Y> because <Z>.`

#### HLD (`docs/hld/$ARGUMENTS.md`)
- Verify architecture diagrams match the implementation
- Verify API contracts match actual endpoints
- Verify technology decisions are still accurate
- Update any diagrams that changed during implementation
- Mark deviations clearly

#### LLD (`docs/lld/$ARGUMENTS.md`)
- Verify task list reflects what was actually built
- Verify function signatures match the code
- Ensure all tasks show final status
- Review notes should already be present from `/review`

### Step 2: Code Documentation

Scan all files created or modified for the feature:

1. **Public functions/methods**: Verify each has a doc comment with:
   - Brief description of purpose
   - Parameter descriptions with types
   - Return value description
   - Errors/exceptions that can be thrown
   - Usage example (for complex functions)

2. **Complex logic**: Verify inline comments explain WHY, not WHAT

3. **Module/package level**: Verify top-level doc comment exists with:
   - Module purpose
   - Key exports
   - Usage example

4. **Types/interfaces**: Verify complex fields have doc comments

Add missing documentation. Do NOT add comments that merely restate the code.

### Step 3: API Documentation

If the feature includes new or modified API endpoints:

1. Check the preferred format from preferences (`api_doc_format`)
2. Create or update the API spec:
   - **OpenAPI**: Update/create the spec file with all new endpoints
   - **GraphQL**: Ensure schema has descriptions on types and fields
   - **gRPC**: Ensure proto files have comments
3. Verify: method, path, request body, response body, error codes, auth requirements, examples

### Step 4: README Updates

Review the project README:
- Is the new feature mentioned in the overview?
- Are setup instructions still accurate?
- Are new environment variables documented?
- Are new configuration options documented?
- Are usage examples up to date?

Update as needed. Do not rewrite the entire README — make targeted updates.

### Step 5: Runbooks

For each alert rule defined in the observability spec:
1. Check if a runbook exists in `docs/runbooks/`
2. If missing, create one using `.dev-workflow/templates/runbook.md`
3. If existing, verify it is still accurate

Every critical or warning alert MUST have a runbook. Each runbook must include:
- Symptoms (how to recognize the issue)
- Diagnosis steps (with exact commands)
- Remediation steps (with exact commands)
- Verification (how to confirm the fix)
- Escalation path
- Prevention strategy

### Step 6: Migration Guides

If the feature introduces breaking changes:
1. Create a migration guide using `.dev-workflow/templates/migration-guide.md`
2. Location: `docs/migrations/NNN-<title>.md` (sequential numbering)
3. Must include: what changed, who is affected, step-by-step migration, rollback plan

Breaking changes include:
- Public API changes (endpoint paths, request/response shapes, status codes)
- Database schema changes that affect existing queries
- Configuration format changes
- Removed or renamed features

### Step 7: ADRs

1. Verify all ADRs referenced in the HLD exist in `docs/adr/`
2. Create missing ADRs using `.dev-workflow/templates/adr.md`
3. If any decisions changed during implementation, create a new ADR that supersedes the original
4. ADR numbering: `NNN-<title>.md` (sequential)

### Step 8: Dashboard Definitions

1. Verify dashboard definitions exist in `docs/dashboards/`
2. Validate the format matches the preferred platform
3. Verify metric names in dashboards match actual metric names in code
4. Verify alert rules reference the correct runbooks

### Step 9: Observability Spec

1. Verify `docs/observability/$ARGUMENTS.md` matches the actual instrumentation
2. Update if any spans, metrics, or log events changed during implementation

### Step 10: Final Verification

Run through the documentation checklist:
- [ ] All design documents synced with implementation
- [ ] All public functions have doc comments
- [ ] API spec is complete and accurate
- [ ] README is up to date
- [ ] Runbooks exist for all alerts
- [ ] Migration guides exist for all breaking changes
- [ ] ADRs are complete
- [ ] Dashboards are syntactically valid
- [ ] Observability spec matches implementation
- [ ] No orphan links in any document

## Output

All documentation updated. List of files created/modified. Any gaps flagged.
