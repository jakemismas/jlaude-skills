#!/usr/bin/env node

// Post-tool-use hook: runs linting on written files and logs changes.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SKILLS_DIR = path.join(process.env.HOME || process.env.USERPROFILE || "", "claude-skills");
const CHANGE_LOG = path.join(SKILLS_DIR, "memory", "file-change-log.md");

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

function logChange(filePath, action) {
  const now = new Date().toISOString();
  const entry = `- ${now} | ${action} | ${filePath}\n`;

  try {
    const dir = path.dirname(CHANGE_LOG);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Keep log to last 200 lines
    let existing = "";
    if (fs.existsSync(CHANGE_LOG)) {
      existing = fs.readFileSync(CHANGE_LOG, "utf8");
    } else {
      existing = "# File Change Log\n\n";
    }

    const lines = existing.split("\n");
    if (lines.length > 200) {
      const header = lines.slice(0, 2).join("\n");
      const recent = lines.slice(-150).join("\n");
      existing = header + "\n" + recent + "\n";
    }

    fs.writeFileSync(CHANGE_LOG, existing + entry, "utf8");
  } catch {
    // Non-critical, ignore
  }
}

function tryLint(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  // Apex files: try PMD
  if (ext === ".cls" || ext === ".trigger") {
    try {
      const result = execSync(`pmd check -d "${filePath}" -R apex-quickstart 2>&1`, {
        encoding: "utf8",
        timeout: 30000,
      });
      if (result.trim()) {
        process.stderr.write(`[post-tool-use] PMD results for ${path.basename(filePath)}:\n${result}\n`);
      }
    } catch {
      // PMD not installed, skip silently
    }
  }

  // JavaScript/LWC files: try ESLint
  if (ext === ".js" || ext === ".html") {
    try {
      const result = execSync(`npx eslint "${filePath}" 2>&1`, {
        encoding: "utf8",
        timeout: 30000,
      });
      if (result.trim()) {
        process.stderr.write(`[post-tool-use] ESLint results for ${path.basename(filePath)}:\n${result}\n`);
      }
    } catch {
      // ESLint not available, skip silently
    }
  }

  // Flow metadata: print reminder
  if (filePath.endsWith(".flow-meta.xml")) {
    process.stderr.write(
      `[post-tool-use] Flow file written: ${path.basename(filePath)}\n` +
      `[Reminder] Validate this flow in a sandbox before deploying. Jake deploys to prod via changeset.\n`
    );
  }
}

async function main() {
  const input = await getInput();
  const toolName = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const toolOutput = input.tool_output || {};

  // Only process file write and Bash tool calls
  if (toolName === "Write" || toolName === "write" || toolName === "Edit" || toolName === "edit") {
    const filePath = toolInput.file_path || toolInput.path || "";
    if (filePath) {
      logChange(filePath, "write");
      tryLint(filePath);
    }
  }

  if (toolName === "Bash" || toolName === "bash") {
    const cmd = toolInput.command || "";
    // Detect file creation via bash
    const writeMatch = cmd.match(/>\s*["']?([^\s"']+)/);
    if (writeMatch) {
      logChange(writeMatch[1], "bash-write");
    }
  }
}

main().catch(() => {
  // Non-critical hook, always exit cleanly
});
