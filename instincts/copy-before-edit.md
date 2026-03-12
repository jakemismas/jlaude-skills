---
name: copy-before-edit
confidence: high
last_updated: 2026-03-12
evidence_count: 3
---

## Pattern
Editing files in place without a backup creates unrecoverable situations when changes need to be rolled back. The pre-tool-use hook enforces this automatically, but the instinct should be followed even when the hook is not active.

## Action
Always copy existing files to .claude-working/[filename].bak.[timestamp] before modifying them. Never overwrite a file in place without a backup. The pre-tool-use hook does this automatically for Write and Edit tool calls, but when working via Bash or manual operations, create the copy explicitly.

## Evidence
- File edits cannot always be undone via git if the file was not committed
- The .claude-working/ directory serves as a local safety net independent of version control
- Recovery from accidental overwrites has required manual reconstruction

## Examples
- Before editing a .cls file, copy it: cp MyClass.cls .claude-working/MyClass.cls.bak.2026-03-12T10-00-00
- Before modifying a flow XML, back it up first
- The pre-tool-use hook handles this for tool-based writes, but Bash file operations need manual backup
