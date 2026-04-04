# Player View

The player view is a mobile web page — designed for a phone screen. It is the interface a participant uses throughout the session.

## Main Screen

The default view a player sees during the game. Contains:
- Their character's name and seniority label (e.g. "Alex — Senior Backend")
- Their current task and its progress
- A **tap to roll** button for their daily action
- Their recent roll history (streak indicator)
- Their character's current happiness state (expressed visually)

## Waiting State (between roll and next standup)

Once a player has rolled, their phone shows:
- A short **flavour line** reflecting their character's mood — e.g. *"This codebase is a nightmare — you spent half the day fighting the code just to move one task forward."* This makes the happiness mechanic felt rather than read.
- A subtle prompt to look at the shared screen — keeping attention on the facilitator display and the team conversation, rather than on phones.

The waiting state is intentionally minimal. The shared facilitator screen is where the action is.

## Character Details (tap to open)

Accessed by tapping their character. Contains:
- Full dot grid for each skill — coloured (known) vs greyed (unknown)
- Breakdown of dots per skill area
- Happiness history

This is kept behind a tap to avoid overwhelming the main screen and to keep focus on the task at hand during play.

## Other Interactions (from main screen)

- Standup decisions: selecting a task, choosing to collaborate
- Joining a task another player is already on
- (Hiring candidates only) responding during the interview process
