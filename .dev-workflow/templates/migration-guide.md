# Migration Guide: <Title>

## Metadata

| Field | Value |
|-------|-------|
| **Version** | <from version> → <to version> |
| **Type** | Breaking / Non-breaking |
| **Affected** | <who is affected — services, teams, users> |
| **ADR** | `docs/adr/NNN-<related>.md` |
| **Author** | <name> |
| **Date** | <YYYY-MM-DD> |
| **Deadline** | <YYYY-MM-DD — when old behavior is removed> |

## Summary

One paragraph describing what changed and why. Include a link to the ADR or design document that motivated the change.

## Who Is Affected

- **Service X consumers**: If you call `POST /api/v1/resource`, this endpoint's request body has changed
- **Database clients**: If you read from the `resources` table directly, the schema has changed
- **Configuration**: If you set `CONFIG_KEY`, it has been renamed to `NEW_CONFIG_KEY`

## What Changed

### Before

```json
{
  "old_field": "value"
}
```

### After

```json
{
  "new_field": "value"
}
```

### Changes Summary

| What | Before | After | Breaking? |
|------|--------|-------|-----------|
| Field name | `old_field` | `new_field` | Yes |
| Response code | 200 | 201 | Yes |
| Config key | `CONFIG_KEY` | `NEW_CONFIG_KEY` | Yes |

## Migration Steps

Follow these steps in order. Each step is designed to be safe and reversible.

### Step 1: <Title>

**What**: <what to do>
**Why**: <why this step is needed>

```bash
# Exact command to run
<command>
```

Expected output:
```
<what you should see>
```

### Step 2: <Title>

**What**: <what to do>

```bash
<command>
```

### Step 3: Verify Migration

```bash
# Verify the migration was successful
<verification command>

# Expected: <what success looks like>
```

## Rollback Plan

If something goes wrong, follow these steps to revert:

### Step 1: <Revert action>

```bash
<exact rollback command>
```

### Step 2: Verify Rollback

```bash
<verification that rollback worked>
```

## Timeline

| Date | Event |
|------|-------|
| <YYYY-MM-DD> | Migration guide published |
| <YYYY-MM-DD> | New version available (old still works) |
| <YYYY-MM-DD> | Deprecation warnings enabled for old behavior |
| <YYYY-MM-DD> | **Old behavior removed** — migration must be complete |

## FAQ

### Q: What happens if I don't migrate by the deadline?

A: <consequences — e.g., your requests will return 400, your queries will fail>

### Q: Can I migrate incrementally?

A: <yes/no and guidance>

### Q: Who do I contact if I have issues?

A: <team/person/channel>
