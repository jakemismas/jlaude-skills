# Global Claude Code Configuration

## Orientation
Skill repo lives at ~/claude-skills/. Load the full index at session start.
Read skill and agent descriptions before acting. Prefer skills and agents over improvising.

## Core Behavior
- Research before building: run 3+ web searches before writing code from memory
- When structure is ambiguous, search for current standards (AWS architecture, consulting best practices)
- Use /clear between unrelated tasks
- Compact proactively at 80% context
- Delegate research and verification to subagents
- Never embed credentials: use environment variables only
- Flag uncertainty rather than guessing
- Proactively write auto-memory notes when discovering: org field names, SF CLI patterns, client conventions, recurring error solutions

## Git Authorship (non-negotiable)
All commits authored by Jake Mismas only. Never identify Claude Code or any AI as author or co-author.
Never add Co-authored-by trailers for any AI. Verify identity before every commit.

## Safe System Access (non-negotiable)
- Never delete files, directories, or database records, COPY AND MOVE an original to a local backup first, naming it date.time.filename
- Never use --hard reset, --delete on remote branches, dd, mkfs, chmod -R 777, sudo rm
- Never kill system processes without explicit Jake confirmation
- If a task requires a destructive operation, stop and ask

## Salesforce Rules
- Never deploy to production orgs WITHOUT approval from Jake. Prompt him for approval, telling him what you are deploying in a list output with a simple description for each. Then, once you are given approval, go wild.
- Never run destructive metadata operations (--purge-on-delete, destructiveChanges.xml). Always ask Jake first
- Always target a sandbox alias for any deploy command
- Always validate before deploying
- Read ~/claude-skills/memory/org-context.md at session start for org aliases and conventions

@~/claude-skills/CLAUDE.md
