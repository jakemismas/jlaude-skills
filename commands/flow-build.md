---
name: flow-build
description: Builds a Salesforce Flow from requirements. Invokes the sf-flow-builder agent after gathering context and loading the sf-flow skill. Use this command whenever a user says they want to build, create, or generate a Flow.
---

# /flow-build

Build a Salesforce Flow interactively.

## Pre-checks

1. Ask Jake:
   - What do you want to build? (free text description)
   - Which org/sandbox should I pull metadata from? (org alias)
   - Is there an existing flow to reference or extend?

2. Load the `sf-flow` skill before handing off to the agent.

3. Verify the target org alias is a sandbox, not production.

## Execution

Invoke the `sf-flow-builder` agent with the gathered context.

## Post-actions

After the agent completes:
- Remind Jake to validate the flow in the target sandbox
- Offer to invoke `/deploy` for the sandbox validation step
- Report the file path of the generated .flow-meta.xml
- Print the testing checklist from the agent output
