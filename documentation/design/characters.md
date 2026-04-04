# Characters

## Overview

Each player controls one team member. Characters have a first name and a set of skill scores across disciplines relevant to software product development.

## Skills

Skills represent the disciplines needed to deliver software:

| Skill | Description |
|---|---|
| Backend Development | Server-side logic, APIs, databases |
| Frontend Development | UI, client-side code, user experience |
| Infrastructure | Cloud, deployment, reliability, networking |
| Security | Threat modelling, hardening, compliance |
| Analysis | Requirements, user research, problem framing |
| (more TBD) | ... |

## Micro-Skills: The Dot Grid

Each skill is not a single score but a **10×10 grid of 100 micro-skills** — concrete, granular pieces of knowledge within that discipline.

Examples for Backend Development:
- Reading/writing files
- Designing a REST API
- Hexagonal architecture
- Common design patterns
- Database transactions
- Writing unit tests
- ... (100 total)

Each dot is either **known** (coloured) or **unknown** (greyed out). A character's skill profile is visualised as this grid — you can see at a glance how broad and deep their knowledge is.

## Seniority Label

A character's dominant skill is the one with the most known dots. Their seniority within that skill is derived from how many dots they have in it:

| Seniority | Description |
|---|---|
| **Junior** | Few known dots — still learning the basics |
| **Senior** | Moderate known dots — solid practitioner |
| **Expert** | Many known dots — deep mastery |

Thresholds TBD through playtesting. This label is what appears on the Kanban board — e.g. **Senior Backend**, **Junior Frontend**.

## Character Creation

At the start of a session, each player rolls to generate their character's dot grid for each skill. This determines which micro-skills they start with:
- A specialist has many dots coloured in one skill, few in others
- No two characters are identical
- The team's combined grid coverage creates natural gaps to discover

## Task Resolution and Micro-Skills

When a task requires work in a skill, it randomly samples a number of dots from that skill's grid:
- **Known dots** (coloured): progress goes smoothly — normal dice roll contribution
- **Unknown dots** (greyed): progress is slower, but working on unknown dots creates a chance of acquiring them (the dot becomes coloured)

**Learning mechanic — options under consideration:**
- *Option 1 — threshold*: work on the same unknown dot enough times and it is automatically learned
- *Option 2 — dice roll*: each time an unknown dot is encountered, roll dice to determine if it is acquired
- *Collaboration extension (applies to both)*: if a collaborator already knows the dot, the probability of learning it increases

This means:
- Working in your comfort zone is fast but teaches you nothing new
- Working at the edge of your knowledge is slower but grows your capability
- Working with zero known dots is possible, but slow and carries a higher probability of quality damage
- Over time, a character's grid fills in — visibly, dot by dot

## Skill Growth and Collaboration

When working alone, a character can only acquire dots in the skill they are actively using.

When collaborating, both characters work across the shared task. A player working outside their primary skill (e.g. a BE developer on a FE task) encounters more unknown dots — slower progress, but more learning opportunities.

This makes the specialist vs. generalist tradeoff tangible and visible in the dot grids.
