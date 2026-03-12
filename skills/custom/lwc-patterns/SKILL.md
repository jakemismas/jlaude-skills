---
name: lwc-patterns
description: Lightning Web Component development patterns, anti-patterns, wire adapters, accessibility standards, and ESLint configuration. Load this skill before building or reviewing any LWC.
---

# LWC Patterns Skill

Patterns and guardrails for building production-ready Lightning Web Components.

## Core Principles

### Reactive Data Binding
- LWC uses one-way data binding (parent to child via @api)
- Child-to-parent communication via CustomEvent dispatch
- Sibling communication via a shared service (pubsub or Lightning Message Service)

### Wire Adapters vs. Imperative Apex
- Prefer wire adapters for read operations (automatic caching, reactivity)
- Use imperative Apex for write operations or complex logic
- Wire results include data and error properties; always handle both

### Property Rules
- @api properties: public, set by parent, never mutate internally
- @track properties: removed in modern LWC (all properties are reactive)
- Private properties: no decorator, reactive by default

## Component Structure

```
componentName/
  componentName.html       // Template
  componentName.js         // Controller
  componentName.js-meta.xml // Metadata (targets, API version, visibility)
  componentName.css        // Styles (optional)
  __tests__/               // Jest tests (optional but recommended)
```

## Common Patterns

### Loading and Error States
Always show loading spinners and error messages:
```html
<template if:true={isLoading}>
  <lightning-spinner alternative-text="Loading"></lightning-spinner>
</template>
<template if:true={error}>
  <c-error-panel errors={error}></c-error-panel>
</template>
<template if:true={data}>
  <!-- main content -->
</template>
```

### Form Handling
- Use lightning-record-form for simple CRUD (least code)
- Use lightning-record-edit-form for customized forms (more control)
- Use lightning-record-view-form for read-only display
- Use custom forms with imperative Apex only when built-in forms are insufficient

### Event Handling
- Dispatch CustomEvent for parent communication
- Use detail property for event data
- Name events in lowercase with no special characters
- Always document event contracts

## Anti-Patterns
- Mutating @api properties (breaks one-way binding)
- Direct DOM manipulation (use template directives instead)
- Synchronous Apex in connectedCallback (use wire or imperative with await)
- Inline styles (use CSS custom properties or component CSS)
- Missing error handling on wire adapters or Apex calls

## Accessibility
- All interactive elements need accessible labels
- Use aria-label, aria-describedby, aria-live as appropriate
- Tab order must be logical
- Color must not be the only indicator of state
- Test with screen readers

## ESLint Configuration
Use @salesforce/eslint-config-lwc for standard rules. Key rules:
- no-api-reassignments
- no-async-operation
- no-inner-html
- valid-api
- no-deprecated

## References
- LWC Developer Guide: https://developer.salesforce.com/docs/platform/lwc/guide
- LWC Recipes: https://github.com/trailheadapps/lwc-recipes
