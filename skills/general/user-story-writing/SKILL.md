---
name: user-story-writing
description: User story authoring for Canidium consulting engagements across SPM, CPQ, SFDC, Pricefx, Xactly, Fullcast, and AgentSync practices. Covers the As-a / I-want / So-that format, writing behavioral acceptance criteria, sizing, and Canidium conventions for tying stories to configurable system behavior. Load this skill whenever the user asks to write, draft, refine, split, or review a user story, backlog item, Jira ticket, or acceptance criteria, even if they do not explicitly say "user story". Also load when the user describes a raw requirement they need to translate into a story format.
source: https://sites.google.com/canidium.com/lpmo/quick-guides/user-stories
---

# User Story Writing

Produces user stories in the Canidium standard format for Scrum, Kanban, Jira, or any backlog context. Canidium consultants write these for every practice: SPM, CPQ, SFDC, Pricefx, Xactly, Fullcast, AgentSync, and Insurance.

## The Canidium format

Every user story has four parts:

1. **Actor** - "As an [actor]"
2. **Action** - "I want [action]"
3. **Achievement** - "so that [achievement]"
4. **Acceptance criteria** - specific, testable checks that must pass before the story is done

Non-technical language. Written from the user's perspective, not the developer's.

## Worked examples

### Example 1: Admin dashboard (Salesforce)

- **Actor:** As an admin
- **Action:** I want to manage user accounts and system settings from a centralized dashboard
- **Achievement:** so that I can ensure proper access control and system configuration
- **Acceptance criteria:**
  - The dashboard lists all users with options to add, edit, or deactivate accounts
  - System settings are editable including permission levels and system notifications
  - Filters are available to view users by role, activity level, or account status

### Example 2: Discretionary discount (SAP CPQ)

- **Actor:** As a Sales Rep
- **Action:** I want to apply a discretionary discount to a quote line item
- **Achievement:** so that I can close a competitive deal
- **Acceptance criteria:**
  - The discount field is limited to a 15% maximum
  - Any discount over 10% requires manager approval via an approval rule
  - The applied discount percentage is stored on the quote line item record

## Writing the acceptance criteria

Acceptance criteria are where most Canidium stories succeed or fail. Rules:

1. **Write each criterion as a behavior, not a requirement.** "The dashboard shows X" not "The dashboard should show X." Present tense, observable behavior.
2. **Every criterion must be testable.** If you cannot write a test case from it, rewrite it. Each AC should map directly to one or more rows in the standard test case template (Tester / Component / Steps / Expected / Actual).
3. **Include boundary conditions.** Percentages, limits, role restrictions, error states, null handling. "Limited to 15%" is useful. "Reasonable discount" is not.
4. **Tie criteria to configurable system behavior.** If a criterion can only be met with custom code when the platform supports configuration, flag it early for the PM so the LOE reflects it.
5. **No implementation detail.** "Create a custom object called Invalid_Order__c" belongs in an FRD, not a story. "A record is saved to the invalid order log when the calculation rejects an order" belongs in the story.

## Sizing

- Each story should be completable in one sprint (2 weeks or less).
- If the story cannot fit in a sprint, split it. Useful split axes: by workflow step, by user role, by data type, by happy path vs error path.
- If the acceptance criteria list exceeds 7-8 items, the story is probably too big. Split or promote some criteria into their own stories.

## Common failure modes

- **"As a user"** - too generic. Name the actual role: Admin, Sales Rep, Payee, Approver, Finance Analyst.
- **"I want the system to..."** - the Action should describe what the user does. System behavior goes in acceptance criteria.
- **No "so that"** - without the achievement clause, you have a requirement, not a story. The "so that" is what drives scope and prioritization conversations.
- **Acceptance criteria written as paragraphs** - use bullets. One testable behavior per bullet.
- **Development tasks in acceptance criteria** - "Build a validation rule" is a task. "An order with a blank customer ID is rejected with error message X" is a criterion.
- **Missing the unhappy path** - stories that only cover the happy case ship with edge-case bugs. Include at least one error-state criterion.

