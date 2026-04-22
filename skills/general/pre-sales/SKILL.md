---
name: pre-sales
description: Solution architecture for pre-sales, discovery-to-proposal workflow, and demo strategy for Salesforce consulting engagements. Load this skill before working on any pre-sales activities. PENDING Canidium voice and differentiator context from Claude.ai.
---

# Pre-Sales Skill

**Status: Partially complete.** This skill provides general pre-sales patterns for Salesforce consulting. It is pending Canidium-specific voice, differentiator, and demo strategy context from a Claude.ai consultation session. See docs/PENDING_DOCUMENT_TASKS.md.

## Pre-Sales Workflow

### 1. Lead Qualification
- Understand the opportunity source (RFP, referral, inbound)
- Assess fit: technology stack, budget range, timeline, org complexity
- Identify decision makers and influencers

### 2. Discovery Session
- Use /can-discover to run a structured session
- Output: discovery notes document
- Duration: typically 1-3 sessions depending on complexity

### 3. Solution Architecture
- Map requirements to Salesforce capabilities
- Identify which clouds, features, and integrations are needed
- Estimate effort by phase
- Flag risks and assumptions

### 4. Proposal Drafting
- Use /can-proposal to generate from discovery notes
- Structure: executive summary, client needs, solution, differentiators, team, timeline, investment
- Review cycle: internal review, then client presentation

### 5. SOW Finalization
- Use /can-sow after proposal approval
- Pricing gate: Jake confirms all numbers before they go in the document
- Legal review if required

## Demo Strategy
- Always demo in a sandbox, never production
- Prepare demo data that mirrors the client's domain
- Focus on 3 key pain points from discovery
- Show the "before" state briefly, then the "after" state
- Have a backup plan if the demo environment is slow or unavailable

## Qualification Criteria
When evaluating whether to pursue an opportunity:
- Is this within Canidium's core competency?
- Is the timeline realistic?
- Is the budget aligned with the scope?
- Does the client have the organizational readiness?
- Are there red flags (unrealistic expectations, decision-by-committee, no budget)?

## Related Skills (load alongside this one)
- **pm-company-research**: Use before discovery to build a client intelligence brief with executive quotes, product strategy, and org context
- **pm-positioning-statement**: Use the Geoffrey Moore framework (For / that need / is a / that / Unlike / provides) to sharpen proposal positioning
- **pm-press-release**: Use the Amazon Working Backwards format to define and test the solution vision before committing to scope
- **pm-epic-hypothesis**: Use when framing project phases as testable hypotheses with validation criteria

## References
- General Salesforce consulting pre-sales best practices
- deanpeters/Product-Manager-Skills (company-research, positioning, press-release, epic-hypothesis frameworks)
- Pending: Canidium voice, standard differentiators, and pricing philosophy from Claude.ai
