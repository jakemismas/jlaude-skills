#!/usr/bin/env node

// Subagent stop hook: prints subagent summary and handoff suggestion.

const fs = require("fs");
const path = require("path");

function getInput() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

// Handoff suggestions based on agent name patterns
const HANDOFFS = {
  "sf-flow-builder": "Use the sf-deploy-manager agent to validate the generated flow in your sandbox.",
  "sf-lwc-builder": "If Apex stubs were generated, use /apex-build to implement them. Then use /deploy to validate.",
  "sf-apex-builder": "Use /deploy to validate the Apex in your target sandbox.",
  "sf-deploy-manager": "Validation complete. If passed, create a changeset in the sandbox and deploy to production manually.",
  "discovery-facilitator": "Discovery notes saved. Use /can-proposal or /can-sow to generate the next document.",
  "proposal-writer": "Proposal draft is in .claude-working/. Review before sharing with the client.",
  "sow-drafter": "SOW draft is in .claude-working/. Review all flagged sections before sending to the client.",
  "org-auditor": "Audit report saved. Review critical findings first and prioritize remediation.",
};

async function main() {
  const input = await getInput();
  const agentName = input.agent_name || input.subagent_name || "unknown";
  const summary = input.summary || input.result_summary || "Subagent completed.";

  process.stderr.write(`\n[subagent-stop] Agent "${agentName}" finished.\n`);
  process.stderr.write(`[subagent-stop] Summary: ${summary}\n`);

  // Find matching handoff suggestion
  const handoff = Object.entries(HANDOFFS).find(([key]) =>
    agentName.toLowerCase().includes(key)
  );

  if (handoff) {
    process.stderr.write(`[subagent-stop] Next step: ${handoff[1]}\n`);
  }
}

main().catch((err) => {
  process.stderr.write(`[subagent-stop] Error: ${err.message}\n`);
});
