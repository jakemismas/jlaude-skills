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
- Use for: guided processes, wizards, data entry forms, read-only dashboards on record pages
- Can be embedded in Lightning pages, launched from buttons, or used in Experience Cloud
- Must handle navigation, validation, and error states in the UI
- Common pattern: embed on a record page with recordId input variable to display related data

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

## Screen Flow: "Most Recent Record per Category" Pattern

A proven pattern for displaying the latest record matching each of several boolean categories. Used when an object has multiple checkbox fields and you need to show the most recent record where each checkbox is true.

### Architecture

1. **Single Get Records** at the start. Query all records for the parent (filter by recordId). Sort ascending by date. Returns all records, not first only. This is one SOQL query regardless of how many categories exist.

2. **Per-category element chain** (repeat for each category):
   - **Collection Filter** (FilterCollectionProcessor): Filters the shared collection by the category's boolean field = true
   - **Loop**: Iterates ascending over the filtered collection
   - **Decision**: Two rules -- (a) if stored variable IsNull (first iteration), go to Assignment via isGoTo; (b) if current item date GreaterThan stored variable date, go to Assignment. Default outcome loops back (continue iterating).
   - **Assignment**: Assigns current loop item to the stored SObject variable, then connectors back to the Loop

3. **Screen** at the end with RegionContainer sections (SectionWithoutHeader). Each category gets three columns:
   - Column1 (width 2): Bold category label
   - Column2 (width 8): Notes field merge from the stored variable
   - Column3 (width 2): Link to record with date, visibility rule on variable Id IsNull = false

4. **Variables**: One SObject variable per category (var_mostRecent{CategoryName}, type = target object). Plus recordId (String, isInput and isOutput true). One shared assignNextValueToReference variable used by all collection filters.

### Key decisions in this pattern
- Single Get + in-memory filtering avoids governor limits vs. one query per category
- Ascending sort + GreaterThan comparison means last match wins = most recent
- IsNull check with isGoTo avoids branching in auto-layout for the first iteration
- All collection filters share one assignNextValueToReference variable (Flow Builder convention)

### Connector chain
Each category's Loop noMoreValuesConnector points to the NEXT category's Collection Filter. The last category's Loop noMoreValuesConnector points to the Screen element.

### Copy-paste gotchas
- When duplicating sections, always verify the variable reference in Column3's fieldText matches the current category, not the one copied from
- When adding a new category to an existing flow, update the previous last Loop's noMoreValuesConnector to point to the new Filter instead of Screen

## Flow XML Conventions

### Element ordering in XML
Elements must appear in alphabetical order by type: assignments, then collectionProcessors, then decisions, then loops, then recordLookups, then screens, then start, then variables.

### Full element type order
apiVersion, areMetricsLoggedToDataCloud, assignments (all), collectionProcessors (all), customProperties, decisions (all), environments, interviewLabel, label, loops (all), processMetadataValues (BuilderType, CanvasMode, OriginBuilderType), processType, recordLookups, screens, start, status, variables (all)

### locationX/locationY
Always set to 0. AUTO_LAYOUT_CANVAS ignores position coordinates.

### HTML encoding in fieldText
Ampersands double-encode: `&amp;amp;` in the raw XML. Example: "Parts & Collision" becomes `Parts &amp;amp; Collision`.

### processMetadataValues
Always include three: BuilderType = LightningFlowBuilder, CanvasMode = AUTO_LAYOUT_CANVAS, OriginBuilderType = LightningFlowBuilder.

## Deployment

- Deploy: `sf project deploy start --source-dir force-app/main/default/flows/{FlowName}.flow-meta.xml --target-org {alias} --wait 10`
- If timeout: `sf project deploy resume --job-id {ID} --wait 10` (do NOT pass --target-org to resume; it is not a valid flag)
- Flow deploys as Draft. Open Flow Builder to save as new version and activate.
- IDE XML validation warnings (cvc-type.3.1.2 on `<value>` elements) are false positives. Salesforce accepts them.

## Debugging

- Use Debug mode in Flow Builder to step through execution
- Check Setup > Flows > Paused and Failed Flow Interviews for runtime failures
- Enable Flow Trigger Explorer to see all automations on an object
- Use debug logs with FLOW_ELEMENT_* categories for detailed execution tracing

## References
- Salesforce Flow documentation: https://developer.salesforce.com/docs/atlas.en-us.automate.meta/automate/
- Flow Best Practices: https://architect.salesforce.com/decision-guides/trigger-automation
