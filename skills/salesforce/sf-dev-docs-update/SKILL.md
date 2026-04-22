<!-- source: https://github.com/ehebert7/salesforce-claude-framework -->
---
name: sf-dev-docs-update
description: Updates the active Salesforce dev docs (context, tasks) before compacting or ending a session. Load when closing out work on an in-progress feature or prepping context for handoff.
---

# Salesforce Dev Docs Update

Update dev docs before compacting or ending session:

1. Find active task in `dev/active/`
2. Update `[task-name]-context.md`:
   - Set "Last Updated" to current timestamp
   - Update "Current State" with progress
   - Update "Next Steps" with what to do next
   - Add any new "Important Decisions Made"
3. Update `[task-name]-tasks.md`:
   - Move completed items to "Completed" section
   - Update "In Progress" with current work
4. Confirm updates to user
