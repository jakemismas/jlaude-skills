---
name: upskill
description: Reviews the current conversation to extract patterns, techniques, and gotchas, then updates the relevant skill files. Run at the end of a session to capture what was learned into reusable skills.
---

# /upskill

Review this session and improve skill files based on what was built, debugged, or discovered.

## Quality gate: the 5-minute test

Before capturing ANYTHING, apply this filter:

> "Would having this written down save me 5+ minutes in a future session?"

If the answer is not a clear yes, skip it. Most sessions produce 0-3 captures. A session with zero captures is normal and healthy -- it means the skills already covered what was needed.

## Workflow

1. **Scan the conversation.** Review the full conversation history. Look ONLY for:
   - Corrections: something was done wrong and had to be fixed
   - Workarounds: a platform limit, CLI quirk, or tooling issue required a non-obvious solution
   - Gotchas: a reasonable approach failed for a surprising reason
   - Techniques: a specific, concrete approach that worked and would not be the first thing someone tries

   Do NOT capture:
   - What was built (that belongs in the session summary, not skills)
   - Decisions and their reasoning (that belongs in memory or commit messages)
   - Anything that worked on the first try without surprises

   **If the scan produces zero candidates, stop here.** Report "No skill updates from this session" and exit. Do not force captures to justify running /upskill.

2. **Verify novelty.** For each candidate, grep the existing skill files:
   ```
   grep -r "<key phrase>" ~/claude-skills/skills/
   ```
   If the concept is already documented, skip it. If a related section exists but is missing this specific detail, it qualifies as a refinement.

3. **Classify strictly.** Each candidate must be exactly one of:
   - **Refinement**: An existing skill section is missing this specific gotcha, workaround, or technique. The addition is 1-5 lines.
   - **New section**: The topic fits an existing skill but has no section for it. The addition is a headed section with 3-10 lines.
   - **New skill**: No existing skill covers this domain AND you expect 3+ future sessions to benefit. Rare -- most sessions do not warrant a new skill.
   - **Reject**: Fails the 5-minute test, is already covered, is too generic, is client-specific, or is something any experienced developer would already know. This should be the most common classification.

4. **Present to Jake.** Before writing anything, show a numbered list:
   ```
   1. [REFINEMENT] sf-apex-patterns: Mixed DML workaround using System.runAs -- 3 lines
   2. [REJECT] General SOQL best practice -- already documented
   3. [REJECT] Client field name mapping -- too specific
   ```
   Wait for Jake to confirm. He may reject items you proposed or ask for modifications.

5. **Apply approved changes only.** For each approved item:
   - Read the target SKILL.md
   - Add the minimum necessary text. No preamble, no narrative, no "as we learned in this session"
   - Preserve existing structure and tone
   - If creating a new skill, create directory + SKILL.md with proper frontmatter and update CLAUDE.md index

6. **Commit.** Stage and commit:
   ```
   /upskill: update [skill-names] from [project/task description]
   ```

## Rejection criteria (hard rules)

Skip the candidate if ANY of these apply:
- It passed on the first try without any debugging or correction
- You could find it in the first page of the official documentation
- It only applies to one specific client, org, or project
- The skill file already covers it (even in different words)
- It is a general best practice (e.g., "bulkify your triggers", "write test classes")
- It is advice rather than a concrete technique (e.g., "consider performance" vs. "use Database.Stateful to track cross-batch state")
- The session did not actually verify it worked
- It is self-referential (e.g., "we ran /upskill", "the flow-build command was used", "skills were synced")
- It cannot be stated as a concrete, observable action -- if you cannot write it as "do X" or "do not do Y", it is not specific enough

## Examples of good captures

- "When deploying flows, do NOT pass --target-org to sf project deploy resume" (gotcha -> sf-flow)
- "Anonymous Apex has a compilation size limit; split scripts by parent record" (workaround -> sf-test-data)
- "On Windows, ln -sf silently fails in Git Bash; use cp -r with rm -rf cleanup instead" (workaround -> new candidate)
- "Mixed DML: update User outside System.runAs, non-setup DML inside" (gotcha -> sf-apex-patterns)

## Examples of bad captures (reject these)

- "We built a record-triggered flow for Opportunity" (what was built, not a technique)
- "Always validate before deploying" (already in CLAUDE.md and sf-sandbox-first instinct)
- "Use async Apex for long-running operations" (general knowledge, first page of docs)
- "Client X uses a custom field called Revenue_Bucket__c" (client-specific)
- "We ran /upskill and updated sf-apex-patterns" (self-referential noise)
- "Consider using Named Credentials for callouts" (advice, not a concrete technique)

## Maintenance

Skill files should not grow indefinitely. When running /upskill, also scan the target skill for entries that are now obsolete (platform behavior changed, CLI flag was removed, workaround is no longer needed). Flag these for removal. A skill with 50+ bullet points is a sign of accumulation without pruning.
