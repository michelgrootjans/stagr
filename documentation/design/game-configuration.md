# Game Configuration

The game has a configuration layer that controls which mechanics are active and how they are parameterised. This allows experimenting with different combinations during dry-runs to tune the game feel and learning outcomes.

Configuration is set before a session starts and does not change mid-game.

## Learning Mechanics

| Parameter | Type | Description |
|---|---|---|
| `learnAfterEncounters` | integer / OFF | A dot is learned automatically after being worked on N times |
| `learnByProbability` | float / OFF | Each encounter with an unknown dot triggers a probability check to learn it |

These can be combined. Examples:
- `learnAfterEncounters: 5, learnByProbability: OFF` — purely threshold-based
- `learnAfterEncounters: OFF, learnByProbability: 0.2` — purely probabilistic
- `learnAfterEncounters: 10, learnByProbability: 0.1` — hybrid: probability early, guaranteed after enough repetition

Collaboration bonus (if enabled): probability of learning increases when working alongside someone who already knows the dot.

## Random Events

| Parameter | Type | Description |
|---|---|---|
| `externalBlockers` | ON / OFF | Whether external blockers can occur |
| `sickDays` | ON / OFF | Whether team members can call in sick |
| `plannedAbsence` | ON / OFF | Whether vacation is pre-assigned at game start |

## Team Lifecycle

| Parameter | Type | Description |
|---|---|---|
| `quitting` | ON / OFF | Whether unhappy team members can quit automatically |
| `hiring` | ON / OFF | Whether the facilitator can trigger a hiring round |

## Randomness

| Parameter | Type | Description |
|---|---|---|
| `randomSeed` | integer | Seed for all random events. Same seed across all rounds within a session ensures identical disruptions, making rounds directly comparable. Change between sessions to explore different scenarios. |

## Future Parameters (TBD through playtesting)

- Probability values for sick days and external blockers
- Happiness thresholds and decay rates
- Collaboration learning bonus multiplier
- Quality penalty probabilities for solo/parallel handovers
