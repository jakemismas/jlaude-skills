---
name: can-sow
description: Drafts a Canidium Statement of Work from proposals or discovery notes. Invokes the sow-drafter agent with a pricing gate. Use this command whenever a user wants to create or draft a SOW.
---

# /can-sow

Draft a Canidium Statement of Work.

**Note:** The sow-drafter agent needs the actual Canidium SOW template and standard phases from Claude.ai before this command is fully effective. See docs/PENDING_DOCUMENT_TASKS.md for the consultation prompt.

## Pre-checks

1. Ask Jake to confirm:
   - Input document (approved proposal or discovery notes)
   - Agreed scope summary
   - Whether pricing has been confirmed

2. **Pricing gate:** If Jake has not confirmed pricing, STOP. Do not proceed. Ask Jake to confirm pricing numbers before continuing. Never output pricing without confirmation.

3. Load the `sow-generator` skill before handing off to the agent.

## Execution

Invoke the `sow-drafter` agent with the gathered context and confirmed pricing.

## Post-actions

After the agent completes:
- Output the document path in .claude-working/
- Output a review checklist of sections that need Jake's sign-off
- List every section marked [JAKE REVIEW REQUIRED]
- Remind Jake this is a draft, not client-ready without his review
