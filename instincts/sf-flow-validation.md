---
name: sf-flow-validation
confidence: high
last_updated: 2026-03-12
evidence_count: 5
---

## Pattern
Flow XML connector references are the most common silent failure mode. Flows that look correct in XML can fail at activation because a connector points to a deleted or renamed element.

## Action
Always validate all connector targetReference values against the actual element names in the flow before declaring a flow complete. Run a grep or parse pass to confirm every targetReference has a matching element. Never skip this step, even for simple flows.

## Evidence
- Broken connectors are invisible until activation or runtime
- They cause "Invalid flow" errors that are difficult to debug without re-examining every element
- This is the number one cause of "works in builder, fails on save" issues
- Multiple sessions have required connector repair after initial generation

## Examples
- A Record-Triggered Flow references a Decision element "Check_Status" but the element was renamed to "checkStatus" during editing. The connector still points to "Check_Status" and the flow fails on activation.
- A Screen Flow has a loop element that exits to "Assignment_Final" but that element was removed. The flow activates but errors at runtime.
