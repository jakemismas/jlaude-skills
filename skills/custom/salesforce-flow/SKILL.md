---
name: salesforce-flow
description: Comprehensive Salesforce Flow Builder patterns, best practices, debugging, bulkification, governor limits, connector validation, and type-specific patterns for API 62.0 (Winter '26). Load this skill before building, debugging, or reviewing any Salesforce Flow.
---

# Salesforce Flow Skill

This skill provides patterns and guardrails for building production-ready Salesforce Flows.

## Flow Types and When to Use Each

### Record-Triggered Flow (Before Save)
- Runs before the record is committed to the database
- Use for: field updates on the triggering record, validation, calculated fields
- Cannot create/update other records
- Fastest execution, no DML consumed for the triggering record

### Record-Triggered Flow (After Save)
- Runs after the record is committed
- Use for: creating/updating related records, sending notifications, calling external services
- Has access to the committed record ID
- Consumes DML for any record operations

### Screen Flow
- Interactive, user-facing flows
- Use for: guided processes, wizards, data entry forms
- Can be embedded in Lightning pages, launched from buttons, or used in Experience Cloud
- Must handle navigation, validation, and error states in the UI

### Scheduled Flow
- Runs on a schedule against a batch of records
- Use for: periodic data cleanup, batch updates, scheduled notifications
- Subject to batch governor limits
- Cannot be triggered by record changes

### Autolaunched Flow (No Trigger)
- Invoked by other automations, Apex, or REST API
- Use for: reusable business logic, subflows, API-callable processes
- No UI context

### Platform Event-Triggered Flow
- Triggered by platform event messages
- Use for: event-driven architecture, integration responses, async processing

## Governor Limit Awareness

- Maximum 2,000 executed elements per flow interview
- Maximum 100 SOQL queries per transaction
- Maximum 150 DML statements per transaction
- Maximum 50,000 records retrieved per SOQL query
- Record-Triggered Flows: maximum 5 per object per trigger context (before/after)
- Bulkify: use collection variables and loop carefully to avoid per-record DML

## Connector Validation Protocol

Before declaring any flow complete:
1. Parse all connector elements in the XML
2. Extract every targetReference value
3. Verify each targetReference matches an existing element name
4. Flag any orphaned connectors (point to nonexistent elements)
5. Flag any unreachable elements (no connector points to them)

This is the number one silent failure mode. Never skip this step.

## Common Anti-Patterns

- Logic in fault paths that should be in the main path
- Unbounded loops without exit conditions
- SOQL inside loops (use Get Records before the loop)
- DML inside loops (use collection variables, assign inside loop, DML after loop)
- Hardcoded record IDs or org-specific values
- Missing null checks on Get Records results
- Missing fault connectors on DML and external service elements

## Debugging

- Use Debug mode in Flow Builder to step through execution
- Check Setup > Flows > Paused and Failed Flow Interviews for runtime failures
- Enable Flow Trigger Explorer to see all automations on an object
- Use debug logs with FLOW_ELEMENT_* categories for detailed execution tracing

## References
- Salesforce Flow documentation: https://developer.salesforce.com/docs/atlas.en-us.automate.meta/automate/
- Flow Best Practices: https://architect.salesforce.com/decision-guides/trigger-automation
