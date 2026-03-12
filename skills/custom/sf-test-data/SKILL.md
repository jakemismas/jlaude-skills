---
name: sf-test-data
description: Generating realistic test/proxy data in Salesforce orgs using Anonymous Apex. Covers schema discovery, lookup resolution, field fill rate variation, governor limits, and the file-based execution pattern for Windows CLI.
---

# Salesforce Test Data Generation

Generate realistic proxy data for any Salesforce object using Anonymous Apex scripts executed via the SF CLI.

## Core Principle

Test data must be contextual to the client and their business. A car dealership gets dealership visits and vehicle inventory. An insurance company gets policies and claims. Always understand what the client does and what realistic data looks like for their objects before generating anything.

## Step-by-Step Process

### 1. Discover the schema

Query the org to understand every field on the target object:

```bash
sf sobject describe --sobject {ObjectName} --target-org {alias} --json
```

Parse the JSON to extract:
- All createable fields, their types, and whether they are nillable (required vs optional)
- Default values
- Picklist values and their labels
- Reference targets (lookup/master-detail relationships)
- Auto-number or formula fields (do not set these)

### 2. Query all lookup targets

Before writing any data, query every object that the target references:

```bash
echo "SELECT Id, Name FROM Account LIMIT 50" > /tmp/query.soql
sf data query --file /tmp/query.soql -o {alias}
```

Also query existing records of the target object to understand what is already there and avoid duplicates:

```bash
echo "SELECT {GroupByField}, COUNT(Id) cnt FROM {Object} GROUP BY {GroupByField}" > /tmp/query.soql
sf data query --file /tmp/query.soql -o {alias}
```

**Windows CLI note:** Always write SOQL to a temp file and use `--file` instead of inline `--query`. The SF CLI path on Windows contains spaces that break nested quoting in Git Bash. This avoids all quoting issues.

### 3. Identify logical field dependencies

Some fields have dependencies not enforced by the schema but expected by the UI or business logic:

- **Checkbox + notes pairs:** When a checkbox is true, its paired notes field should contain text. When false, leave notes null.
- **Status + time fields:** "Completed" records should have actual start/end times. "Planned" records should not.
- **Date consistency:** If an object has both a date field and a datetime field for the same concept, keep them on the same day.
- **Future vs past dates:** Records with future dates should have a status like "Planned" or "Scheduled", not "Completed".
- **Conditional visibility:** Check if the page layout uses conditional visibility rules that imply field dependencies.

### 4. Handle required fields

Identify all non-nillable fields. Common required fields that trip up generation:
- Lookup references that are not obvious from the object name (e.g., Visit requires PlaceId to a Location record)
- Boolean fields that default to false and are non-nillable (do not need explicit false, but always return true/false, never null)
- Auto-number Name fields (do not set; Salesforce generates them)
- Status/picklist fields with a default value

### 5. Vary field fill rates

To produce realistic data, not every record should have every field filled:

- **Light records (~20% fill):** 2-3 optional fields populated. Minimal notes. Represents quick or incomplete entries.
- **Medium records (~40% fill):** 4-6 optional fields. Some notes. Represents typical entries.
- **Heavy records (~60%+ fill):** Most optional fields populated. Detailed notes. Represents thorough entries.

Mix the distribution across records. Real data is never uniform.

### 6. Write contextual content

Notes, descriptions, and text fields must reflect the client's actual business:
- Use industry-appropriate terminology
- Reference realistic scenarios for their domain
- Vary the tone and detail level (some notes are terse, some are detailed)
- Do not use placeholder text like "Lorem ipsum" or "Test note 1"

## Anonymous Apex Pattern

### Single-object script structure

```apex
// Reference IDs from org queries
String parentId = '{queried_id}';
String lookupId = '{queried_id}';

List<{Object}> records = new List<{Object}>();

// Light record
records.add(new {Object}(
    ParentField = parentId,
    RequiredLookup = lookupId,
    Status = 'Active',
    OptionalField__c = 'Contextual value here'
));

// Heavy record
records.add(new {Object}(
    ParentField = parentId,
    RequiredLookup = lookupId,
    Status = 'Completed',
    Field1__c = true,
    Field1_Notes__c = 'Detailed contextual note.',
    Field2__c = true,
    Field2_Notes__c = 'Another relevant note.',
    Description__c = 'Comprehensive entry with full detail.'
));

insert records;
System.debug('Created ' + records.size() + ' records.');
```

### Execution

```bash
sf apex run --file scripts/apex/create{Object}_1.apex -o {alias}
```

## Governor Limits and Splitting

### Anonymous Apex size limit

Anonymous Apex has a compilation size limit. A single script with many records and verbose text fields will hit it. The error looks like:

```
Compilation failed at Line 1 column 1 with the error: Script too large
```

**Solution:** Split into multiple files by logical grouping (e.g., one per parent account, one per record type, one per date range). Each file is self-contained with its own variable declarations and insert statement. Execute sequentially.

### DML limits per script

- 150 DML statements per transaction
- 10,000 DML rows per transaction
- Each insert call is 1 DML statement; the row count is the list size
- Account for flow/trigger overhead: if the target object has automations, each record may consume additional DML rows and CPU

### Scaling beyond anonymous Apex

For hundreds or thousands of records:
- Use `Database.insert(records, false)` for partial success handling
- Batch into groups of 200 records per DML call
- Consider a deployed Batch Apex class instead of anonymous Apex
- Monitor flow/trigger overhead per record

## Pre-generation Checklist

1. [ ] Described the target object and reviewed all createable fields
2. [ ] Queried all lookup target objects and have valid IDs
3. [ ] Queried existing records to understand current data distribution
4. [ ] Identified required fields and auto-populated fields
5. [ ] Identified logical field dependencies (checkbox/notes pairs, status/time logic)
6. [ ] Understood the client's business context for realistic content
7. [ ] Planned fill rate variation (light/medium/heavy mix)
8. [ ] Estimated record count and checked against script size limits
