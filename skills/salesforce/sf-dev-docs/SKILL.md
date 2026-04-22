<!-- source: https://github.com/ehebert7/salesforce-claude-framework -->
---
name: sf-dev-docs
description: Creates comprehensive dev docs (plan, context, tasks) for an active Salesforce development task. Load when starting a significant feature or when the user asks to document a task in progress.
---

# Salesforce Dev Docs

Create comprehensive dev docs for the current task:

1. Create directory: `dev/active/[task-name]/`
2. Copy and populate templates:
   - `[task-name]-plan.md` from plan-template.md
   - `[task-name]-context.md` from context-template.md
   - `[task-name]-tasks.md` from tasks-template.md
3. Fill in all sections based on the approved plan
4. Confirm creation to user
