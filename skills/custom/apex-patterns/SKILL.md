---
name: apex-patterns
description: Apex development best practices including trigger handler pattern, governor limit management, async patterns (Queueable, Batch, Schedulable), test coverage standards, and common anti-patterns. Load this skill before writing or reviewing any Apex code.
---

# Apex Patterns Skill

Best practices and guardrails for production-ready Apex development.

## Trigger Handler Pattern

Never put logic in the trigger body. Use a handler class:

```apex
// AccountTrigger.trigger
trigger AccountTrigger on Account (before insert, before update, after insert, after update) {
    AccountTriggerHandler.handle(Trigger.operationType, Trigger.new, Trigger.oldMap);
}

// AccountTriggerHandler.cls
public class AccountTriggerHandler {
    public static void handle(TriggerOperation op, List<Account> newList, Map<Id, Account> oldMap) {
        switch on op {
            when BEFORE_INSERT { beforeInsert(newList); }
            when BEFORE_UPDATE { beforeUpdate(newList, oldMap); }
            when AFTER_INSERT  { afterInsert(newList); }
            when AFTER_UPDATE  { afterUpdate(newList, oldMap); }
        }
    }
}
```

## Bulkification Rules

- Always operate on collections, never single records
- Move SOQL out of loops (query before, map results, access in loop)
- Move DML out of loops (collect in list, DML after loop)
- Move callouts out of loops (use Queueable or Batch for multiple callouts)

## Governor Limits Reference

| Limit | Synchronous | Asynchronous |
|-------|------------|--------------|
| SOQL queries | 100 | 200 |
| DML statements | 150 | 150 |
| CPU time | 10,000ms | 60,000ms |
| Heap size | 6MB | 12MB |
| Callouts | 100 | 100 |
| Query rows | 50,000 | 50,000 |

## Async Patterns

### Queueable
- Use for: single async operation, chaining, complex types in parameters
- Can chain up to 2 Queueable jobs from another Queueable (as of Winter '26)
- Supports passing complex objects via constructor

### Batch Apex
- Use for: processing large data volumes (millions of records)
- Implements Database.Batchable interface
- start() returns scope, execute() processes each batch, finish() handles cleanup
- Batch size default 200, adjustable to 2000

### Schedulable
- Use for: time-based execution (daily, weekly, etc.)
- Implements Schedulable interface
- Often used to launch Batch jobs on a schedule

### @future
- Legacy pattern, prefer Queueable for new work
- Use for: simple fire-and-forget async operations
- Cannot chain, limited parameter types (primitives and collections of primitives)

## Test Standards

- Minimum 85% coverage per class (75% is Salesforce minimum, 85% is our standard)
- Test positive, negative, and bulk scenarios
- Use @TestSetup for shared test data
- Assert specific outcomes, not just absence of exceptions
- Test with 200+ records to verify bulkification
- Never use seeAllData=true except for specific platform limitations
- Never hardcode record IDs in tests
- When `SeeAllData=true` is unavoidable, use baseline-then-delta: query the current value before your test action, then assert the delta (e.g., `actual >= baseline + 1`) instead of asserting an absolute value

### Mixed DML in Tests — System.runAs()

Updating a User (setup object) and creating non-setup records (Task, Event, custom objects) in the same test transaction causes a `MIXED_DML_OPERATION` error. Fix: update the User outside `System.runAs()`, then wrap all non-setup DML inside it:

```apex
@isTest
static void testSomething() {
    // Setup object DML — OUTSIDE System.runAs
    User testUser = [SELECT Id, Sales_User__c FROM User WHERE Id = :UserInfo.getUserId()];
    if (!testUser.Sales_User__c) {
        testUser.Sales_User__c = true;
        update testUser;
    }

    // Non-setup DML — INSIDE System.runAs
    System.runAs(testUser) {
        insert new Task(Subject = 'Test', Status = 'Completed', OwnerId = testUser.Id);
        // assertions...
    }
}
```

### Production Deploy Rollback Gotcha

When deploying to production (`rollbackOnError=true` by default), a test failure rolls back ALL components — not just the test class. If you then fix and redeploy only the test class, it will fail again because the trigger/handler it depends on was rolled back and doesn't exist in the org. **Always redeploy all components together after a rollback.**

## Common Anti-Patterns
- SOQL or DML inside loops
- Hardcoded IDs or org-specific values
- Catching generic Exception without re-throwing or logging
- Empty catch blocks
- Logic in trigger bodies
- Test methods that only check coverage without asserting behavior

## References
- Apex Developer Guide: https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/
- Apex Best Practices: https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_tips_intro.htm
