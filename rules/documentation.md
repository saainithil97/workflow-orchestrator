# Documentation Standards

Documentation is a deliverable, not an afterthought. Every feature ships with documentation that is accurate, complete, and maintained alongside the code.

## Documentation Types

### Design Documents (docs/)

| Type | Location | Template | When Created |
|------|----------|----------|-------------|
| Requirement | `docs/requirements/<feature>.md` | `.dev-workflow/templates/requirement.md` | `/requirement` stage |
| HLD | `docs/hld/<feature>.md` | `.dev-workflow/templates/hld.md` | `/hld` stage |
| LLD | `docs/lld/<feature>.md` | `.dev-workflow/templates/lld.md` | `/lld` stage |
| ADR | `docs/adr/NNN-<title>.md` | `.dev-workflow/templates/adr.md` | During `/hld` for key decisions |
| Runbook | `docs/runbooks/<service>-<scenario>.md` | `.dev-workflow/templates/runbook.md` | During `/docs` stage |
| Migration Guide | `docs/migrations/NNN-<title>.md` | `.dev-workflow/templates/migration-guide.md` | When breaking changes are introduced |
| Dashboard Spec | `docs/dashboards/<name>.<platform>.json\|yml` | `.dev-workflow/templates/dashboard.yml` | During `/observe` stage |
| Observability Spec | `docs/observability/<feature>.md` | N/A (generated from LLD) | During `/lld` stage |

### Code Documentation

| Type | Standard |
|------|----------|
| **Inline comments** | Explain WHY, not WHAT. The code explains what; comments explain non-obvious reasoning, business rules, and workarounds |
| **Function/method docs** | Public functions have a doc comment: what it does, parameters, return value, errors thrown, example usage |
| **Module docs** | Each module/package has a top-level doc comment: purpose, key exports, usage example |
| **Type docs** | Complex types, interfaces, and enums have doc comments explaining each field/variant |
| **README** | Every package/service has a README with: purpose, setup, usage, configuration, deployment |

### API Documentation

| Format | When |
|--------|------|
| **OpenAPI/Swagger** | REST APIs — generate from code annotations or maintain spec file |
| **GraphQL Schema** | GraphQL APIs — schema is self-documenting, add descriptions to types and fields |
| **Protocol Buffers** | gRPC — add comments to proto files |
| **JSDoc/TSDoc/Rustdoc/Godoc** | Language-native doc generation |

Check `.dev-workflow/preferences.yml` for `api_doc_format`. If not set, ask the developer.

## Documentation Sync Rules

1. **Design docs track implementation.** If the implementation deviates from the HLD/LLD (it often will), update the design doc to reflect what was actually built. Mark deviations clearly: `> DEVIATION: Originally planned X, implemented Y because Z.`

2. **Runbooks are mandatory for critical paths.** Every alert rule must have a corresponding runbook. Every deployment procedure must have a runbook. Every data migration must have a runbook.

3. **Migration guides are mandatory for breaking changes.** Any change to a public API, database schema, configuration format, or deployment procedure that affects consumers requires a migration guide.

4. **ADRs are immutable once accepted.** Do not edit accepted ADRs. If a decision is reversed, create a new ADR that supersedes the old one.

5. **Dashboard definitions are code.** Dashboard JSON/YAML lives in version control and is deployed via CI/CD, not manually created in a UI.

## Runbook Structure

Every runbook follows this structure (see template):

1. **Title & Metadata**: What system, what scenario, severity, last tested
2. **Symptoms**: How to recognize this issue (alerts, logs, user reports)
3. **Diagnosis**: Step-by-step investigation commands
4. **Remediation**: Step-by-step fix with exact commands
5. **Verification**: How to confirm the fix worked
6. **Escalation**: When and who to escalate to
7. **Post-incident**: Checklist for after resolution
8. **Prevention**: What to do to prevent recurrence

## Migration Guide Structure

Every migration guide follows this structure (see template):

1. **Title & Metadata**: What changed, breaking/non-breaking, affected versions
2. **Summary**: One-paragraph description of the change
3. **Who Is Affected**: Which consumers, services, or users
4. **Migration Steps**: Numbered, copy-pasteable steps
5. **Rollback Plan**: How to undo the migration if something goes wrong
6. **Timeline**: When the old behavior will be removed
7. **FAQ**: Common questions

## When to Update Documentation

| Event | Documentation Action |
|-------|---------------------|
| New feature implemented | Requirement + HLD + LLD + API docs + README + runbooks + dashboards |
| Bug fixed | Update LLD if design was wrong. Update runbook if it describes a workaround |
| Breaking API change | Migration guide + API doc update + ADR |
| New alert added | Corresponding runbook |
| Configuration changed | README + deployment docs |
| Dependency updated | If API changed, migration guide |
| Feature deprecated | ADR + migration guide + deprecation notice in API docs |

## Doc Review During `/docs` Stage

The `/docs` command verifies:

1. All design documents exist and have correct frontmatter
2. Design documents match the actual implementation (no stale content)
3. Every public function/method has a doc comment
4. Every API endpoint is documented in the API spec
5. Every alert has a runbook
6. Every breaking change has a migration guide
7. README is up to date
8. Dashboard definitions exist and are syntactically valid
