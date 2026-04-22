# Salesforce Project Rules

Auto-loaded by the SessionStart hook whenever the working directory
contains Salesforce project markers (sfdx-project.json, force-app/,
config/project-scratch-def.json, manifest/package.xml). No manual
@-import needed in client repos.

If you want to apply these rules somewhere the hook does not detect,
import explicitly in that repo's CLAUDE.md:
```
@~/claude-skills/salesforce-CLAUDE.md
```

## Production Deploys (non-negotiable)
- Never deploy to a production org without approval from Jake. Prompt
  him with a list of what is being deployed, one-line description each.
  Once approved, proceed.
- Always target a sandbox alias for any deploy command.
- Always validate before deploying.
- Never run destructive metadata operations (--purge-on-delete,
  destructiveChanges.xml). Ask Jake first.

## Sandbox-First
- All Salesforce changes land in a sandbox first. Jake deploys to
  production via changeset manually.

## Org Context
- Read ~/claude-skills/memory/org-context.md at session start for org
  aliases and client conventions.
- If working with a new org, ask Jake for the alias and note it in
  auto-memory for future sessions.

## Skill Loading
Always load the matching SF skill before acting. The UserPromptSubmit
hook surfaces suggestions automatically based on prompt keywords.
- Apex code -> sf-apex-patterns
- Flow -> sf-flow
- LWC -> sf-lwc-patterns
- Integrations -> sf-integration
- Test data -> sf-test-data
- Test classes -> sf-test-class-generator
- Strategic planning for large features -> sf-strategic-plan-architect
- Dev docs -> sf-dev-docs, sf-dev-docs-update

## Metadata Hallucination Guard
Before generating any Apex, Flow, or LWC that references fields or
objects, retrieve the target schema from the org. Never invent field
API names from memory.

## Auto-Memory Triggers
Proactively write auto-memory notes when discovering:
- Org field API names that deviate from convention
- SF CLI quirks (version-specific flags, Windows path issues)
- Client naming conventions (managed package prefixes, custom metadata)
- Recurring deploy errors and their fixes
