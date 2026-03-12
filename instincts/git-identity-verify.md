---
name: git-identity-verify
confidence: high
last_updated: 2026-03-12
evidence_count: 2
---

## Pattern
All git commits on this machine must be attributed to Jake Mismas. No AI, bot, or service account should ever appear as author or co-author. The pre-tool-use hook blocks violations, but the instinct should be followed proactively.

## Action
Before every git commit, run "git config user.name" and verify the output is "Jake Mismas". Never use the --author flag. Never set GIT_AUTHOR_NAME or GIT_COMMITTER_NAME environment variables. Never add Co-authored-by trailers for any AI system.

## Evidence
- Git authorship is permanent in public history
- AI co-author trailers are not appropriate for Jake's workflow
- The pre-tool-use hook blocks violations, but proactive verification prevents blocked commits

## Examples
- Before committing: run "git config user.name" and confirm "Jake Mismas"
- If a commit template includes a Co-authored-by line, remove it before committing
- Never use: git commit --author="someone else"
