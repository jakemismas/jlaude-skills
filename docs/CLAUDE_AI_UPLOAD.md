# Claude.ai Upload Checklist

Manual checklist for uploading custom skills to Claude.ai projects. Claude.ai has a context budget, so some skills may need trimmed versions.

## Upload Process

1. Open Claude.ai and navigate to the target project
2. Go to Project Knowledge
3. Upload each skill file individually
4. Verify the skill loads without truncation warnings

## Skills to Upload (Priority Order)

### High Priority (upload first)
- [ ] skills/salesforce/sf-flow/SKILL.md
- [ ] skills/salesforce/sf-apex-patterns/SKILL.md
- [ ] skills/salesforce/sf-lwc-patterns/SKILL.md
- [ ] skills/salesforce/sf-integration/SKILL.md

### Medium Priority
- [ ] skills/general/doc-strategy/SKILL.md
- [ ] skills/general/sow-generator/SKILL.md
- [ ] skills/general/canidium-discovery/SKILL.md
- [ ] skills/general/pre-sales/SKILL.md

### Agent Descriptions (trimmed for Claude.ai)
- [ ] agents/sf-flow-builder.md (trim to instructions only, remove YAML frontmatter)
- [ ] agents/sf-deploy-manager.md
- [ ] agents/discovery-facilitator.md
- [ ] agents/proposal-writer.md
- [ ] agents/sow-drafter.md

## Skills That May Need Trimming

The following skills may exceed Claude.ai's per-file context budget. If upload fails or a truncation warning appears, create a trimmed version in skills/[group]/[name]/SKILL-trimmed.md:

- sf-flow (large, has extensive examples)
- sf-apex-patterns (large, has code examples)
- Any vendor skills over 5,000 words

## Trimming Guidelines

When creating trimmed versions:
- Keep the YAML frontmatter intact
- Keep all section headers
- Remove examples and code blocks (reference them verbally instead)
- Remove the References section
- Keep all rules, patterns, and action items
- Target under 3,000 words per file

## Notes

- Claude.ai projects have a total knowledge limit. Monitor total size.
- Upload the most relevant skills for the current project, not everything.
- Instincts do not need to be uploaded; they are behavioral patterns for Claude Code.
- Agent files in Claude.ai serve as reference only; agents run in Claude Code.
