# Game Flow

This document describes the implemented game flow — what actually happens in the running application, as opposed to the full aspirational design.

## Phases

A game moves through two phases:

| Phase | Who controls it | What happens |
|---|---|---|
| **Lobby** | Facilitator | Players join and wait. Nothing can be done yet. |
| **Active** | Players | The round is running. Players pick tasks and tap to advance work. |

The game starts in **lobby**. The facilitator starts the round, moving it to **active**. Once active, the game stays active — the players drive the pace.

## Roles

| Role | Assigned by | Responsibilities |
|---|---|---|
| **Product Owner** | System (first player to join) | Moves tasks from pool to backlog; advances the day |
| **Developer** | System (all subsequent players) | Picks a task from the backlog; taps to record effort |

## Day cycle

Once the round is active, days repeat:

1. **PO** moves one or more tasks from the pool to the backlog (makes them available to work on)
2. **Developers** each pick a task from the backlog
3. **Developers** each tap to record effort on their task
4. Once every developer has tapped, the **PO** sees an "Advance day" button
5. **PO** taps "Advance day" — acted state clears, the next day begins

Steps 1–5 repeat for the duration of the round (typically 20–30 days).

## Facilitator screen

The facilitator sees:
- Connection status
- Current phase and total effort count
- Player list with names, roles, assigned tasks, and acted status (✅ / ⏳)
- "Start round" button (lobby only, requires at least one player)
- QR code linking players to the join URL

The facilitator's only action during the round is the initial "Start round". After that, they observe.

## Player screen

All players join via `/games/:gameId/join` (or the QR code). They land on their personal screen at `/players/:playerId`.

In **lobby**: players see a waiting message.

In **active**, the screen depends on role:

**Product Owner**:
- Pool of tasks (click to move to backlog)
- Backlog (confirmed, ready to be picked)
- "Advance day" button — only visible when all developers have tapped

**Developer**:
- Backlog tasks to pick from (tap to select; can switch until tapped)
- Once a task is selected, a "Tap" button appears to record effort for the day
- After tapping, the button shows "Done for today" and is disabled

## Effort counter

Every tap from any player (developer or PO) increments the game's effort counter. This is visible on the facilitator screen and the dev screen, and represents cumulative work done across the entire round.
