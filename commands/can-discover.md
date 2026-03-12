---
name: can-discover
description: Runs a structured Canidium-style client discovery session. Invokes the discovery-facilitator agent to capture requirements interactively. Use this command whenever starting a new client discovery or requirements gathering session.
---

# /can-discover

Run a structured client discovery session.

## Pre-checks

1. Ask Jake:
   - Client name
   - Project type (implementation, optimization, migration, integration)
   - Any context or prior documents already available

2. Load the `canidium-discovery` skill before handing off to the agent.

## Execution

Invoke the `discovery-facilitator` agent with the gathered context.

## Post-actions

After the agent completes:
- Output the path to the discovery document
- Offer to invoke `/can-proposal` to draft a proposal from the discovery notes
- Offer to invoke `/can-sow` to draft a SOW from the discovery notes
