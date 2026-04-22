# Changelog

## 2026-04-22: Skills Restructure

### Changed
- Flattened `skills/custom`, `skills/public`, `skills/vendor` in favor of two grouping folders: `skills/salesforce/` and `skills/general/`.
- Standardized Salesforce skill prefix to `sf-`: `salesforce-flow` -> `sf-flow`, `apex-patterns` -> `sf-apex-patterns`, `lwc-patterns` -> `sf-lwc-patterns`. Existing `sf-integration` and `sf-test-data` unchanged.
- Dropped the `ag-` prefix on the three community skills kept: `brainstorming`, `deep-research`, `plan-writing`.
- Converted six vendor SF reference files to proper SKILL.md format: `sf-dev-docs`, `sf-dev-docs-update`, `sf-install`, `sf-setup`, `sf-strategic-plan-architect`, `sf-test-class-generator`.
- `sync.sh` now walks `skills/*/` and recurses one level into grouping folders, and prunes `~/.claude/{skills,agents,commands}` before re-populating to remove orphaned entries.
- `pre-tool-use.js` rm pattern now excludes `git`, `npm`, `yarn`, `pnpm`, `bun`, `brew`, `apt`, `apt-get`, `dnf`, `docker`, `kubectl`, `helm` so package-manager `rm` subcommands are not blocked.
- Marked `~/.claude/CLAUDE.md` as sync-only; edit `global-CLAUDE.md` as source of truth.

### Removed
- 253 unused vendor community skills.
- `sf-claude-framework` (content superseded by the six extracted SKILL.md files).

## 2026-03-12: Initial Release

### Added
- Repository structure with skills/, agents/, commands/, instincts/, hooks/, memory/, docs/
- 5 lifecycle hooks: pre-tool-use, session-start, session-stop, subagent-stop, post-tool-use
- 8 seeded instincts covering Salesforce safety, research discipline, and session management
- 8 specialized agents: sf-flow-builder, sf-lwc-builder, sf-apex-builder, sf-deploy-manager, discovery-facilitator, proposal-writer, sow-drafter, org-auditor
- 13 slash commands: flow-build, lwc-build, apex-build, deploy, can-discover, can-proposal, can-sow, can-frd (stub), can-design (stub), instinct-learn, sync-skills, org-audit, session-review
- 8 custom skill stubs: salesforce-flow, sow-generator, canidium-discovery, sf-integration, lwc-patterns, apex-patterns, doc-strategy, pre-sales
- Memory system: org-context.md, instincts-learned.md, file-change-log.md, sessions/
- Salesforce MCP configuration (placeholder org aliases)
- Global CLAUDE.md with @import to repo index
- sync.sh for pulling, relinking, and re-registering
- Full documentation: AUTHORING.md, CHANGELOG.md, CLAUDE_AI_UPLOAD.md, PENDING_DOCUMENT_TASKS.md, SOURCE_CONTROL_GUIDE.md

### Pending
- Canidium-specific content for SOW, proposal, FRD, design doc, and discovery templates
- Vendor skills from community repositories
- Plugin manifest (pending schema verification)
- Security scan results
