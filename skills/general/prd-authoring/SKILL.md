---
name: prd-authoring
description: Writing AI-optimized Product Requirements Documents (PRDs) that Claude Code can follow to build a full product. Covers PRD structure, phased implementation specs, acceptance criteria, boundary systems, and the Claude Desktop → Claude Code handoff workflow. Load this skill when writing or reviewing a PRD.
---

# PRD Authoring Skill

Patterns for writing Product Requirements Documents optimized for AI coding agents (Claude Code). Based on research from Addy Osmani (Google), David Haberlah, Thoughtworks spec-driven development, and the vibecoding community.

## Core Philosophy

A PRD for AI code generation serves **two audiences**:
1. **Humans** — for alignment, decision-making, and stakeholder buy-in
2. **AI agents** — for implementation, sequencing, and self-verification

Traditional PRDs optimize for human comprehension. AI-optimized PRDs must also be **dependency-ordered, testable, and explicit about boundaries**.

---

## The Two-Stage Workflow

### Stage 1: Claude Desktop (PRD Author)
Use Claude Desktop (or claude.ai Projects) with system instructions to collaboratively write the PRD. The conversation is exploratory — brainstorming, refining scope, challenging assumptions.

**Claude Desktop Project Instructions** (paste into project system prompt):
```
You are a senior product manager helping write a PRD that an AI coding agent (Claude Code) will follow to build the product. Your PRDs must be:

1. Explicit — every decision spelled out (auth library, DB schema, API patterns, error states)
2. Phased — 5-6 implementation phases, 30-50 requirements each, dependency-ordered
3. Bounded — explicit "Out of Scope" and "DO NOT implement" sections per phase
4. Testable — every requirement has machine-verifiable acceptance criteria
5. Structured — markdown with consistent headings so the agent can parse sections

For each phase, ask: "What must exist before this phase can start?" and "How does the developer verify this phase is complete?"

Never leave ambiguity. If something is unclear, ask the user rather than assuming. Challenge scope creep aggressively.
```

### Stage 2: Claude Code (Builder)
Feed the PRD as `PRD.md` in the project root. Claude Code reads it, enters Plan Mode to confirm understanding, then executes phase by phase.

---

## PRD Template Structure

```markdown
# PRD: [Product Name]

## 1. Product Overview

### 1.1 Vision
One paragraph: what is this product and why does it exist?

### 1.2 Target Users
Who uses this? Be specific (role, context, frequency).

### 1.3 Business Objectives
- Objective 1 (measurable)
- Objective 2 (measurable)

### 1.4 Success Metrics
| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| ... | ... | ... |

---

## 2. User Personas

### Persona: [Name]
- **Role**: ...
- **Goals**: ...
- **Pain Points**: ...
- **Key User Journey**: Step 1 → Step 2 → Step 3

---

## 3. Feature Requirements

| ID | Feature | Description | User Story | Priority | Acceptance Criteria | Phase |
|----|---------|-------------|------------|----------|---------------------|-------|
| F-001 | ... | ... | As a [user], I want [action], so that [benefit] | P0/P1/P2 | Testable criteria | 1 |

---

## 4. User Flows

### Flow: [Name]
1. User does X
2. System responds with Y
3. User sees Z

**Alternative paths:**
- If [condition]: [behavior]

**Error states:**
- If [failure]: [user sees / system does]

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load: < Xms
- API response: < Xms
- Concurrent users: X

### 5.2 Security
- Authentication method: [specific library/approach]
- Authorization model: [RBAC, row-level, etc.]
- Data protection: [encryption, PII handling]

### 5.3 Accessibility
- WCAG level: [AA/AAA]
- Specific requirements: [keyboard nav, screen reader, etc.]

### 5.4 Compatibility
- Browsers: [list with versions]
- Devices: [desktop, tablet, mobile]
- Screen sizes: [breakpoints]

---

## 6. Technical Specifications

### 6.1 Tech Stack
- **Frontend**: [framework, version, key libraries]
- **Backend**: [framework, version, ORM]
- **Database**: [type, schema approach]
- **Hosting**: [platform, deployment method]
- **Auth**: [specific library]

### 6.2 API Design
- Style: [REST/GraphQL]
- Key endpoints (table or list)
- Authentication: [JWT, session, API key]

### 6.3 Data Model
- Entity relationship overview
- Key tables/collections with fields
- Indexes and constraints

### 6.4 Project Structure
```
src/
  components/    — UI components
  pages/         — Route pages
  api/           — API routes
  lib/           — Shared utilities
  db/            — Database schema and migrations
tests/           — Test files mirroring src/
```

---

## 7. Implementation Phases

> Each phase = 5-15 minutes of agent work, ending with manually verifiable functionality.

### Phase 1: [Foundation]
**Prerequisites**: None
**Goal**: [What exists when this phase is done]
**Requirements**: F-001, F-002, ...

**Deliverables**:
- [ ] Deliverable 1
- [ ] Deliverable 2

**Acceptance Criteria**:
- [ ] `npm run build` passes
- [ ] [Specific testable behavior]

**Out of Scope for this phase**:
- DO NOT implement [feature X]
- DO NOT add [optimization Y]

---

### Phase 2: [Core Feature]
**Prerequisites**: Phase 1 complete
**Goal**: ...
(same structure)

---

## 8. Boundaries & Constraints

### Always Do
- Run tests before marking a phase complete
- Follow the project structure defined in 6.4
- Use the specific libraries listed in 6.1 (do not substitute)

### Ask First
- Any database schema changes not in the data model
- Adding new dependencies not listed in tech stack
- Changing API endpoint signatures

### Never Do
- Skip tests or reduce coverage to save time
- Implement features not listed in the current phase
- Store secrets in code (use environment variables)
- Change the auth approach without explicit approval

---

## 9. Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm test` | Run test suite |
| `npm run build` | Production build |
| `npm run lint` | Lint and auto-fix |

---

## 10. Open Questions
- [ ] Question 1 (owner: [name], deadline: [date])
- [ ] Question 2

## 11. Glossary
| Term | Definition |
|------|-----------|
| ... | ... |
```

---

## Key Principles (from Research)

### 1. Spec as Source of Truth
Save the PRD as `PRD.md` in the repo root. It persists between sessions and anchors the agent when context resets. Keep it in version control — treat it like code.

### 2. Phases Over Monoliths
Break work into 5-6 phases with 30-50 requirements each. Each phase should be independently verifiable. Larger phases introduce too many variables; smaller phases create unnecessary handoff overhead.

### 3. Explicit Negative Scope
If the PRD does not say "do not implement auth in this phase," the agent may reasonably add it. **Every boundary must be stated positively.** Each phase needs its own "Out of Scope" section.

### 4. Machine-Verifiable Acceptance Criteria
Every requirement needs criteria that can be checked programmatically or with a quick manual test. Not "works well" — instead: "`GET /api/users` returns 200 with JSON array of user objects containing `id`, `name`, `email` fields."

### 5. Self-Verification Prompt
End each phase with: "After implementing, compare the result with the PRD and confirm all requirements for this phase are met. List any PRD items not addressed."

### 6. Protection Patterns
Mark critical components with `DO NOT CHANGE` annotations:
- Database schemas (once established)
- API endpoint signatures (once other phases depend on them)
- Authentication flows
- Environment variable names

### 7. Three-Tier Boundary System (Addy Osmani)
- **Always do**: Safe actions the agent should take without asking
- **Ask first**: High-impact changes requiring human approval
- **Never do**: Hard stops that prevent destructive actions

---

## Claude Code Workflow (for the Builder)

When Claude Code receives a PRD:

1. **Read** the full PRD.md
2. **Enter Plan Mode** — outline understanding of Phase 1, ask clarifying questions
3. **Get approval** from the user on the plan
4. **Execute Phase 1** — implement deliverables, run tests
5. **Self-verify** — compare implementation against phase acceptance criteria
6. **Report** — list completed items, any deviations, and blockers
7. **Repeat** for Phase 2, 3, etc.

### Skills to Load During Build
Depending on the product, Claude Code should load relevant skills:

| Product Type | Skills to Load |
|-------------|---------------|
| Salesforce app | `sf-apex-patterns`, `sf-lwc-patterns`, `sf-integration`, `sf-flow` |
| Web app (React) | `frontend-patterns`, `backend-patterns`, `e2e-testing` |
| API service | `api-design`, `backend-patterns`, `database-design` |
| Any product | `coding-standards`, `security-review`, `tdd-workflow` |

### Commands to Invoke
- `/apex-build`, `/lwc-build`, `/flow-build` — for Salesforce components
- `/deploy` — to validate in sandbox
- `/simplify` — after each phase to check code quality

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Do This Instead |
|-------------|-------------|-----------------|
| Dumping 300 requirements in one prompt | Exceeds attention budget, agent loses track | Phase into 5-6 groups of 30-50 |
| Vague acceptance criteria ("should work well") | Agent can't self-verify | Quantified, testable criteria |
| No negative scope | Agent adds unrequested features | Explicit "DO NOT" per phase |
| Prose-only spec | Harder for agent to parse | Structured markdown with tables |
| One giant conversation | Context window fills up | `/clear` between phases, re-anchor with PRD.md |
| Not version-controlling the PRD | Spec drifts from reality | PRD.md in repo, updated with implementation |

---

## Quick-Start Checklist

Before handing a PRD to Claude Code, verify:

- [ ] Every feature has a unique ID (F-001, F-002...)
- [ ] Every feature has testable acceptance criteria
- [ ] Implementation is broken into 5-6 phases
- [ ] Each phase has prerequisites, deliverables, acceptance criteria, and out-of-scope
- [ ] Tech stack is fully specified (frameworks, versions, libraries)
- [ ] Data model is defined with fields, types, and relationships
- [ ] API endpoints are listed with methods, paths, and response shapes
- [ ] Boundaries section includes Always/Ask First/Never tiers
- [ ] Commands section lists all dev/test/build/deploy commands
- [ ] Open questions are resolved or explicitly deferred
