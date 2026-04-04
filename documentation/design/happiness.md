# Happiness

Happiness is a per-character metric that reflects how a team member feels about their work. It is not shown as a number — it surfaces visually through the character's expression or state on screen.

## Influences on Happiness

### Negative influences (decrease happiness)
- **Low internal quality**: working in a messy codebase is demoralising
- **Production bugs**: frequent firefighting and incidents wear people down
- **Stagnation**: low rate of learning — working only on known dots with no growth
- **High WIP**: being pulled in too many directions creates stress
- **Blocked work**: sitting idle waiting for a dependency or external blocker is frustrating
- **Nothing ships**: when throughput is low and nothing ever reaches done, motivation drops
- **Isolation**: working alone for long stretches without collaboration

### Positive influences (increase happiness)
- **Learning**: acquiring new dots — growth is motivating
- **Shipping**: completing stories and features gives a sense of accomplishment
- **Collaboration**: working with others increases engagement
- **High internal quality**: working in a well-crafted codebase feels good
- **Flow**: a smooth, unblocked day with steady progress
- **Skill match**: working on tasks well within your skill — confidence and competence

## Quitting

When a character has been unhappy for a sustained stretch, the probability of quitting increases each day. This is checked automatically by the server — no facilitator intervention needed.

The longer the unhappiness persists, the higher the daily probability of the character leaving. This simulates how real attrition works: it is rarely a single event, but a slow accumulation of bad days.

When a character quits:
- Their in-progress tasks become blocked
- Their skill dots are lost to the team
- A hiring process can be triggered by the facilitator (see Hiring)

## Firing

The facilitator can also manually remove a team member — simulating a performance decision or restructuring. The mechanical effect is identical to quitting.
