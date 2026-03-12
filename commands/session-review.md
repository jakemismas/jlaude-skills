---
name: session-review
description: Reads the last 5 session summaries and prints a consolidated view of recent work, progress, blockers, and the single most important next action. Use this command to review what has been worked on recently.
---

# /session-review

Review recent session history.

## Workflow

1. Read the last 5 session summary files from memory/sessions/ (sorted by date, most recent first).

2. Print a consolidated view:
   - **Recent work:** What was worked on across these sessions
   - **Completed:** What was finished
   - **In progress:** What is still being worked on
   - **Blocked:** What is stuck and why
   - **Open questions:** Anything unresolved

3. Suggest the single most important next action based on the session history.

4. If no session files exist, report that and suggest starting a session summary manually.
