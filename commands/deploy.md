---
name: deploy
description: Validates Salesforce metadata against a sandbox and prepares a changeset manifest. Invokes the sf-deploy-manager agent. Never deploys to production. Use this command whenever a user wants to validate or deploy Salesforce metadata.
---

# /deploy

Validate metadata in a sandbox and prepare a changeset for production.

## Pre-checks

1. Ask Jake:
   - Which files or components should be deployed?
   - Which sandbox alias should be the target?

2. Confirm explicitly: "This will run validation only against [sandbox]. Jake manually deploys to production via changeset."

3. Verify the target alias is not a production org.

## Execution

Invoke the `sf-deploy-manager` agent with the gathered context.

## Post-actions

After the agent completes:
- Output the changeset manifest (components, descriptions, test steps)
- Output the deployment checklist
- Remind Jake: "Create the changeset in the sandbox UI and promote to production manually."
