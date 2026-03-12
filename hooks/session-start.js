#!/usr/bin/env node

// Session start hook: prints session header, loads context, reports status.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SKILLS_DIR = path.join(process.env.HOME || process.env.USERPROFILE || "", "claude-skills");
const MEMORY_DIR = path.join(SKILLS_DIR, "memory");
const SESSIONS_DIR = path.join(MEMORY_DIR, "sessions");
const INSTINCTS_DIR = path.join(SKILLS_DIR, "instincts");
const WORKING_DIR = path.join(SKILLS_DIR, ".claude-working");

function log(msg) {
  process.stderr.write(msg + "\n");
}

function main() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", { hour12: true });

  log("========================================");
  log(`Session started: ${dateStr} at ${timeStr}`);

  // Try to detect Claude Code version
  try {
    const version = execSync("claude --version 2>/dev/null", { encoding: "utf8" }).trim();
    if (version) log(`Claude Code: ${version}`);
  } catch {
    // Version detection not available
  }

  log("========================================");

  // Load and print org context
  const orgContextPath = path.join(MEMORY_DIR, "org-context.md");
  if (fs.existsSync(orgContextPath)) {
    const content = fs.readFileSync(orgContextPath, "utf8");
    if (content.includes("[Jake fills in")) {
      log("\n[Reminder] org-context.md has placeholder values that need to be filled in.");
    } else {
      log("\nOrg context loaded from memory/org-context.md");
    }
  } else {
    log("\n[Reminder] memory/org-context.md does not exist. Populate it with org aliases and conventions.");
  }

  // Report pending files in .claude-working/
  if (fs.existsSync(WORKING_DIR)) {
    try {
      const files = fs.readdirSync(WORKING_DIR).filter((f) => !f.startsWith("."));
      if (files.length > 0) {
        log(`\n[Pending review] ${files.length} file(s) in .claude-working/:`);
        files.slice(0, 10).forEach((f) => log(`  - ${f}`));
        if (files.length > 10) log(`  ... and ${files.length - 10} more`);
      }
    } catch {
      // Ignore read errors
    }
  }

  // Git status of skills repo
  try {
    const status = execSync("git -C " + JSON.stringify(SKILLS_DIR) + " status --porcelain 2>/dev/null", {
      encoding: "utf8",
    });
    if (status.trim()) {
      log(`\n[Skills repo] Has uncommitted changes.`);
    }
  } catch {
    // Not a git repo or git not available
  }

  try {
    execSync("git -C " + JSON.stringify(SKILLS_DIR) + " fetch --quiet 2>/dev/null");
    const behind = execSync(
      "git -C " + JSON.stringify(SKILLS_DIR) + " rev-list --count HEAD..origin/main 2>/dev/null",
      { encoding: "utf8" }
    ).trim();
    if (behind && parseInt(behind) > 0) {
      log(`[Skills repo] ${behind} commit(s) behind origin/main. Run /sync-skills to update.`);
    }
  } catch {
    // Remote not available or not configured
  }

  // Print last 3 session summaries
  if (fs.existsSync(SESSIONS_DIR)) {
    try {
      const sessions = fs
        .readdirSync(SESSIONS_DIR)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .reverse()
        .slice(0, 3);

      if (sessions.length > 0) {
        log("\n--- Recent sessions ---");
        sessions.forEach((s) => {
          const content = fs.readFileSync(path.join(SESSIONS_DIR, s), "utf8");
          const firstLines = content.split("\n").slice(0, 5).join("\n");
          log(`\n[${s}]`);
          log(firstLines);
        });
        log("--- End recent sessions ---");
      }
    } catch {
      // Ignore
    }
  }

  // Count active instincts
  if (fs.existsSync(INSTINCTS_DIR)) {
    try {
      const instincts = fs.readdirSync(INSTINCTS_DIR).filter((f) => f.endsWith(".md"));
      log(`\nActive instincts: ${instincts.length}`);
    } catch {
      // Ignore
    }
  }

  log("\n========================================\n");
}

main();
