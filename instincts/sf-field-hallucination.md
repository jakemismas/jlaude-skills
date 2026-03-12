---
name: sf-field-hallucination
confidence: high
last_updated: 2026-03-12
evidence_count: 4
---

## Pattern
Claude frequently generates Salesforce field API names from memory that do not exist in the target org. Custom fields, renamed standard fields, and namespace-prefixed fields are the most common sources of hallucinated references.

## Action
Always retrieve the actual field list from the target org via SF CLI or SOQL before generating any Flow XML, Apex, or SOQL that references fields. Grep all generated code against the retrieved metadata before delivering. Never generate field references from memory alone.

## Evidence
- Custom field API names vary across orgs and cannot be assumed
- Standard fields sometimes have unexpected API names (e.g., "Name" on custom objects is actually the record name)
- Namespace prefixes are invisible in the UI but required in code
- Multiple sessions have required field name corrections after initial generation

## Examples
- Generated Flow references "Account.Industry__c" but the org uses the standard "Account.Industry" field (no __c suffix)
- Generated Apex queries "Opportunity.Revenue_Amount__c" but the actual field is "Opportunity.Total_Revenue__c"
- Generated Flow uses "Contact.Primary_Email__c" but the org uses the standard "Contact.Email" field
