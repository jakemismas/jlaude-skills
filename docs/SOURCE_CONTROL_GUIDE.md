# Source Control Guide

## Branching Strategy

No enforced branching strategy. Keep it flexible. Use branches when it makes sense, commit to main when working solo on non-critical changes.

**Hard rule:** Never push metadata directly to a Salesforce production org. Always create a changeset and let Jake deploy manually.

## Git Identity

All commits on this machine are authored by Jake Mismas. This is enforced by:
- Global git config (user.name = "Jake Mismas")
- Pre-tool-use hook (blocks commits with non-Jake authorship)
- git-identity-verify instinct (proactive verification before every commit)

Never add AI co-author trailers. Never use the --author flag.

## Recommended SFDX Project Structure

When starting a new client project from scratch, consider this structure:

```
project-root/
  force-app/
    main/
      default/
        classes/          # Apex classes and test classes
        triggers/         # Apex triggers (handler pattern, no logic in body)
        lwc/              # Lightning Web Components
        flows/            # Flow metadata (.flow-meta.xml)
        objects/          # Custom objects and fields
        layouts/          # Page layouts
        permissionsets/   # Permission sets
        profiles/         # Profiles (if tracked)
  config/                 # Project configuration
  scripts/                # Utility scripts (data loading, org setup)
  docs/                   # Project documentation
  sfdx-project.json       # SFDX project definition
  .forceignore             # Files to exclude from deployment
  .gitignore
```

## Initializing a New Client Project

```bash
# Create SFDX project
sf project generate --name [ProjectName] --template standard

# Initialize git
cd [ProjectName]
git init
git remote add origin [repo-url]

# Set up .gitignore (add to the generated one)
echo ".claude-working/" >> .gitignore
echo ".env" >> .gitignore

# Create initial structure
mkdir -p docs scripts config

# First commit
git add -A
git commit -m "Initialize SFDX project for [ClientName]"
```

## Deployment Workflow

1. Develop in a sandbox (dev-sandbox alias)
2. Validate using `/deploy` command (runs sf project deploy validate)
3. If validation passes, create a changeset in the sandbox UI
4. Jake manually promotes the changeset to production
5. Never automate the production deployment step

## Conflict Resolution

- If a metadata conflict occurs between local and sandbox, the sandbox version wins
- Always pull latest from sandbox before pushing changes
- Use sf project retrieve start to get current sandbox state
