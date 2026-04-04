# Blockers

A blocker prevents work from progressing. Blocked items sit in WIP without advancing — contributing to lead time and cluttering the board without producing value.

## Types of Blockers

### 1. Task Dependency (Natural)

A task within a story cannot start until one or more predecessor tasks are complete.

- Defined as part of the story's task structure
- Visible on the Kanban board (task shown as blocked with a link to what it's waiting on)
- In solo/handover mode these are frequent and create waiting time
- In collaborative mode dependencies can be worked through together, reducing or eliminating the wait

### 2. External Blockers

Something outside the team's control prevents progress on a task or story. Examples:
- Waiting for a third-party API to be available
- Waiting for a decision from a stakeholder
- Compliance approval needed before proceeding

External blockers are random events — they occur with a configurable probability, not by facilitator intervention.

### 3. Human Blockers (Absence)

A team member becomes unavailable due to vacation or sickness. While absent:
- Their in-progress tasks become blocked
- No new tasks can be assigned to them
- Duration is set by the facilitator (e.g. absent for 2 days)

**Vacation (planned)**: determined by the system at the start of the game for all team members. Displayed on the facilitator's screen so the team can see it coming and plan around it. This tests whether the team actually uses the information.

**Sick days (unplanned)**: can happen at any time without warning. Probability and randomness mechanism TBD.

**Taking over a blocked task**: during the daily standup, any available team member can choose to pick up an absent colleague's task. The penalty is their own skill level in the required discipline — a low-skilled player will roll fewer dice and progress slower.

An additional penalty for "figuring out where the absentee left off" may be added later to simulate the cost of context transfer (TBD).

Human blockers are a powerful demonstration of:
- The risk of knowledge silos (only one person can do this work)
- The value of cross-skilling (a teammate who leveled up can cover)
- The impact on WIP and lead time even when the team is otherwise productive

## Random Events System

Blockers — external blockers and sick days — are driven by a shared random events system. Probabilities are hard-coded and tuned through dry-runs of the game, not by the facilitator at runtime.

The system is modular: each behaviour can be independently enabled or disabled. This supports incremental testing during development and allows sessions to start simple and add complexity over time.

Behaviours that can be toggled:
- External blockers
- Sick days
- Planned absence (vacation)
- Quitting
- Hiring

Tunable parameters (values TBD through playtesting):
- Probability of an external blocker occurring per task per day
- Probability of a team member calling in sick on any given day
- Duration ranges for each blocker type

## Blockers on the Facilitator Screen

Blocked items are visually distinct on the Kanban board. The facilitator screen also shows:
- Count of currently blocked items
- Average time items have been blocked
- Which blocker type is causing the most disruption
