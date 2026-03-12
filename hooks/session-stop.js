#!/usr/bin/env node

// Session stop hook: writes session summary and captures learned instincts.

const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(process.env.HOME || process.env.USERPROFILE || "", "claude-skills");
const MEMORY_DIR = path.join(SKILLS_DIR, "memory");
const SESSIONS_DIR = path.join(MEMORY_DIR, "sessions");
const INSTINCTS_FILE = path.join(MEMORY_DIR, "instincts-learned.md");

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

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  const input = await getInput();
  const transcript = input.transcript_summary || input.session_summary || "";

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const filename = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(
    now.getHours()
  )}-${pad(now.getMinutes())}.md`;

  ensureDir(SESSIONS_DIR);

  // Write session summary
  const summary = `# Session: ${now.toISOString()}

## Goal
${transcript ? extractSection(transcript, "goal") : "[Auto-captured session]"}

## Completed
${transcript ? extractSection(transcript, "completed") : "- See session transcript"}

## In Progress
${transcript ? extractSection(transcript, "in_progress") : "- None flagged"}

## Blockers
${transcript ? extractSection(transcript, "blockers") : "- None"}

## Next Suggested Action
${transcript ? extractSection(transcript, "next_action") : "- Review session transcript for follow-ups"}
`;

  const sessionPath = path.join(SESSIONS_DIR, filename);
  fs.writeFileSync(sessionPath, summary, "utf8");
  process.stderr.write(`[session-stop] Session summary written to memory/sessions/${filename}\n`);

  // Print next suggested action to transcript
  const nextAction = transcript ? extractSection(transcript, "next_action") : "Review what was worked on and continue from there";
  process.stderr.write(`\n[Next action] ${nextAction}\n`);
}

function extractSection(text, section) {
  // Simple extraction: look for keywords in the transcript
  const lines = text.split("\n");
  const keywords = {
    goal: ["goal", "objective", "working on", "task"],
    completed: ["completed", "finished", "done", "built", "created", "wrote"],
    in_progress: ["in progress", "working on", "started", "continuing"],
    blockers: ["blocked", "blocker", "stuck", "waiting", "need"],
    next_action: ["next", "todo", "follow up", "should"],
  };

  const relevant = lines.filter((line) =>
    (keywords[section] || []).some((kw) => line.toLowerCase().includes(kw))
  );

  return relevant.length > 0 ? relevant.slice(0, 5).map((l) => `- ${l.trim()}`).join("\n") : "- Not captured automatically";
}

main().catch((err) => {
  process.stderr.write(`[session-stop] Error: ${err.message}\n`);
});
