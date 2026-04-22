#!/usr/bin/env node

// Session stop hook: writes session summary and auto-captures ranked
// instinct candidates to memory/instincts-learned.md. Candidates are
// tagged [CANDIDATE-HIGH], [CANDIDATE-MED], or [CANDIDATE-LOW] so
// /instinct-learn can surface the most valuable ones first. No skill
// file is ever modified here; promotion stays manual.

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

// Heuristics for scoring a candidate line.
// HIGH: explicit user correction, "we learned", "gotcha"-type confirmation.
// MED:  workaround, CLI flag quirk, specific platform behavior.
// LOW:  generic observation, might be noise.
function classifyCandidate(line) {
  const l = line.toLowerCase();

  const highSignals = [
    "no, don't", "no, do not", "stop doing", "never do",
    "we got burned", "we learned", "do not", "don't ever",
    "correction:", "fix:", "the issue was",
  ];
  const medSignals = [
    "gotcha", "workaround", "hack around", "cli quirk",
    "undocumented", "silently fails", "does not work when",
    "only works if", "platform limit", "version-specific",
  ];
  const lowSignals = [
    "by the way", "fyi", "note that", "one thing",
  ];

  if (highSignals.some((s) => l.includes(s))) return "HIGH";
  if (medSignals.some((s) => l.includes(s))) return "MED";
  if (lowSignals.some((s) => l.includes(s))) return "LOW";
  return null;
}

function extractCandidates(transcript) {
  if (!transcript || typeof transcript !== "string") return [];
  const lines = transcript.split("\n").map((l) => l.trim()).filter((l) => l.length > 20);

  const seen = new Set();
  const candidates = [];

  for (const line of lines) {
    const rank = classifyCandidate(line);
    if (!rank) continue;
    const key = line.slice(0, 80).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    candidates.push({ rank, line });
  }

  // Keep up to 10 highest-ranked to avoid noise.
  const order = { HIGH: 0, MED: 1, LOW: 2 };
  candidates.sort((a, b) => order[a.rank] - order[b.rank]);
  return candidates.slice(0, 10);
}

function appendCandidates(candidates, now) {
  if (candidates.length === 0) return 0;
  ensureDir(MEMORY_DIR);

  // Ensure the file exists with a header.
  if (!fs.existsSync(INSTINCTS_FILE)) {
    fs.writeFileSync(
      INSTINCTS_FILE,
      "# Instincts Learned\n\nAuto-captured candidates from session-stop. Review with /instinct-learn to promote or reject.\n\n",
      "utf8"
    );
  }

  const stamp = now.toISOString();
  const block = [
    `\n## Candidates from ${stamp}`,
    ...candidates.map((c) => `- [CANDIDATE-${c.rank}] ${c.line}`),
    "",
  ].join("\n");

  fs.appendFileSync(INSTINCTS_FILE, block, "utf8");
  return candidates.length;
}

function extractSection(text, section) {
  if (!text) return "- Not captured automatically";
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
  return relevant.length > 0
    ? relevant.slice(0, 5).map((l) => `- ${l.trim()}`).join("\n")
    : "- Not captured automatically";
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

  const summary = `# Session: ${now.toISOString()}

## Goal
${extractSection(transcript, "goal")}

## Completed
${extractSection(transcript, "completed")}

## In Progress
${extractSection(transcript, "in_progress")}

## Blockers
${extractSection(transcript, "blockers")}

## Next Suggested Action
${extractSection(transcript, "next_action")}
`;

  const sessionPath = path.join(SESSIONS_DIR, filename);
  fs.writeFileSync(sessionPath, summary, "utf8");
  process.stderr.write(`[session-stop] Session summary written to memory/sessions/${filename}\n`);

  // Capture ranked instinct candidates.
  const candidates = extractCandidates(transcript);
  const captured = appendCandidates(candidates, now);
  if (captured > 0) {
    const counts = candidates.reduce((acc, c) => {
      acc[c.rank] = (acc[c.rank] || 0) + 1;
      return acc;
    }, {});
    const summaryStr = Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ");
    process.stderr.write(`[session-stop] ${captured} instinct candidate(s) captured (${summaryStr}). Run /instinct-learn to review.\n`);
  }

  const nextAction = extractSection(transcript, "next_action");
  process.stderr.write(`\n[Next action] ${nextAction}\n`);
}

main().catch((err) => {
  process.stderr.write(`[session-stop] Error: ${err.message}\n`);
});
