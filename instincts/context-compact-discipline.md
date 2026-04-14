---
name: context-compact-discipline
confidence: high
last_updated: 2026-04-14
evidence_count: 5
---

## Pattern
Context window pollution degrades response quality, causes forgotten instructions, and leads to repeated mistakes. Proactive compaction and delegation keep the main context clean and effective. Compacting without capturing learnings wastes the session's hard-won knowledge.

## Action
At ~80% context usage, run the **pre-compact capture** before compacting:

1. **Delegate a lightweight upskill to a subagent.** Spawn a subagent with this prompt:
   > Review the conversation so far. Extract ONLY corrections, workarounds, platform gotchas, and CLI quirks that were discovered the hard way. For each, check if it already exists in ~/claude-skills/skills/ (grep the skill files). If it is genuinely new and would save 5+ minutes in a future session, append it as a [CANDIDATE] entry to ~/claude-skills/memory/instincts-learned.md with: pattern, evidence, suggested skill target. Skip anything generic, already documented, or client-specific. Target: under 5 entries per session, zero if the session was routine.
2. **Then compact.** Only after the subagent returns.
3. **Use /clear between unrelated tasks** rather than letting unrelated context accumulate.
4. **Delegate research and exploration** to subagents to prevent main context bloat in the first place.

The full /upskill command (with user review and skill file edits) is reserved for explicit end-of-session use. The pre-compact capture only writes candidates -- it never modifies skill files directly.

## Evidence
- Long sessions without compaction lead to forgotten safety rules and prior instructions
- Subagents isolate exploratory work from the main conversation
- Context-heavy sessions produce lower quality output in later interactions
- The /clear command is underused but highly effective at restoring quality
- Compacting without capturing learnings means the same gotchas get re-discovered in future sessions

## Examples
- At ~80% context: spawn upskill subagent, wait for it, then compact
- After a long research phase, compact before starting implementation
- When exploring an unfamiliar codebase, delegate to an Explore subagent
- After completing one task (e.g., building a Flow), use /clear before starting an unrelated task (e.g., writing a proposal)
- Session that was purely routine (deploying known metadata, no surprises): subagent captures zero candidates, compact proceeds immediately
