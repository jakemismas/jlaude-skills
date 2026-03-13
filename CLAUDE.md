# Claude Skills Repository Index

## Skill Loading Philosophy

Scan descriptions first, load the relevant SKILL.md before acting. Load multiple skills simultaneously when the task spans multiple domains (e.g., building an LWC that calls Apex: load both lwc-patterns and apex-patterns). Never improvise when a skill exists for the domain.

## Skills Index

### Custom Skills (skills/custom/)

| Skill | Description |
|-------|-------------|
| salesforce-flow | Flow Builder patterns, best practices, debugging, bulkification, governor limits, connector validation, API 62.0, type-specific patterns |
| apex-patterns | Apex best practices, trigger handler pattern, governor limits, async patterns, test coverage standards |
| lwc-patterns | LWC development patterns, anti-patterns, wire adapters, accessibility, ESLint config |
| sf-integration | Salesforce integration patterns: REST, Named Credentials, External Services, Platform Events, CDC |
| sf-test-data | Generating realistic test/proxy data in Salesforce using Anonymous Apex. Schema discovery, lookup resolution, fill rate variation, governor limits |
| doc-strategy | Technical documentation and proposal writing strategy for Salesforce consulting |
| sow-generator | SOW authoring for Salesforce consulting. PENDING Canidium template context |
| canidium-discovery | Client discovery process, question frameworks, scope definition. PENDING Canidium frameworks |
| pre-sales | Solution architecture for pre-sales, discovery-to-proposal workflow. PENDING Canidium voice context |

### Public Skills (skills/public/)
(Empty: populate from anthropics/skills or Anthropic official releases)

### Vendor Skills (skills/vendor/)
(Populated from community repos. See each SKILL.md for source attribution.)

## Agents Index

| Agent | Description | Tools |
|-------|-------------|-------|
| sf-flow-builder | Gathers requirements, retrieves org metadata, generates Flow XML, validates connectors and fields | Read, Write, Bash, Glob, Grep |
| sf-lwc-builder | Builds LWC bundles with best practices, checks existing patterns, flags Apex dependencies | Read, Write, Bash, Glob, Grep |
| sf-apex-builder | Writes Apex classes, triggers, and test classes with 85%+ coverage | Read, Write, Bash, Glob, Grep |
| sf-deploy-manager | Validates metadata against sandbox, prepares changeset manifest. Never deploys to prod | Bash, Read, Glob |
| discovery-facilitator | Runs structured discovery sessions, captures requirements, flags scope creep | Read, Write |
| proposal-writer | Drafts sales proposals from discovery notes or RFP | Read, Write |
| sow-drafter | Drafts SOWs with pricing gate. Jake must confirm pricing before output | Read, Write |
| org-auditor | Read-only Salesforce org audit for health, debt, and risk | Bash, Read, Glob |

## Commands Index

### Salesforce Commands
| Command | Description |
|---------|-------------|
| /flow-build | Build a Salesforce Flow interactively |
| /lwc-build | Build a Lightning Web Component |
| /apex-build | Build Apex classes and tests |
| /deploy | Validate metadata in sandbox, prepare changeset |

### Canidium Business Commands (can-)
| Command | Description |
|---------|-------------|
| /can-discover | Run a structured client discovery session |
| /can-proposal | Draft a sales proposal |
| /can-sow | Draft a Statement of Work (pricing gate enforced) |
| /can-frd | [STUB] Generate FRD. Pending Canidium template |
| /can-design | [STUB] Generate Solution Design Doc. Pending Canidium template |

### Utility Commands
| Command | Description |
|---------|-------------|
| /upskill | Review current session and update skill files with new patterns, gotchas, and techniques |
| /instinct-learn | Review and promote learned instincts |
| /sync-skills | Pull latest, re-symlink, re-register, security scan |
| /org-audit | Audit a Salesforce org (read-only) |
| /session-review | Review last 5 session summaries |

## Instincts Index

| Instinct | Confidence | Description |
|----------|------------|-------------|
| sf-flow-validation | high | Validate Flow XML connector references before declaring complete |
| sf-field-hallucination | high | Grep generated code against retrieved org metadata before deploying |
| sf-sandbox-first | high | All SF changes to sandbox first, Jake deploys to prod via changeset |
| research-before-build | high | Run 3+ web searches before writing code from memory |
| copy-before-edit | high | Copy files to .claude-working/ before modifying |
| git-identity-verify | high | Verify git author is Jake Mismas before every commit |
| context-compact-discipline | high | Compact at 70% context, delegate to subagents |
| session-handoff | high | Write session summary before ending |

## Adding New Content

See docs/AUTHORING.md for instructions on adding skills, agents, commands, and instincts.

After adding content:
1. Update this index (add a row to the appropriate table)
2. Run /sync-skills to re-register symlinks
3. Verify YAML frontmatter is valid

## Claude.ai Consultation Format

When a skill or agent needs context that can only come from a Claude.ai session, use this format in the file:

```
**Claude.ai consultation needed:** [Description of what context is needed]
```

And add a corresponding entry to docs/PENDING_DOCUMENT_TASKS.md with:
- What the task is
- Which skill/agent/command it unblocks
- Estimated effort
- The Claude.ai consultation prompt to use

## Instinct Update Protocol

When Claude discovers a pattern worth generalizing during a session:
1. Append it to memory/instincts-learned.md with a [CANDIDATE] tag
2. Include: pattern description, evidence, suggested action
3. The session-stop hook does this automatically for patterns detected in the transcript
4. Use /instinct-learn to review candidates and promote strong ones to instincts/
