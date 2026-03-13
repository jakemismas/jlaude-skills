---
name: upskill
description: Reviews the current conversation to extract patterns, techniques, and gotchas, then updates the relevant skill files. Run at the end of a session to capture what was learned into reusable skills.
---

# /upskill

Review this session and improve skill files based on what was built, debugged, or discovered.

## Workflow

1. **Scan the conversation.** Review the full conversation history and identify:
   - What was built (flows, Apex, LWC, data scripts, documents, configurations)
   - What techniques or patterns were used
   - What gotchas, corrections, or mistakes came up
   - What workarounds were needed (CLI quirks, platform limits, deployment issues)
   - Any decisions made and their reasoning

2. **Match to existing skills.** For each finding, check if a relevant skill already exists:
   - Read the CLAUDE.md index to find matching custom skills
   - Search vendor skills if the topic is outside current custom skills
   - If no skill exists and the pattern is reusable, flag it for a new skill

3. **Classify each finding.** For each pattern or technique, determine:
   - **New pattern**: Not covered by any existing skill. Worth adding.
   - **Refinement**: Existing skill covers the topic but is missing this specific technique, gotcha, or example.
   - **Already covered**: Existing skill already documents this. Skip.
   - **Too specific**: Only applies to this one project/client. Do not add to skills (note in session summary instead).

4. **Draft updates.** For each "new pattern" or "refinement":
   - Read the target SKILL.md file
   - Draft the addition: a new section, additional bullet points, a gotcha entry, or an example
   - Keep additions concise. Skills should be reference material, not narratives.
   - Preserve the existing structure and tone of the skill file

5. **Present changes to Jake.** Before writing anything, show:
   - Which skill files will be updated
   - What will be added to each (brief summary, not full text)
   - Any new skills proposed (name + one-line description)
   - Ask Jake to confirm, modify, or skip each change

6. **Apply approved changes.** For each approved update:
   - Edit the skill file
   - If creating a new custom skill, create the directory and SKILL.md with proper frontmatter
   - Update CLAUDE.md index if a new skill was added

7. **Commit.** Stage and commit the skill updates with a message like:
   ```
   /upskill: update [skill-names] from [project/task description]
   ```

## What makes a good skill addition

- **Reusable**: Would apply to future projects, not just this one
- **Specific**: Concrete technique, command, gotcha, or pattern -- not vague advice
- **Learned the hard way**: Corrections, workarounds, and "do this instead of that" are the most valuable
- **Verified**: The pattern was actually used and worked in this session

## What does NOT belong in skills

- Client-specific data (org IDs, field names, record IDs)
- One-off configurations
- General knowledge that any developer would know
- Patterns already well-documented in the skill

## Examples of good upskill captures

- "When deploying flows, do NOT pass --target-org to sf project deploy resume" (gotcha -> salesforce-flow)
- "Anonymous Apex has a compilation size limit; split scripts by parent record" (pattern -> sf-test-data)
- "Collection filters in screen flows all share one assignNextValueToReference variable" (convention -> salesforce-flow)
- "Write SOQL to a temp file on Windows to avoid CLI quoting issues" (workaround -> sf-test-data)
