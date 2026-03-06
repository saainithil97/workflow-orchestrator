# Recommended Tools & MCP Servers

When a workflow stage would benefit from an MCP server or external tool, suggest it from the catalog at `.dev-workflow/tools-catalog.yml`. Do NOT require any tool — the workflow must function without them.

## Per-Stage Tool Recommendations

| Stage | Useful MCP Servers | Why |
|-------|-------------------|-----|
| Requirement | `context7`, `web-search` | Research prior art, fetch specs |
| HLD | `github`, `gitlab` | Read issues, PRs, existing architecture |
| LLD | `filesystem`, `github` | Explore codebase structure, read file trees |
| Implement | `filesystem`, `git`, `docker` | Write code, manage containers |
| Review | `git`, `github` | Diff changes, check CI status |
| Staging | `docker`, `kubernetes`, `grafana` | Deploy, verify dashboards |
| Docs | `filesystem`, `web-fetch` | Write docs, validate links |
| Retro | None required | Reflection only |

## How to Use

1. Check `.dev-workflow/preferences.yml` for `tools.mcp_servers` — the team may have already chosen their MCP servers.
2. If a stage would benefit from an MCP server not yet configured, suggest it with install instructions from the catalog.
3. Never block on tool availability — always provide a manual fallback.
