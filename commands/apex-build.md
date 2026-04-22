---
name: apex-build
description: Builds Apex classes, triggers, and test classes from requirements. Invokes the sf-apex-builder agent after gathering context and loading the sf-apex-patterns skill. Use this command whenever a user wants to write Apex code.
---

# /apex-build

Build Apex code interactively.

## Pre-checks

1. Ask Jake:
   - Purpose of the Apex code
   - Target object(s)
   - Whether this extends an existing trigger handler or service class
   - Any specific patterns or requirements

2. Load the `sf-apex-patterns` skill before handing off to the agent.

3. Search the project for existing handlers on the same object.

## Execution

Invoke the `sf-apex-builder` agent with the gathered context.

## Post-actions

After the agent completes:
- Report the file paths of the generated .cls and test class files
- Print the testing checklist
- Offer to invoke `/deploy` for sandbox validation
