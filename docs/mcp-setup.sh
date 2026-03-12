#!/usr/bin/env bash
# MCP Server Setup for Salesforce
# Run this script after filling in actual org aliases in memory/org-context.md
#
# IMPORTANT: Replace "production", "dev-sandbox", and "client-sandbox" with your actual
# org alias names from `sf org list`.

# Production org: READ ONLY (query and metadata inspection only, never deploy)
claude mcp add salesforce-prod \
  -s user \
  -- npx -y @salesforce/mcp --orgs production --toolsets query,metadata

# Dev sandbox: Full access (primary dev environment)
claude mcp add salesforce-dev \
  -s user \
  -- npx -y @salesforce/mcp --orgs dev-sandbox --toolsets all

# Client sandbox: Full access (client UAT environment)
claude mcp add salesforce-client \
  -s user \
  -- npx -y @salesforce/mcp --orgs client-sandbox --toolsets all

echo "MCP servers registered. Verify with: claude mcp list"
echo ""
echo "REMINDER: Update the org alias names above with your actual aliases from 'sf org list'"
