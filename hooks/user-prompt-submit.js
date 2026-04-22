#!/usr/bin/env node

// UserPromptSubmit hook: keyword-matches the incoming prompt against
// skill-rules.json and injects a system reminder suggesting any matched
// skills. The suggestion is advisory; Claude still decides whether to
// invoke the Skill tool. Keeps attention weighting high on skill usage.

const fs = require("fs");
const path = require("path");

const HOOK_DIR = __dirname;
const RULES_FILE = path.join(HOOK_DIR, "skill-rules.json");

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

function allow(extraContext) {
  const out = extraContext
    ? { decision: "allow", hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: extraContext } }
    : { decision: "allow" };
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

function loadRules() {
  try {
    const raw = fs.readFileSync(RULES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.skills || {};
  } catch {
    return {};
  }
}

function matchSkills(prompt, rules) {
  const lower = prompt.toLowerCase();
  const matches = [];

  for (const [skill, cfg] of Object.entries(rules)) {
    const keywords = cfg.keywords || [];
    const hits = keywords.filter((kw) => {
      const k = kw.toLowerCase();
      // Word-boundary match for single words. Phrase match for multi-word.
      if (k.includes(" ")) {
        return lower.includes(k);
      }
      const re = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      return re.test(prompt);
    });
    if (hits.length > 0) {
      matches.push({ skill, hits });
    }
  }

  return matches;
}

async function main() {
  const input = await getInput();
  const prompt = input.prompt || input.user_prompt || "";

  if (!prompt || prompt.length < 3) {
    return allow();
  }

  const rules = loadRules();
  if (Object.keys(rules).length === 0) {
    return allow();
  }

  const matches = matchSkills(prompt, rules);
  if (matches.length === 0) {
    return allow();
  }

  // Rank by hit count so the most relevant skill surfaces first.
  matches.sort((a, b) => b.hits.length - a.hits.length);

  const lines = matches.slice(0, 5).map(
    (m) => `- ${m.skill} (matched: ${m.hits.slice(0, 3).join(", ")})`
  );

  const reminder = [
    "Skill suggestions based on prompt keywords. Load relevant skills via the Skill tool before acting:",
    ...lines,
  ].join("\n");

  allow(reminder);
}

main().catch(() => allow());
