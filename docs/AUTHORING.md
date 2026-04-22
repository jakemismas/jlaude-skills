# Authoring Guide

How to add new skills, agents, commands, and instincts to this repository.

## Adding a New Skill

1. Create a directory: `skills/[skill-name]/` (or `skills/salesforce/[skill-name]/` for SF-specific skills).
2. Create `SKILL.md` with this format:

```yaml
---
name: skill-name
description: Third person, action-oriented description. Describe when to load this skill. Err toward over-triggering.
---
```

3. Add content sections as appropriate for the skill type.
4. Update `~/claude-skills/CLAUDE.md` (the repo index) to include the new skill in the index table.
5. Run `/sync-skills` to re-register symlinks.

## Adding a New Agent

1. Create `agents/[agent-name].md` with this format:

```yaml
---
name: agent-name
description: Action-oriented description with clear goal, input, output, and handoff rule.
tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
model: claude-opus-4-6
---
```

2. **Always scope tools.** Never omit the tools list (omission grants unrestricted access).
3. Include workflow steps, hard rules, and output format in the body.
4. Update the repo index CLAUDE.md.
5. Run `/sync-skills` to create the symlink.

## Adding a New Command

1. Create `commands/[command-name].md` with this format:

```yaml
---
name: command-name
description: When this command should be invoked. Third person, pushy.
---
```

2. Include sections: Pre-checks, Execution, Post-actions.
3. Update the repo index CLAUDE.md.
4. Run `/sync-skills` to create the symlink.

## Adding a New Instinct

1. Create `instincts/[instinct-name].md` with this format:

```yaml
---
name: instinct-name
confidence: high|medium|low
last_updated: YYYY-MM-DD
evidence_count: N
---
```

2. Include sections: Pattern, Action, Evidence, Examples.
3. Update the repo index CLAUDE.md.
4. Instincts can also be promoted from candidates using `/instinct-learn`.

## Third-Party Skills

When importing a community or vendor skill, place it alongside first-party skills (e.g., `skills/[name]/` or `skills/salesforce/[name]/`). Always:
- Preserve the original content exactly
- Prepend `<!-- source: [repo-url] -->` as the first line
- Never modify third-party skill content

## Quality Checklist

- [ ] Valid YAML frontmatter (test with a YAML parser)
- [ ] `name` field present and matches the filename
- [ ] `description` field present, third person, action-oriented
- [ ] For agents: `tools` list is present and scoped appropriately
- [ ] For instincts: `confidence` and `evidence_count` fields present
- [ ] Repo index CLAUDE.md updated
- [ ] `/sync-skills` run to register
