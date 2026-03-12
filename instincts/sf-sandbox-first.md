---
name: sf-sandbox-first
confidence: high
last_updated: 2026-03-12
evidence_count: 3
---

## Pattern
All Salesforce metadata changes must be validated in a sandbox before any production deployment. Jake deploys to production manually via changeset. Automated production deployment is never acceptable.

## Action
Always target a sandbox org alias for any deploy or validate command. Never run sf project deploy or sfdx force:source:deploy against a production org. After successful sandbox validation, output a changeset description for Jake to manually promote to production.

## Evidence
- Production deployments that bypass sandbox testing have caused downtime
- Changesets provide a reviewable, auditable deployment mechanism
- Jake has final authority over all production changes
- This is a hard rule, not a recommendation

## Examples
- After building a new Flow, run "sf project deploy validate" against the dev-sandbox alias, not production
- After writing Apex, validate test execution in sandbox before creating the changeset description
- If asked to "deploy to prod," respond with the changeset manifest instead and remind Jake to deploy manually
