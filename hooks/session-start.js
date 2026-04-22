#!/usr/bin/env node

// Session start hook: prints session banner on stderr, and on stdout
// injects the practice-specific CLAUDE.md (salesforce, etc.) via
// additionalContext when the cwd looks like that kind of project. This
// is what makes practice rules auto-apply without per-repo manual setup.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SKILLS_DIR = path.join(process.env.HOME || process.env.USERPROFILE || "", "claude-skills");
const MEMORY_DIR = path.join(SKILLS_DIR, "memory");
const SESSIONS_DIR = path.join(MEMORY_DIR, "sessions");
const INSTINCTS_DIR = path.join(SKILLS_DIR, "instincts");
const WORKING_DIR = path.join(SKILLS_DIR, ".claude-working");

// Markers that identify a given practice by inspecting cwd. First match wins.
// Add new practices here; a file named <practice>-CLAUDE.md at the repo root
// will be auto-injected when any marker matches.
const PRACTICE_MARKERS = [
  {
    name: "salesforce",
    markers: ["sfdx-project.json", "force-app", "config/project-scratch-def.json", "manifest/package.xml"],
  },
  // Future: node, python, etc. can be added here.
];

function log(msg) {
  process.stderr.write(msg + "\n");
}

function detectPractice(cwd) {
  for (const p of PRACTICE_MARKERS) {
    for (const m of p.markers) {
      try {
        if (fs.existsSync(path.join(cwd, m))) return p.name;
      } catch {
        // Ignore access errors
      }
    }
  }
  return null;
}

function loadPracticeContext(practice) {
  const file = path.join(SKILLS_DIR, `${practice}-CLAUDE.md`);
  try {
    if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  } catch {
    // Ignore
  }
  return null;
}

function printBanner() {
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

  try {
    const version = execSync("claude --version 2>/dev/null", { encoding: "utf8" }).trim();
    if (version) log(`Claude Code: ${version}`);
  } catch {
    // Version not available
  }

  log("========================================");

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

  if (fs.existsSync(WORKING_DIR)) {
    try {
      const files = fs.readdirSync(WORKING_DIR).filter((f) => !f.startsWith("."));
      if (files.length > 0) {
        log(`\n[Pending review] ${files.length} file(s) in .claude-working/:`);
        files.slice(0, 10).forEach((f) => log(`  - ${f}`));
        if (files.length > 10) log(`  ... and ${files.length - 10} more`);
      }
    } catch {
      // Ignore
    }
  }

  try {
    const status = execSync("git -C " + JSON.stringify(SKILLS_DIR) + " status --porcelain 2>/dev/null", {
      encoding: "utf8",
    });
    if (status.trim()) {
      log(`\n[Skills repo] Has uncommitted changes.`);
    }
  } catch {
    // Not a git repo
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
    // Remote unavailable
  }

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

function main() {
  printBanner();

  // Detect practice and inject matching context, if any.
  const cwd = process.cwd();
  const practice = detectPractice(cwd);

  if (!practice) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const content = loadPracticeContext(practice);
  if (!content) {
    log(`[Session-start] Detected '${practice}' project but ${practice}-CLAUDE.md not found. No practice rules injected.`);
    process.stdout.write(JSON.stringify({}));
    return;
  }

  log(`[Session-start] Detected '${practice}' project in ${cwd}. Injecting ${practice}-CLAUDE.md rules.`);

  const additionalContext = `## Practice rules auto-loaded: ${practice}\n\nThe current working directory (${cwd}) matched markers for a ${practice} project. The following rules apply for this session in addition to the global config:\n\n${content}`;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext,
      },
    })
  );
}

main();
