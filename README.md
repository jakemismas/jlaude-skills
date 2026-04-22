# jlaude-skills

Shared Claude skill repo functioning as a full agent harness: skills, instincts, subagents, slash commands, hooks, memory, and plugin packaging. Usable across Claude Code and Claude.ai.

## Quick Start

```bash
# Clone
git clone https://github.com/jakemismas/jlaude-skills.git ~/claude-skills

# Install globally
bash ~/claude-skills/sync.sh

# Set up MCP (after filling in org aliases)
bash ~/claude-skills/docs/mcp-setup.sh
```

## Structure

```
skills/
  salesforce/           Salesforce skills (sf-apex-patterns, sf-flow, sf-lwc-patterns, etc.)
  general/              Non-Salesforce skills (brainstorming, deep-research, doc-strategy, etc.)
agents/                 Specialized subagent definitions
commands/               Slash command definitions
instincts/              Always-on behavioral patterns
hooks/                  Lifecycle hooks (pre-tool-use, session start/stop, etc.)
memory/                 Persistent context (org info, session history, learned instincts)
docs/                   Documentation and guides
global-CLAUDE.md        Source of truth for ~/.claude/CLAUDE.md (synced by sync.sh)
<practice>-CLAUDE.md    Practice-specific rules (e.g., salesforce-CLAUDE.md)
```

## Practices (auto-loaded per project)

**For you, nothing to do.** Start Claude Code inside any SF client repo and the `SessionStart` hook scans the cwd for SF markers (`sfdx-project.json`, `force-app/`, `config/project-scratch-def.json`, `manifest/package.xml`), finds one, and injects `salesforce-CLAUDE.md` into Claude's context automatically. No `@`-import, no file to drop in, no template to copy.

**Structure chosen:** flat files at the repo root (`salesforce-CLAUDE.md`, future `finance-CLAUDE.md`, etc.), not a `workspaces/` folder. Simpler. What matters is the auto-loading, not the folder layout.

### Adding a new practice

Two steps:

1. **Drop `~/claude-skills/<practice>-CLAUDE.md`** with the rules. Structure it like `salesforce-CLAUDE.md`: practice-specific sections that apply in addition to the global config.
2. **Add one entry to `PRACTICE_MARKERS`** in `hooks/session-start.js`:
   ```js
   { name: "python", markers: ["pyproject.toml", "requirements.txt"] }
   ```

That's it. Zero change to any client repo. Run `bash ~/claude-skills/sync.sh` to re-register the hook.

### Behavior

- Non-matching directory: `SessionStart` returns `{}` and no practice rules are injected.
- Matching directory: the full `<practice>-CLAUDE.md` is injected as `additionalContext` and treated by Claude as binding for that session.
- First match wins if a directory happens to match multiple practices (order is the order in `PRACTICE_MARKERS`).

### Verifying

```bash
# From a non-practice dir: should print {}
cd ~ && node ~/claude-skills/hooks/session-start.js < /dev/null 2>/dev/null

# Simulate a Salesforce project: should print injected content
mkdir -p /tmp/test-sf && touch /tmp/test-sf/sfdx-project.json
cd /tmp/test-sf && node ~/claude-skills/hooks/session-start.js < /dev/null 2>/dev/null
find /tmp/test-sf -delete
```

## Key Commands

| Command | Purpose |
|---------|---------|
| /flow-build | Build a Salesforce Flow |
| /lwc-build | Build a Lightning Web Component |
| /apex-build | Build Apex classes and tests |
| /deploy | Validate metadata in sandbox |
| /can-discover | Run a client discovery session |
| /can-proposal | Draft a sales proposal |
| /can-sow | Draft a Statement of Work |
| /org-audit | Audit a Salesforce org |
| /instinct-learn | Review and promote learned instincts |
| /sync-skills | Pull latest and re-register everything |
| /session-review | Review recent session history |


## Adding Content

See [docs/AUTHORING.md](docs/AUTHORING.md) for how to add new skills, agents, commands, and instincts.
