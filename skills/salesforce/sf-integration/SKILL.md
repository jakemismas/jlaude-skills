---
name: sf-integration
description: Salesforce integration patterns including REST API, Named Credentials, External Services, Platform Events, Change Data Capture, and outbound messaging. Load this skill before building or designing any Salesforce integration.
---

# Salesforce Integration Skill

Patterns and guardrails for building Salesforce integrations.

## Integration Pattern Selection

### REST API (Inbound)
- Use when: External systems need to read/write Salesforce data
- Authentication: Connected App with OAuth 2.0 (JWT Bearer for server-to-server)
- Rate limits: API call limits vary by org edition
- Best for: Synchronous, on-demand data operations

### Named Credentials
- Use when: Salesforce needs to call external APIs
- Always use Named Credentials over hardcoded endpoints
- Supports OAuth 2.0, JWT, basic auth, AWS Signature
- Externalizes credentials from code

### External Services
- Use when: You want to call an external REST API from a Flow
- Register an OpenAPI spec, Salesforce generates invocable actions
- No Apex required for simple integrations
- Best for: Flow-based integrations with external APIs

### Platform Events
- Use when: Loosely coupled, event-driven communication is needed
- Publish from Apex, Flow, or external systems via API
- Subscribe via Flow, Apex triggers, or CometD
- At-least-once delivery semantics
- Best for: Async notifications, event sourcing, cross-system coordination

### Change Data Capture (CDC)
- Use when: External systems need to react to Salesforce data changes
- Subscribe to change events for specific objects
- Delivers field-level change details
- Best for: Data synchronization, audit trails, real-time replication

### Outbound Messaging
- Legacy pattern, prefer Platform Events for new work
- Use when: Simple HTTP POST notification on record change
- Limited to workflow rule triggers

## Security Patterns
- Never hardcode credentials in Apex or metadata
- Always use Named Credentials or Custom Metadata for endpoint URLs
- Use encryption for sensitive data in transit and at rest
- Implement proper error handling and retry logic
- Log integration events for debugging

## Governor Limit Considerations
- Maximum 100 callouts per transaction
- Maximum 120-second total callout timeout per transaction
- Maximum 10 simultaneous callouts per transaction (6MB response limit)
- Use async patterns (Queueable, @future) for callouts from triggers

## Error Handling
- Implement retry logic with exponential backoff
- Log failures to a custom object or Platform Event
- Alert on repeated failures
- Design for idempotency (same request can be safely repeated)

## References
- Salesforce Integration Patterns: https://developer.salesforce.com/docs/atlas.en-us.integration_patterns_and_practices.meta/integration_patterns_and_practices/
- Named Credentials: https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_callouts_named_credentials.htm
