---
description: View, update, or initialize developer and team preferences
---

Manage development workflow preferences.

## Process

1. Read `.dev-workflow/preferences.yml`
2. Ask the developer: **View**, **Update**, or **Initialize** preferences?

### Initialize (guided walkthrough)

Walk through each category, recommending based on codebase analysis:

- **Project**: name, language, framework, package_manager
- **Testing**: framework, location, coverage targets, e2e framework
- **Observability**: otel_exporter, otel_endpoint, logging_library, metrics_format
- **Monitoring**: dashboard_platform, alert_notification
- **Documentation**: api_format, adr_format, doc_comment_style
- **Code Quality**: linter, formatter, max_function_length, max_file_length
- **Workflow**: branching_strategy, commit_convention, review_dimensions
- **Staging**: url, deploy_command, integration_test_command, e2e_test_command, ci_cd

For each preference: state the recommendation with rationale, ask the developer, accept their choice. If they choose differently, add a comment noting the recommendation.

Save to `.dev-workflow/preferences.yml`.
