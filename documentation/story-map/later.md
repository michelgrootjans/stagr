---

kanban-plugin: board

---

## Walking Skeleton

- [ ] Player joins via URL, receives a character
- [ ] Player phone: see character + current task + tap to roll
- [ ] Facilitator screen: Kanban board with backlog and work items
- [ ] Dice roll resolves task progress, Kanban updates live
- [ ] Day advances when all players have rolled

## Dev Mode

- [ ] Game start screen with mode selection (facilitated vs dev)
- [ ] Simulated player panels showing each character's phone view
- [ ] Mass action: roll all dice at once
- [ ] Mass action: advance day

## Flow Metrics

- [ ] CFD updates live at end of each day
- [ ] Cycle time scatter plot (one dot per completed story)
- [ ] Cycle time histogram
- [ ] Round end: freeze state for debrief, navigate historical rounds

## Collaboration

- [ ] Standup: player picks task and optionally opts into pairing
- [ ] Round assigned a collaboration mode (solo / pair / mob)
- [ ] Pair mode: two players on one task, shared dice pool
- [ ] Mob mode: whole team on one task
- [ ] Multi-round comparison: same seed, navigate between rounds

## Character Depth

- [ ] Full dot grid visible to player (tap to open)
- [ ] Seniority label derived from total known dots
- [ ] Happiness system: internal quality affects mood
- [ ] Mood flavour line on waiting screen and character details
- [ ] Happiness history chart on character details

## Game Events

- [ ] External blockers appear on Kanban, unblock via dice roll
- [ ] Sick days (random, config-driven)
- [ ] Planned absences (pre-assigned at game start)
- [ ] Character quits after sustained unhappiness
- [ ] Facilitator can fire a character

## Hiring

- [ ] Facilitator triggers hiring, QR code appears on dashboard
- [ ] Candidate joins, receives a fresh character, sees own dot grid
- [ ] Team sees skill coverage panel; candidate does not
- [ ] Team makes hire decision; new member appears on dashboard

## Learning & Config

- [ ] Learning mechanic: earn dots through repeated skill encounters
- [ ] Game configuration screen (toggle blockers, sickness, quitting, hiring, learning)
- [ ] Random seed setting for reproducible sessions
- [ ] Facilitator auth

%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false,false]}
```
%%
