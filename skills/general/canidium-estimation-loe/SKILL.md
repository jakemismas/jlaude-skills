---
name: canidium-estimation-loe
description: Produces filled Level of Effort (LOE) worksheets for Canidium consulting change requests and new requirements. Breaks each requirement into Plan, Configure, Test, and Deploy hours with low and high ranges, then writes a confidence note the PM can pass to the customer. Load this skill whenever the user asks to estimate, size, scope, or build an LOE for a change request, requirement, or backlog item, even if they do not explicitly say "LOE". Also load when the user hands over a raw requirement list and asks how long something will take.
source: https://sites.google.com/canidium.com/lpmo/quick-guides/estimation-basics
---

# Canidium Estimation LOE

Turns a list of requirements into a filled LOE worksheet in the Canidium standard format. The output is handed to the PM, who finalizes it and communicates the number to the customer.

## Output shape

Per requirement, produce one worksheet block with these columns:

| Phase | Low (hrs) | High (hrs) | Considerations |

The phases, in order, are Plan, Configure, Test, Deploy.

After all requirement blocks, include:

- Subtotals per phase and a grand total (low and high)
- An SA uplift line at roughly 5% of the total, left for the PM to finalize
- A PM uplift line at roughly 10% of the total, left for the PM to finalize
- A confidence note for the PM (see below)

## What belongs in each phase

**Plan.** Discovery meetings, requirement clarification, FRD updates, design discussion, architecture decisions, and dependency mapping. Include ramp time if a new team member will pick this up.

**Configure.** Build time in the target system. Include research time if the requirement is unusual, internal collaboration with other consultants, and any show-and-shares on partial progress.

**Test.** Unit test, SIT, test case documentation, UAT support, extra test cycles the client has asked for, and troubleshooting time during UAT.

**Deploy.** Migration activities, manual push steps, post-deploy unit test, operations guide updates, and any training material refresh.

## Estimation discipline

1. Start bottom-up when the requirements are concrete. Break each requirement into its four phases and estimate each. Use top-down only as an order-of-magnitude gut check, not the primary number.
2. Always produce a low and a high. A single number hides risk. The spread is the signal to the PM.
3. Accuracy over optics. Do not shrink an estimate because the total looks big. If the honest number is 40 hours, write 40. Guilt-shrinking is the most common failure mode in this worksheet.
4. Flag dependencies in the Considerations column. If a requirement collides with another, or depends on a client decision, say so and let the high end reflect the risk.
5. Do not fill in SA or PM uplift hours. Show the line items so the PM sees them, but the actual hours are PM-owned.

## The confidence note

One short paragraph per LOE, addressed to the PM. Cover:

- Confidence level (high, medium, low) with one sentence of reasoning
- What pushed the range wide, if it is wide
- Any requirement that needs a specific call-out before the customer sees a number
- Any scope ambiguity the PM should resolve before the LOE is finalized

Example: "Medium confidence on this LOE. The commission plan change (Req 2) is straightforward, but the report rewrite (Req 4) is ambiguous between update-existing and rebuild, and the range reflects both interpretations. Recommend confirming intent with the customer before locking the number. Req 3 assumes Xactly Connect access is already provisioned."

## Common failure modes

- Only counting build time. Plan, Test, and Deploy routinely add 30 to 60 percent on top of Configure. A 4-hour Configure is almost never a 4-hour requirement.
- Padding the low instead of raising the high. When a requirement is risky, widen the range. Do not quietly inflate the low number.
- Burying assumptions in prose. Assumptions go in the Considerations column, one line each, so the PM and the customer can see them.
- Filling SA or PM hours. Those are PM-owned. Hand over a consultant-side LOE the PM can wrap.
- Estimating from memory without naming a comparable past project. If similar work exists, cite it in the confidence note. If nothing comparable exists, say that instead.
