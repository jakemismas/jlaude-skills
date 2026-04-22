---
name: instinct-learn
description: Reviews candidate instincts from memory/instincts-learned.md, analyzes session history and git history for recurring patterns, and promotes strong candidates to the instincts/ directory. Use this command periodically to evolve the instinct system.
---

# /instinct-learn

Review and promote learned instincts.

## Workflow

1. **Read candidates.** Open memory/instincts-learned.md. Candidates are tagged `[CANDIDATE-HIGH]`, `[CANDIDATE-MED]`, or `[CANDIDATE-LOW]` by the session-stop hook. Surface HIGH first, then MED. Skip LOW on routine reviews unless volume is low.

2. **Review session history.** Read the last 10 session summaries from memory/sessions/ and look for:
   - Recurring patterns (same type of fix applied multiple times)
   - Repeated mistakes that were corrected
   - Techniques that consistently worked well

3. **Analyze git history.** Run:
   ```
   git log --oneline -20
   ```
   Look for patterns in what got fixed, reverted, or improved. Identify recurring themes.

4. **Score candidates.** For each candidate, assess:
   - How many times has this pattern appeared? (evidence_count)
   - Is there a clear action to take? (actionability)
   - Is this generalizable beyond one session? (generalizability)
   - Assign confidence: high (3+ occurrences, clear action), medium (2 occurrences), low (1 occurrence but strong signal)

5. **Promote strong candidates.** For candidates with medium or high confidence:
   - Create a new instinct file in instincts/ using the standard format (YAML frontmatter + Pattern/Action/Evidence/Examples sections)
   - Update memory/instincts-learned.md to mark the entry as [PROMOTED] with the date

6. **Report.** Output:
   - How many candidates were reviewed
   - How many were promoted (and their names)
   - How many remain as candidates
   - Any new patterns discovered during the review
