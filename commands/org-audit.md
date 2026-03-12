---
name: org-audit
description: Runs a read-only audit of a Salesforce org for health, technical debt, and risk areas. Invokes the org-auditor agent. Use this command whenever a user wants to assess or audit a Salesforce org.
---

# /org-audit

Audit a Salesforce org for health and technical debt.

## Pre-checks

1. Ask Jake:
   - Which org alias to target
   - Confirm this is read-only access (no modifications will be made)

2. Verify the org alias exists:
   ```
   sf org display --target-org [alias]
   ```

## Execution

Invoke the `org-auditor` agent with the confirmed org alias.

## Post-actions

After the agent completes:
- Output the report file path in .claude-working/
- Print the top 3 critical findings inline
- Suggest prioritized remediation actions
