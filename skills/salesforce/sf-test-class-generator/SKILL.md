<!-- source: https://github.com/ehebert7/salesforce-claude-framework -->
---
name: sf-test-class-generator
description: Generates comprehensive Apex test classes covering positive, negative, and bulk scenarios with 85%+ coverage and System.assert in every test method. Load when creating test coverage for Apex classes or triggers.
---

# Test Class Generator

## Purpose
Generate comprehensive Apex test classes.

## Activation
Use when creating test coverage for Apex classes.

## Requirements
1. Create @TestSetup method with test data
2. Test positive scenarios
3. Test negative scenarios (invalid data, errors)
4. Test bulk scenarios (200+ records)
5. Test trigger recursion prevention
6. Include System.assert in every test method
7. Target 85%+ coverage

## Output
Complete test class file with all scenarios.
