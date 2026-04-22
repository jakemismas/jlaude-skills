# Pending Document Tasks

Follow-up Claude.ai sessions needed to flesh out Canidium-specific content. Each entry describes what is needed, which skill/agent/command it unblocks, estimated effort, and the consultation prompt to use.

## 1. SOW Template

**What is needed:** The actual Canidium SOW structure, standard phases (e.g., Discovery, Design, Build, UAT, Deployment, Hypercare), assumption language, payment terms format, and change order language.

**Unblocks:** `sow-generator` skill, `sow-drafter` agent, `/can-sow` command

**Estimated effort:** 1 Claude.ai session (30-45 minutes)

**Consultation prompt:**
> I am building an automated SOW generator for Canidium's Salesforce consulting practice. I need you to help me define the standard SOW template structure that Canidium uses. Please provide: (1) the standard section structure with descriptions of what goes in each section, (2) standard project phases and what each phase typically includes, (3) standard assumption language and common assumptions, (4) payment terms format and common payment structures, (5) change order process language, (6) any standard legal or liability language patterns. If you have access to example Canidium SOWs, use them as reference.

---

## 2. Proposal Voice and Differentiators

**What is needed:** Canidium's writing voice, standard differentiators (what makes Canidium different from other Salesforce consultancies), pricing philosophy, and how Canidium positions itself in proposals.

**Unblocks:** `proposal-writer` agent, `/can-proposal` command

**Estimated effort:** 1 Claude.ai session (20-30 minutes)

**Consultation prompt:**
> I am building an automated proposal writer for Canidium's Salesforce consulting practice. I need you to help me define: (1) Canidium's writing voice and tone for proposals (with examples of good and bad phrasing), (2) Canidium's standard differentiators and how they should be articulated, (3) Canidium's pricing philosophy and how to frame investment sections, (4) standard "Why Canidium" section content, (5) any standard case studies or proof points to reference. Provide specific language examples I can use as templates.

---

## 3. FRD Template

**What is needed:** Canidium's Functional Requirements Document structure, section conventions, requirement categorization scheme, acceptance criteria format, and traceability matrix format.

**Unblocks:** `/can-frd` command (currently a stub)

**Estimated effort:** 1 Claude.ai session (20-30 minutes)

**Consultation prompt:**
> I am building a Functional Requirements Document generator for Canidium's Salesforce consulting practice. I need: (1) the standard FRD section structure with descriptions, (2) how requirements are categorized (functional, non-functional, data, integration, etc.), (3) the format for acceptance criteria, (4) whether Canidium uses a traceability matrix and its format, (5) any standard requirement templates or patterns. Provide the complete skeleton with section headers and descriptions.

---

## 4. Solution Design Document Template

**What is needed:** Canidium's Solution Design Document structure, architecture documentation conventions, diagram conventions, and technical specification depth expectations.

**Unblocks:** `/can-design` command (currently a stub)

**Estimated effort:** 1 Claude.ai session (20-30 minutes)

**Consultation prompt:**
> I am building a Solution Design Document generator for Canidium's Salesforce consulting practice. I need: (1) the standard Solution Design Document section structure, (2) what level of technical detail is expected in each section, (3) how architecture diagrams are typically described or referenced, (4) standard data model documentation format, (5) integration design documentation format, (6) how security and access models are documented. Provide the complete template skeleton.

---

## 5. Discovery Frameworks

**What is needed:** Canidium's specific discovery question sequence, probing patterns, how sessions are structured (duration, participants, cadence), and how requirements are prioritized.

**Unblocks:** `canidium-discovery` skill, `discovery-facilitator` agent

**Estimated effort:** 1 Claude.ai session (20-30 minutes)

**Consultation prompt:**
> I am building a discovery facilitation system for Canidium's Salesforce consulting practice. I need: (1) Canidium's standard discovery session structure (how many sessions, duration, participants), (2) the specific question framework and sequence used, (3) how requirements are prioritized (MoSCoW, weighted scoring, etc.), (4) how scope is defined and communicated back to the client, (5) any specific probing techniques or follow-up patterns used. Provide concrete question examples for a typical Salesforce implementation project.

---

