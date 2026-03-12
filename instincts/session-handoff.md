---
name: session-handoff
confidence: high
last_updated: 2026-03-12
evidence_count: 3
---

## Pattern
Session continuity is lost without structured handoff notes. The next session starts cold unless it has access to what happened, what was decided, and what remains.

## Action
Always write a session summary to memory/sessions/ before ending a session. The Stop hook does this automatically, but if ending a session manually or via /clear, write the summary explicitly. The next session should start by reading the last 3 summaries from memory/sessions/ (the SessionStart hook does this automatically).

## Evidence
- Sessions that start without prior context repeat completed work
- Structured summaries (goal, completed, in progress, blockers, next action) are more useful than transcripts
- The session-start and session-stop hooks automate this, but awareness of the pattern ensures quality entries

## Examples
- Before ending: verify the Stop hook has written a summary to memory/sessions/
- If doing a manual /clear mid-session, write a quick summary first
- At session start: verify the last 3 summaries loaded and note any unfinished work
