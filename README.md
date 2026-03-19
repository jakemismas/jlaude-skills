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
skills/        Skill definitions (public, custom, vendor)
agents/        Specialized subagent definitions
commands/      Slash command definitions
instincts/     Always-on behavioral patterns
hooks/         Lifecycle hooks (pre-tool-use, session start/stop, etc.)
memory/        Persistent context (org info, session history, learned instincts)
docs/          Documentation and guides
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
