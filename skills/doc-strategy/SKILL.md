---
name: doc-strategy
description: Technical documentation and proposal writing strategy for Salesforce consulting engagements. Covers document types, structure conventions, audience targeting, and quality standards. Load this skill before writing any client-facing document.
---

# Document Strategy Skill

Patterns for producing professional documentation in a Salesforce consulting context.

## Document Hierarchy

### Pre-Sales Documents
1. **Discovery Notes** (internal): Structured capture of client requirements and context
2. **Proposal** (external): Client-facing pitch document
3. **SOW** (external/legal): Contractual scope and terms

### Delivery Documents
4. **FRD** (Functional Requirements Document): Detailed requirements for development
5. **Solution Design Document**: Technical architecture and implementation plan
6. **Test Plan**: Testing strategy, cases, and expected outcomes
7. **User Guide**: End-user documentation for delivered solution
8. **Runbook**: Operational procedures for ongoing maintenance
9. **System Documentation** (IT handoff): Reference document for client IT or infrastructure team covering what was built, not how to use it

### System Documentation structure

Use this eight-section structure when producing an IT handoff document. Audience: client IT team. Diataxis type: Reference (no procedures, no tutorials).

1. **System overview** — Purpose, business context, scope in/out
2. **Platform and org configuration** — Org URL, type, API version, toolchain, key contacts
3. **Data model** — Custom objects (field tables), standard object extensions, object relationships
4. **Automation and business logic** — Record-triggered flows, scheduled flows, triggers, validation rules
5. **Integration architecture** — Inbound/outbound integration detail, processing sequences, audit objects
6. **Security and access control** — Permission sets (object + field permissions + assigned users), sharing models, third-party package access
7. **Component inventory** — Reference tables for all custom components: Apex classes, triggers, flows (with API names), objects, permission sets
8. **Operational notes** — Known constraints, hardcoded dependencies, third-party packages, deployment process, source code location

Writing note: No em dashes or dashes used as punctuation. Use commas or separate sentences instead.

## Writing Principles

### Audience Awareness
- Executive stakeholders: Lead with business outcomes, minimize technical jargon
- Technical stakeholders: Include architecture details, data flow, integration points
- End users: Step-by-step with screenshots, assume no technical background

### Structure
- Lead with the conclusion or recommendation
- Use numbered sections for cross-referencing
- One idea per paragraph
- Use tables for comparisons, lists for sequences
- Include a glossary for any technical terms used

### Tone
- Professional and direct
- Confident without being aggressive
- Focus on value and outcomes, not features
- Avoid hedging language ("we believe," "it seems," "perhaps")
- Use active voice: "Creates agent" not "Agent is created"
- Use imperatives for instructions: "Complete the configuration steps"
- Do not use "please" in instructional content

### Words to Avoid
- Business jargon: "leverage," "utilize," "facilitate," "synergy," "paradigm"
- Vague intensifiers: "revolutionary," "cutting-edge," "best-in-class"
- Passive constructions: "It was determined that..." (say "We determined...")
- Gerunds in headings: "Get started" not "Getting started," "Configure the system" not "Configuring the system"

### Capitalization
- Sentence case for titles and headings: "An introduction to data visualization" not "An Introduction to Data Visualization"
- Capitalize only proper nouns (product names, Salesforce features, tools)
- Do not capitalize: cloud, internet, machine learning, advanced analytics

### Links and References
- Make hyperlinks descriptive: "Learn how to configure Named Credentials"
- Do not write: "To configure Named Credentials, see here"

## Diataxis Content Framework

When structuring documentation, categorize content into four types (adapted from the Diataxis framework, used by McKinsey):

### 1. Tutorials (learning-oriented)
- Hands-on lessons for newcomers
- Linear, numbered steps with frequent visible results
- Use "we" language
- Do not explain why -- link to concepts instead

### 2. How-to Guides (task-oriented)
- Help competent users complete specific tasks
- Goal-oriented: "If you want X, do Y"
- Assume competence, do not teach

### 3. Concepts (understanding-oriented)
- Explain design decisions and reasoning
- Answer "why" and "how does this work"
- Discursive: "The reason for X is..."
- No procedures or step-by-step instructions

### 4. Reference (information-oriented)
- Factual lookup material
- Austere, factual, neutral tone
- Structure mirrors the product
- No instruction, explanation, or opinion

### Decision guide
- Reader is LEARNING and doing hands-on work: Tutorial
- Reader is LEARNING and building understanding: Concepts
- Reader is WORKING and completing a task: How-to Guide
- Reader is WORKING and looking up details: Reference

Do not mix types. A how-to guide should not teach; a tutorial should not reference every detail.

## Quality Checklist
- [ ] Every claim has supporting evidence or reference
- [ ] All acronyms defined on first use
- [ ] No ambiguous pronouns (this, that, it) without clear antecedents
- [ ] All dates are absolute, not relative
- [ ] Version number and date on every document
- [ ] All sections reviewed for consistency
- [ ] No placeholder text remaining
- [ ] No business jargon (leverage, utilize, facilitate)
- [ ] Active voice throughout
- [ ] Sentence case in all headings

## References
- Diataxis Framework: https://diataxis.fr/
- McKinsey ARK documentation skill (adapted writing guidelines)
- General professional documentation standards
- Consulting deliverable best practices
