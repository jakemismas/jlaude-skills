---
name: canidium-discovery
description: Client discovery process, question frameworks, scope definition, and structured output patterns for consulting engagements. Load this skill before running any discovery or requirements gathering session. PENDING Canidium-specific frameworks from Claude.ai.
---

# Canidium Discovery Skill

**Status: Partially complete.** This skill provides general discovery process patterns. It is pending Canidium-specific question frameworks and sequencing from a Claude.ai consultation session. See docs/PENDING_DOCUMENT_TASKS.md.

## Discovery Process

### Phase 1: Preparation
- Review any available documentation (RFP, prior proposals, org data)
- Identify known stakeholders and their roles
- Prepare a preliminary question list tailored to the project type
- Set expectations for the discovery session format and duration

### Phase 2: Current State Assessment
Questions to ask:
- What systems and tools are in use today?
- What manual processes exist?
- How does data flow between systems?
- What reporting exists and what is missing?
- What has been tried before and why did it succeed or fail?

### Phase 3: Pain Point Identification
- What takes too long?
- What causes errors or rework?
- What information is difficult to access?
- Where do processes break down?
- What are the business costs of these pain points?

### Phase 4: Desired State Definition
- What does success look like in 6 months? 12 months?
- What are the measurable outcomes?
- What is the priority order of improvements?
- What is the minimum viable solution?

### Phase 5: Constraints and Boundaries
- Budget range and timeline expectations
- Technical constraints (org edition, licenses, integrations)
- Organizational constraints (change management readiness, training capacity)
- Compliance or regulatory requirements

### Phase 6: Scope Definition
- Must-have vs. should-have vs. nice-to-have requirements
- Explicit out-of-scope items
- Phase boundaries (what goes in phase 1 vs. later phases)

## Output Structure
See the discovery-facilitator agent for the standard output format.

## Scope Creep Detection
Flag when a requirement:
- Was not mentioned in the original project description
- Requires a new integration not previously discussed
- Affects a team or process not in the original stakeholder list
- Would more than double the estimated effort of a phase

## Related Skills (load alongside this one)
- **pm-jobs-to-be-done**: Use the JTBD framework during Phase 3 (Pain Point Identification) to uncover functional, social, and emotional jobs
- **pm-problem-statement**: Use the "I am / Trying to / But / Because / Which makes me feel" framework to frame discovered problems
- **pm-customer-journey-map**: Use when mapping the client's end-to-end process across systems and teams

## References
- General consulting discovery best practices
- deanpeters/Product-Manager-Skills (JTBD, problem-statement, customer-journey-map frameworks)
- Pending: Canidium-specific discovery frameworks and question sequences from Claude.ai
