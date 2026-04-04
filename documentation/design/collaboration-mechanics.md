# Collaboration Mechanics

## Example: A Story with BE and FE Tasks

This illustrates the three modes of working using a story that contains one Backend task and one Frontend task.

---

### Mode 1: Sequential Solo (handover)

The team decides to work BE first, then FE.

- The BE player completes the BE task alone, using their full dice roll each turn
- The FE task is blocked until BE is done
- Once BE finishes, the FE player picks up the FE task and completes it alone

**Quality risk**: there is a probability that internal quality at the BE/FE interface drops. The API contract was defined by the BE developer without FE involvement — the interface was not shaped by iterative feedback.

**Flow cost**: the FE task's lead time includes the full BE task duration as waiting time.

---

### Mode 2: Parallel Solo

Both players start their tasks simultaneously.

- The BE player works the BE task alone, full dice roll each turn
- The FE player works the FE task alone, full dice roll each turn
- No waiting, but they are making interface decisions independently and concurrently

**Quality risk**: there is a probability that both internal and external quality drop. Each player is assuming things about the interface that may not align with what the other is building.

**Flow benefit**: tasks complete faster (no handover wait)
**Quality cost**: higher risk than sequential solo, because misalignment can happen on both sides

---

### Mode 3: Collaborative (pair/mob)

Both players work on the story together, iterating across BE and FE.

- Each player rolls dice per turn
- Each player **splits their die value in half**: half contributes to BE progress, half to FE progress
- Progress on each side is **proportional to the player's skill** in that discipline:
  - A BE developer (high BE skill, low FE skill) contributes more to BE and less to FE
  - A FE developer (high FE skill, low BE skill) contributes more to FE and less to BE

**Quality outcome**: no interface quality penalty — the interface evolves iteratively through the collaboration

**Flow cost**: each player produces less raw progress per turn (split effort), so total task duration is longer than parallel solo

**Skill benefit**: both players gain XP in the discipline they are less skilled in (learning by doing)

---

## Summary

| Mode | Speed | Interface Quality | Skill Growth |
|---|---|---|---|
| Sequential solo (handover) | Medium (FE waits) | Risk of drop | None |
| Parallel solo | Fast | Higher risk of drop | None |
| Collaborative | Slow | No penalty | Yes — both players |

The game makes the tradeoff visible: optimising for speed in the short term creates quality risk; investing in collaboration protects quality and builds team capability over time.
