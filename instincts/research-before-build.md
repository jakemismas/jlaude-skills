---
name: research-before-build
confidence: high
last_updated: 2026-03-12
evidence_count: 6
---

## Pattern
Building from memory leads to outdated patterns, deprecated APIs, and incorrect implementations. Research first, build second.

## Action
Before writing any non-trivial code or configuration, run at least 3 web searches with different phrasings. Cross-reference results before acting. Check official documentation for the current version of any API, library, or platform feature. When structure or conventions are ambiguous, default to searching for current AWS architecture or McKinsey document standards rather than relying on training data.

## Evidence
- API signatures change between versions and training data may be stale
- Salesforce releases three times per year, each with potential breaking changes
- Best practice recommendations evolve and previous approaches become anti-patterns
- Multiple sessions have required corrections when code was written from memory

## Examples
- Before writing a Platform Event trigger, search for the current API version's event handling patterns
- Before structuring a proposal document, search for current McKinsey or consulting industry standards
- Before using a Node.js API, verify it exists in the installed version
