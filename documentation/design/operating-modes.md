# Operating Modes

## Facilitated Mode

The intended production mode. A facilitator runs the session with a group of real participants.

- Facilitator presents on a shared screen (laptop/projector)
- Participants join on their phones via QR code
- Each participant controls one character
- The facilitator screen shows the full game state: Kanban board, metrics, character panel, events

## Solo / Development Mode

A single-operator mode for testing and tuning the game without needing real participants. Designed for the game developer to experiment with mechanics and configuration.

### Simulated Player Screen

A dedicated test screen shows multiple simulated player views side by side — one panel per character. Each panel mirrors what a real participant would see on their phone.

### Mass Actions

Mass actions handle mechanical progression — things that would otherwise require tapping through every player individually:

| Action | Effect |
|---|---|
| **Roll all dice** | All players roll simultaneously for the current day |
| **Advance day** | Skips to end of day, resolving all pending actions |
| **Trigger event** | Manually fire a random event (sick day, external blocker) for testing |
| (more TBD) | ... |

### Individual Actions

Decisions always require individual action per simulated player, even in solo mode:

- **Task assignment**: each player's standup decision is made one at a time
- **Applying for hire**: each candidate goes through the process individually
- **Collaboration choice**: opting in or out of pairing is per-player

This keeps testing meaningful — the point is to experiment with specific decision-making scenarios, not to auto-play through them.

### Purpose

- Test game mechanics without participants
- Experiment with game configuration toggles
- Tune probability values and observe outcomes at speed
- Reproduce specific scenarios for debugging

## Mode Selection

Mode is selected when starting a new game session. The core game logic is identical in both modes — only the input layer differs.
