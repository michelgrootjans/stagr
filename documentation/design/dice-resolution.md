# Dice Resolution

## Core Principle

All game logic and calculations live on the server. The phone is purely a display and input device. This keeps the rules consistent, the game state authoritative, and the client as simple as possible.

## Player Interaction

1. Player taps their phone to take their action for the day
2. Server calculates the outcome (dice rolls, progress, quality effects, learning)
3. Phone shows a dramatic reveal — dice animation building anticipation, then the result

## Roll Mechanic

The number of dice a player rolls is determined by their **known dots** in the required skill:
- More known dots → more dice → higher average progress, but still subject to variance
- Fewer known dots → fewer dice → every roll matters more

Progress for the day = sum of the dice roll, modified by:
- **Unknown dots** in the task: those dice are penalised (lower face value or separate slower dice)
- **Zero known dots**: possible but very slow, with added probability of quality damage
- **Collaboration**: both players' dice pools contribute, split across the shared task proportionally to skill

## Feelings

The dramatic reveal is designed to make lucky and unlucky rolls felt:
- A skilled player rolling badly feels the frustration
- A junior player rolling a surprise high number creates a moment for the team

## What the Server Calculates Per Tap

- Number of dice based on known dots
- Roll outcome (random, server-side)
- Progress applied to current task dots (known vs unknown)
- Probability check for acquiring unknown dots
- Quality impact if applicable
- Happiness adjustment for the character
