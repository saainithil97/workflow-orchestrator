---
name: tools
description: Browse, recommend, and configure MCP servers and developer tools.
argument-hint: "[category|stage|list|recommend|configure]"
---

# Tools & MCP Server Browser

Read `.dev-workflow/tools-catalog.yml` for the full catalog of recommended tools.

## Usage

- **No argument / "list"**: Show all categories and tools.
- **Category name** (e.g., "database"): List tools in that category with install commands.
- **Stage name** (e.g., "staging"): Show tools relevant to that workflow stage.
- **"recommend"**: Read preferences and suggest tools matching the project stack.
- **"configure"**: View/update `tools.mcp_servers` in preferences.yml.

## Rules

- Always show install commands.
- Note required environment variables if any.
- Never require any tool — the workflow works without them.
- Ask before adding tools to preferences.
