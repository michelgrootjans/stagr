# Work Items

## Hierarchy

Work is structured in four levels:

```
Epic
 └── Feature
      └── Story
           └── Task
```

| Level | Description |
|---|---|
| **Epic** | A large business outcome or product capability (e.g. "User authentication") |
| **Feature** | A meaningful slice of an epic deliverable to users (e.g. "Login with email/password") |
| **Story** | A user-facing behaviour within a feature (e.g. "User sees an error on wrong password") |
| **Task** | A concrete unit of work a team member executes (e.g. "Implement password hash check") |

Tasks are what players actually work on. Stories, Features, and Epics complete when all their children are done.

## Game Balance (indicative, to be tuned through playtesting)

| Level | Children | Notes |
|---|---|---|
| Task | — | Single skill. 1–10 per story; typical 2–5, 10 is exceptional. |
| Story | 1–10 tasks | A user-facing behaviour |
| Feature | TBD stories | A deliverable slice of an Epic |
| Epic | TBD features | A major product capability |

**Target throughput**: 1–3 stories per week per player. For a team of 5 over a month this implies a backlog of roughly 20–60 stories — exact size to be determined through playtesting. The backlog must be large enough that no mode of working clears it entirely, so the team always feels the pressure of choices.

## Backlog Design

All work items in a game are fixed and pre-authored — not randomly generated. The same Epics, Features, Stories, and Tasks appear in every round. This is essential so that rounds are directly comparable: the only variable between rounds is how the team organises their work, not what work exists.

The backlog is defined in a configuration file — easily editable without touching game logic. The initial backlog will be built around **Stagr** (a concert and festival app) but the structure supports any product domain.

Random events (sick days, external blockers) use the same random seed across all rounds within a session. This ensures that disruptions are identical every round — so differences in outcome are attributable to work organisation, not luck. The seed is a configuration parameter and can be changed between sessions.

## Task Properties

Each task has:
- A **required skill** — tasks are single-skill (e.g. a story about a login form might have a Backend task and a separate Frontend task)
- A **complexity** value (affects dice rolls / time to complete)
- A **quality impact** — contributes to internal and/or external quality when completed
- Optional **dependencies** on other tasks within the same story (see Blockers)

## Task Dependencies and Handovers

Tasks within a story can run in parallel — but each player can only work on one task at a time. Whether parallelism actually happens depends on team availability and skill coverage.

Within a story, tasks may also have dependencies — one task cannot start until another is complete. This is the structural cause of **handovers** in solo work.

Example: a story with a Backend task and a Frontend task where the FE depends on the BE API:
- **Solo work**: the backend developer finishes first, then hands off to the frontend developer. The API contract was defined by one person without FE input → the interface between BE and FE suffers in internal quality.
- **Collaborative work**: BE and FE work together. The interface evolves iteratively → no internal quality penalty at the boundary.

This makes the cost of silos visible: it is not just the waiting time during handover, but the hidden quality cost of decisions made in isolation.

## Flow Tracking

The system tracks flow metrics across all work items:

- **Lead time**: Time from a work item entering the system to delivery (measured at Story and Feature level)
- **Cycle time**: Time from when work actively started to completion
- **WIP**: Count of items currently in progress at each level
- **Throughput**: Items completed per round

There are no system-enforced WIP limits. The metrics are reported so players (and the facilitator) can observe the effects of their choices.
