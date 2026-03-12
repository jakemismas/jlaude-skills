---
name: lwc-build
description: Builds a Lightning Web Component from requirements. Invokes the sf-lwc-builder agent after gathering context and loading the lwc-patterns skill. Use this command whenever a user wants to create or build an LWC.
---

# /lwc-build

Build a Lightning Web Component interactively.

## Pre-checks

1. Ask Jake:
   - Component name (camelCase)
   - Target page or object (Record Page, App Page, Home Page, etc.)
   - Functional requirements
   - Any existing components to reference

2. Load the `lwc-patterns` skill before handing off to the agent.

## Execution

Invoke the `sf-lwc-builder` agent with the gathered context.

## Post-actions

After the agent completes:
- List any Apex stubs that need to be built
- Offer to invoke `/apex-build` for any required Apex methods
- Report the file paths of the generated LWC bundle
- Print the testing checklist
