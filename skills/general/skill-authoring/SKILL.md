---
name: skill-authoring
description: Authoring new skills, improving existing skills, and tuning skill descriptions for reliable triggering in the jlaude-skills repo. Load this skill whenever the user wants to create a skill, add a skill, write a skill, turn something into a skill, improve a skill, or make a skill trigger more reliably, even if they do not explicitly use the word "skill". Also load when the user describes a workflow they keep re-explaining to Claude and wants it captured.
---

# Skill Authoring

A skill for writing new skills in this repo. Covers placement decisions,
frontmatter patterns, description tuning for reliable triggering,
integration with the user-prompt-submit hook, and the common failure
modes that make skills under-trigger or bloat.

## When to actually write a new skill

Before creating one, apply this gate:

- Would having this written down save 5+ minutes in a future session?
- Would it benefit 3+ future sessions, not just this one?
- Does no existing skill cover it? (grep `~/claude-skills/skills/` first)
- Is the knowledge generalizable, not client-specific?

If the answer to any of these is "no," prefer a different target:

| Signal | Prefer |
|---|---|
| One-off fix | Memory note, not a skill |
| Client-specific field names | `memory/org-context.md` |
| Safety rule enforced by code | A hook, not a skill |
| Decision only relevant in one repo | A per-project CLAUDE.md |
| Recurring multi-step procedure | A new skill or new section in an existing one |

The goal is to keep the skill index signal-rich. Every skill loaded is
metadata in Claude's context. Ten high-value skills beats fifty noisy ones.

## Placement decision

The jlaude-skills repo has two grouping folders:

```
skills/salesforce/<name>/SKILL.md   # Anything SF-specific
skills/general/<name>/SKILL.md      # Everything else
```

Route by content, not by naming convention:

- SF metadata, CLI, Apex, Flow, LWC, integration, or any topic that only
  applies when working in a Salesforce org, goes in `skills/salesforce/`.
- Writing, research, planning, non-SF dev, consulting workflow, or
  cross-practice skills go in `skills/general/`.

Naming conventions in use:

- `skills/salesforce/`: prefix with `sf-` (e.g., `sf-flow`, `sf-apex-patterns`).
- `skills/general/`: no prefix (e.g., `doc-strategy`, `brainstorming`,
  `plan-writing`). Gerund form is preferred when it fits the concept.

## Frontmatter template

```markdown
---
name: <kebab-case-name>
description: <what the skill does>. Load this skill whenever the user <explicit trigger conditions>, even if they do not explicitly say "<domain word>". Also load when <edge case context>.
source: <optional URL if vendor-imported>
---
```

Rules:

- `name`: max 64 chars, lowercase + hyphens only, must match the folder name.
  This is the `name:` frontmatter field, not a heading.
- `description`: max 1024 chars. This is the single most important line
  in the skill. See the next section.
- Write the description in third person and make it "pushy" (see below).
- Do not include XML tags in either field.

## Description tuning (the part that actually matters)

Claude only loads a skill when the description matches the task.
Under-triggering is the most common failure mode. Counter it deliberately.

A strong description answers three questions:

1. **What does this skill do?** One concrete sentence.
2. **When should Claude load it?** List specific trigger phrases.
3. **What edge cases still count?** Handle the "even if they don't say X" case.

### Weak vs strong examples

Weak:
> "Patterns for writing Apex."

Strong:
> "Apex development best practices including trigger handler pattern,
> governor limit management, async patterns (Queueable, Batch,
> Schedulable), test coverage standards, and common anti-patterns.
> Load this skill before writing or reviewing any Apex code, even
> if the user only mentions a class name or a specific feature."

The strong version: specific keywords (Queueable, Batch, Schedulable),
concrete triggers ("writing or reviewing any Apex code"), an
edge-case catch ("even if the user only mentions a class name").

### Pushy phrasing patterns that work

- "Load this skill whenever the user mentions X, Y, or Z"
- "Also load when the user describes <broader context>, even if they
  don't explicitly say '<domain word>'"
- "Use this skill before writing any <output type>"

Avoid phrases that require the user to explicitly name the skill or a
narrow keyword; Claude is conservative about activation.

## Body structure

Target: under 500 lines, ideally under 200 for most skills. Longer
skills get ignored when context fills up.

A good body has:

1. **Purpose** (2-3 sentences): what the skill does and why it exists.
2. **Rules or workflow**: the actual patterns, ideally numbered or tabled.
3. **Examples**: concrete input -> output pairs if applicable.
4. **Gotchas**: specific failure modes observed in real use. This is
   the highest-signal section over time; accumulate here when running
   `/upskill`.
5. **References**: link to deeper files in the same skill folder if
   needed (`references/<topic>.md`).

Explain the **why** behind rules. Theory-of-mind beats rigid MUSTs.
If you find yourself writing "ALWAYS" or "NEVER" in all caps, reframe
and explain the reason so Claude can make good judgment calls in edge
cases. Hard bans belong in a hook, not a skill.

## Integration with the hook-based auto-loader

The repo has a `UserPromptSubmit` hook at `hooks/user-prompt-submit.js`
that reads `hooks/skill-rules.json` and injects a system reminder
suggesting skills when the user's prompt contains certain keywords.

After writing a new skill, add a keyword trigger in `skill-rules.json`:

```json
{
  "<skill-name>": {
    "keywords": ["phrase-the-user-might-type", "another-phrase", "single-word"]
  }
}
```

Rules for keywords:

- Multi-word phrases match as contiguous text (case-insensitive).
- Single words match with word-boundary regex (case-insensitive).
- Prefer specific phrases over generic single words. "flow" catches
  too much; "salesforce flow" or "screen flow" is better.
- 5-10 keywords per skill is the sweet spot. More creates false positives.

Skipping this step is fine for exploratory skills. Add rules once the
skill proves useful and you want it to fire reliably.

## Updating the repo index

After creating a skill, add a row to `~/claude-skills/CLAUDE.md` in the
right table (Salesforce Skills or General Skills). One-line description
matching the frontmatter tone.

Do not skip this. The index is the entry point for anyone reading the
repo, including Claude itself when scanning the full catalog.

## Workflow

1. **Confirm it passes the gate** (the "When to actually write" section above).
2. **Pick placement and name.** Check for collisions:
   `find ~/claude-skills/skills -type d -name "<proposed-name>"`
3. **Draft the frontmatter first.** Description quality gates everything
   downstream. Write it, read it aloud, ask whether it's pushy enough.
4. **Write the body.** Keep it lean. Use the 5-section structure above.
5. **Grep for collisions in existing skill content** to make sure you're
   not duplicating or contradicting: `grep -r "<key phrase>" ~/claude-skills/skills/`
6. **Add keyword triggers** to `hooks/skill-rules.json` (optional but
   recommended for skills you want to fire reliably).
7. **Add a row** to `~/claude-skills/CLAUDE.md` index.
8. **Test with a real prompt.** Start a fresh session, say something a
   real user would say, verify the skill loads. If it doesn't, tune the
   description.
9. **Commit** with a message like `Add <name> skill` or `Add <name> skill (covers X, Y, Z)`.

## Gotchas

- **Do not run `/upskill` to create a skill from a single session.**
  `/upskill` is for refining existing skills with 5+ minute-saving
  captures, not drafting new ones. Use this skill for new drafts.
- **The description must work standalone.** Claude sees it in a list
  of all skills and decides whether to load based on that line alone.
  It doesn't read the body first.
- **First-person in description ("I help you...") breaks triggering.**
  Always third-person.
- **Adding `<practice>-CLAUDE.md` content as a skill is the wrong move.**
  Practice files auto-load via the SessionStart hook. Don't duplicate.
- **Name mismatches between folder and `name:` frontmatter field**
  cause Claude Code to silently skip the skill. Folder name, frontmatter
  name, and the skill-rules.json key must all match.
- **HTML comments before YAML frontmatter break parsing.** Put
  attribution comments (`<!-- source: ... -->`) after the closing `---`
  or use the `source:` YAML field instead.
- **Over-triggering kills the skill index.** If a skill fires on every
  prompt, it stops being useful signal. Tighten the keywords.
- **"Mega-skills" that do many things fail.** One skill, one job. If a
  skill has three unrelated sections, split it.

## When to retire or refactor a skill

- The skill has not loaded in 3+ months of regular use -> tighten
  description or archive.
- The skill fires on unrelated prompts -> narrow keywords.
- The skill has grown past 500 lines -> split into a main SKILL.md plus
  `references/*.md` files with the detail.
- Two skills overlap significantly -> merge or clearly delineate domains.

## References

- [Anthropic skill authoring best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [Anthropic skill-creator source](https://github.com/anthropics/skills)
- [Nick Babich: 7 Rules for an Effective Claude Code Skill](https://uxplanet.org/7-rules-for-creating-an-effective-claude-code-skill-2d81f61fc7cd)
- [Thariq's 9 tips from the Claude Code team](https://x.com/trq212/status/2033949937936085378)
