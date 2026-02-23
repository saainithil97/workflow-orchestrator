---
name: tools
description: Browse, recommend, and configure MCP servers and developer tools for your project. Reads the tools catalog, matches recommendations to your stack, and provides install instructions.
argument-hint: "[category|stage|list]"
context: fork
---

# Tools & MCP Server Browser

You are helping the developer discover and configure tools for their project.

## Data Source

Read the tools catalog at `.dev-workflow/tools-catalog.yml`. This file contains all recommended MCP servers and tools organized by category.

## Modes

### No argument or "list"

Show a summary table of all categories and tool counts from the catalog. Ask which category or workflow stage the developer wants to explore.

### Category name (e.g., "database", "observability", "testing")

List all tools in that category with: name, description, install command, and which workflow stages they help with.

### Stage name (e.g., "implement", "review", "staging")

Filter the catalog for tools that have the given stage in their `stages` array. Present them grouped by category.

### "recommend"

1. Read `.dev-workflow/preferences.yml` to understand the project stack
2. Based on language, framework, database, CI/CD platform, and dashboard platform, recommend the most relevant tools
3. For each recommendation, explain WHY it helps this specific project
4. Provide ready-to-run install commands

### "configure"

1. Read `.dev-workflow/preferences.yml` under `tools.mcp_servers`
2. Show what's currently configured
3. Ask what the developer wants to add or remove
4. Update `preferences.yml` with their choices

## Output Rules

- Always show the install command for each tool
- If a tool requires environment variables (has `env` field), mention which ones
- Never require any tool — always note that the workflow works without it
- If suggesting a tool the team hasn't discussed, ask before adding to preferences
- Group output by category when showing multiple tools
