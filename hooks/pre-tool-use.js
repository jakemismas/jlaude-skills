#!/usr/bin/env node

// Pre-tool-use hook: blocks destructive operations, enforces safety guardrails.
// Runs before every Bash and file write tool call.

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

function block(reason, suggestion) {
  const msg = `BLOCKED: ${reason}`;
  const suggest = suggestion ? `\nSuggestion: ${suggestion}` : "";
  process.stdout.write(JSON.stringify({ decision: "block", reason: msg + suggest }));
  process.exit(0);
}

function allow() {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
  process.exit(0);
}

// Destructive command patterns
const DESTRUCTIVE_BASH = [
  { pattern: /\brm\s+(-[^\s]*\s+)*/, reason: "rm command detected", suggestion: "Move files to .claude-working/ instead of deleting" },
  { pattern: /\brmdir\b/, reason: "rmdir command detected", suggestion: "Move directories to .claude-working/ instead of deleting" },
  { pattern: /\bunlink\b/, reason: "unlink command detected", suggestion: "Move files to .claude-working/ instead of deleting" },
  { pattern: /\bsudo\s+rm\b/, reason: "sudo rm detected", suggestion: "Never use sudo rm. Ask Jake for confirmation first" },
  { pattern: /\bdd\s+/, reason: "dd command detected (disk-level operation)", suggestion: "Disk-level commands require explicit Jake confirmation" },
  { pattern: /\bmkfs\b/, reason: "mkfs detected (filesystem creation)", suggestion: "Filesystem commands require explicit Jake confirmation" },
  { pattern: /\bfdisk\b/, reason: "fdisk detected (disk partitioning)", suggestion: "Disk commands require explicit Jake confirmation" },
  { pattern: /\bchmod\s+(-R\s+)?777\b/, reason: "chmod 777 detected (broad permission change)", suggestion: "Use specific permissions instead of 777" },
];

// Repos where direct push to main is allowed (personal skill repos, not shared codebases)
const PUSH_TO_MAIN_ALLOWED_REPOS = [
  "jlaude-skills",
  "claude-skills",
];

const GIT_DANGEROUS = [
  { pattern: /\bgit\s+push\s+.*\b(main|master)\b/, reason: "Direct push to main/master", suggestion: "Create a branch and open a PR instead", skipInAllowedRepos: true },
  { pattern: /\bgit\s+.*--force\b/, reason: "Git force flag detected", suggestion: "Avoid force operations. Use safe alternatives" },
  { pattern: /\bgit\s+.*\s+-f\b/, reason: "Git force shorthand detected", suggestion: "Avoid force operations. Use safe alternatives" },
  { pattern: /\bgit\s+reset\s+--hard\b/, reason: "git reset --hard detected", suggestion: "Use git stash or create a backup branch first" },
];

const SQL_DANGEROUS = [
  { pattern: /\bDROP\s+TABLE\b/i, reason: "DROP TABLE detected", suggestion: "Never drop tables without explicit Jake confirmation" },
  { pattern: /\bDELETE\s+FROM\s+\w+\s*(?!.*WHERE)/i, reason: "DELETE FROM without WHERE clause", suggestion: "Always include a WHERE clause in DELETE statements" },
  { pattern: /\bTRUNCATE\b/i, reason: "TRUNCATE detected", suggestion: "Never truncate tables without explicit Jake confirmation" },
];

const SF_DANGEROUS = [
  { pattern: /\bsf\s+project\s+deploy\s+.*(?:production|prod)\b/i, reason: "Deploy targeting production org", suggestion: "Create a changeset instead. Jake deploys to prod manually" },
  { pattern: /\bsfdx\s+force:source:deploy\s+.*(?:production|prod)\b/i, reason: "SFDX deploy targeting production", suggestion: "Create a changeset instead. Jake deploys to prod manually" },
  { pattern: /--purge-on-delete\b/, reason: "Purge on delete flag detected", suggestion: "Destructive deployments need explicit Jake confirmation" },
  { pattern: /\bdestructiveChanges\.xml\b/, reason: "Destructive changes manifest detected", suggestion: "Destructive deployments need explicit Jake confirmation" },
];

// Strip quoted strings and heredocs from a command so patterns inside
// string literals do not trigger false positives.
function stripQuotedStrings(cmd) {
  let stripped = cmd;
  // Remove heredoc blocks (<<'EOF' ... EOF or << EOF ... EOF)
  stripped = stripped.replace(/<<-?\s*'?(\w+)'?[\s\S]*?\n\1/g, "__HEREDOC__");
  // Remove single-quoted strings
  stripped = stripped.replace(/'[^']*'/g, "'__QUOTED__'");
  // Remove double-quoted strings (handle escaped quotes)
  stripped = stripped.replace(/"(?:[^"\\]|\\.)*"/g, '"__QUOTED__"');
  return stripped;
}

async function main() {
  const input = await getInput();
  const toolName = input.tool_name || "";
  const toolInput = input.tool_input || {};

  // Only check Bash and file write tools
  if (toolName === "Bash" || toolName === "bash") {
    const cmd = toolInput.command || "";
    // Use stripped version for pattern checks to avoid false positives
    // on patterns that appear inside string literals or heredocs
    const cmdCheck = stripQuotedStrings(cmd);

    // Check destructive bash commands
    for (const check of DESTRUCTIVE_BASH) {
      if (check.pattern.test(cmdCheck)) {
        block(check.reason, check.suggestion);
        return;
      }
    }

    // Check dangerous git commands
    for (const check of GIT_DANGEROUS) {
      if (check.pattern.test(cmdCheck)) {
        // Allow push to main for whitelisted repos (personal skill repos)
        if (check.skipInAllowedRepos) {
          const cwd = process.cwd();
          const inAllowedRepo = PUSH_TO_MAIN_ALLOWED_REPOS.some((repo) => cwd.includes(repo));
          if (inAllowedRepo) continue;
        }
        block(check.reason, check.suggestion);
        return;
      }
    }

    // Check dangerous SQL
    for (const check of SQL_DANGEROUS) {
      if (check.pattern.test(cmdCheck)) {
        block(check.reason, check.suggestion);
        return;
      }
    }

    // Check Salesforce production deploys
    for (const check of SF_DANGEROUS) {
      if (check.pattern.test(cmdCheck)) {
        block(check.reason, check.suggestion);
        return;
      }
    }

    // Check git commit author identity
    if (/\bgit\s+commit\b/.test(cmdCheck)) {
      if (/--author\b/.test(cmd)) {
        block("Custom --author flag on git commit", "All commits must be authored by Jake Mismas. Remove --author flag");
        return;
      }
      if (/GIT_AUTHOR_NAME|GIT_COMMITTER_NAME|GIT_COMMITTER_EMAIL/.test(cmd)) {
        block("Overriding git author environment variables", "All commits must be attributed to Jake Mismas only");
        return;
      }
      if (/Co-authored-by.*Claude/i.test(cmd) || /Co-authored-by.*AI/i.test(cmd) || /Co-Authored-By.*anthropic/i.test(cmd)) {
        block("AI co-author trailer detected in commit message", "All commits must be authored by Jake Mismas only, no AI attribution");
        return;
      }
    }
  }

  // File write backup enforcement
  if (toolName === "Write" || toolName === "write" || toolName === "Edit" || toolName === "edit") {
    const filePath = toolInput.file_path || toolInput.path || "";

    // Skip backup for files in safe directories
    const safeDirs = [".claude-working", "claude-skills", "node_modules", ".git"];
    const isSafe = safeDirs.some((d) => filePath.includes(d));

    if (filePath && !isSafe && fs.existsSync(filePath)) {
      const workingDir = path.join(
        process.env.HOME || process.env.USERPROFILE || "",
        "claude-skills",
        ".claude-working"
      );

      try {
        if (!fs.existsSync(workingDir)) {
          fs.mkdirSync(workingDir, { recursive: true });
        }
        const basename = path.basename(filePath);
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupPath = path.join(workingDir, `${basename}.bak.${timestamp}`);
        fs.copyFileSync(filePath, backupPath);

        // Notify but do not block
        process.stderr.write(`[pre-tool-use] Backup created: ${backupPath}\n`);
      } catch (err) {
        process.stderr.write(`[pre-tool-use] Warning: could not create backup: ${err.message}\n`);
      }
    }
  }

  allow();
}

main().catch(() => allow());
