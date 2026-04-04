# Quality

Quality has two distinct dimensions that interact with each other and with the game's mechanics.

## Internal Quality

**Definition**: How easy it is to change the product.

Represents the health of the codebase, architecture, and infrastructure. Low internal quality is technical debt made tangible.

**How it surfaces**: Internal quality is not shown as a metric or a bar. Instead, it surfaces as the **emotional state of team members**. Characters express happiness or unhappiness while working in the product. Players feel the quality of the codebase through their character — just as real developers do.

- High internal quality → characters feel good, energised, effective
- Declining internal quality → characters grow frustrated, demotivated
- Low internal quality → characters are visibly unhappy; working in the codebase feels like a struggle

This is intentionally indirect. The team has to notice and interpret what their characters are feeling, rather than reading a score.

**Mechanical effects**:
- Unhappy characters may have a penalty to their dice rolls (working in a poor codebase slows you down)
- Very low internal quality may generate unplanned work items (bugs, incidents) that interrupt flow
- Internal quality can be improved through deliberate refactoring (see Refactoring Strategies below)

## External Quality

**Definition**: How well the end user experiences the product.

Represents correctness, reliability, and usability as perceived by users.

**Effects in gameplay**:
- Low external quality may generate incoming bug reports or complaints — new unplanned work entering the backlog
- High external quality contributes to a product "score" visible on the facilitator screen

## How Quality Is Affected

| Action | Internal Quality | External Quality |
|---|---|---|
| Solo work on a task | Neutral / slight risk | Neutral |
| Collaborative work (pair/mob) | Improves | Improves |
| Rushing (skipping checks) | Decreases | Decreases |
| Refactoring tasks | Improves | No direct effect |
| Ignoring defects | — | Decreases over time |

## Quality and Collaboration

Collaboration (pair or mob) produces higher quality output at the cost of time:
- The task takes longer (more dice rolls or higher difficulty threshold)
- But quality contributions are higher
- And participants may gain skill XP in the involved disciplines

This creates a deliberate tension: optimising for speed degrades quality; investing in collaboration pays off over multiple rounds.

## Refactoring Strategies

Refactoring improves internal quality but delivers no direct user value. Teams can choose when and how to invest in it. Multiple strategies exist, each with different tradeoffs:

| Strategy | When | Scope | Cost |
|---|---|---|---|
| **Just-in-time** | Immediately before or after working on an area | Local — the area being touched | Small, absorbed into normal flow |
| **Team decision** | Planned at the start of a day/sprint | Targeted area agreed by the team | Moderate — explicit capacity allocation |
| **Redesign** | Scheduled as a dedicated effort | Larger architectural scope | High — significant time, no feature output |

The choice of refactoring strategy is a team decision during the game. The facilitator does not mandate it — the team must feel the pain of declining internal quality (through their characters' unhappiness) and decide whether and how to act on it.
