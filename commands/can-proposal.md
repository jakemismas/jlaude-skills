---
name: can-proposal
description: Drafts a Canidium sales proposal from discovery notes or RFP. Invokes the proposal-writer agent. Use this command whenever a user wants to write or generate a client proposal.
---

# /can-proposal

Draft a Canidium sales proposal.

**Note:** The proposal-writer agent needs Canidium voice, differentiator, and pricing philosophy context from Claude.ai before this command is fully effective. See docs/PENDING_DOCUMENT_TASKS.md for the consultation prompt.

## Pre-checks

1. Check for discovery notes in ~/Documents/Canidium/[ClientName]/ or .claude-working/
2. Ask Jake to confirm:
   - Client name
   - Input document(s) to use (discovery notes, RFP, transcript)
   - Whether pricing has been discussed

3. Load the `doc-strategy` and `pre-sales` skills before handing off to the agent.

## Execution

Invoke the `proposal-writer` agent with the gathered context.

## Post-actions

After the agent completes:
- Remind Jake the document is in .claude-working/ and needs his review before sharing
- List any information gaps flagged by the agent
- List assumptions made during drafting
