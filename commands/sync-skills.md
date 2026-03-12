---
name: sync-skills
description: Pulls latest changes from the skills repo, re-runs symlinks, re-registers hooks, and runs a security scan. Use this command to update the skills system after remote changes.
---

# /sync-skills

Sync the skills repository and re-register everything.

## Workflow

1. Report current counts:
   ```
   echo "Skills: $(find ~/claude-skills/skills -name 'SKILL.md' 2>/dev/null | wc -l)"
   echo "Agents: $(find ~/claude-skills/agents -name '*.md' 2>/dev/null | wc -l)"
   echo "Commands: $(find ~/claude-skills/commands -name '*.md' 2>/dev/null | wc -l)"
   echo "Instincts: $(find ~/claude-skills/instincts -name '*.md' 2>/dev/null | wc -l)"
   ```

2. Run sync.sh:
   ```
   bash ~/claude-skills/sync.sh
   ```

3. Report updated counts and any differences.

4. Report if any new vendor skills were added (by comparing before/after counts in skills/vendor/).

5. Report the security scan result from sync.sh output.
