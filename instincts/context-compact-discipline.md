---
name: context-compact-discipline
confidence: high
last_updated: 2026-03-12
evidence_count: 4
---

## Pattern
Context window pollution degrades response quality, causes forgotten instructions, and leads to repeated mistakes. Proactive compaction and delegation keep the main context clean and effective.

## Action
Compact proactively at 70% context usage. Delegate research, verification, and exploration tasks to subagents to keep the main context focused on the current task. Use /clear between unrelated tasks. Never let context rot by accumulating irrelevant tool output.

## Evidence
- Long sessions without compaction lead to forgotten safety rules and prior instructions
- Subagents isolate exploratory work from the main conversation
- Context-heavy sessions produce lower quality output in later interactions
- The /clear command is underused but highly effective at restoring quality

## Examples
- After a long research phase, compact before starting implementation
- When exploring an unfamiliar codebase, delegate to an Explore subagent
- After completing one task (e.g., building a Flow), use /clear before starting an unrelated task (e.g., writing a proposal)
