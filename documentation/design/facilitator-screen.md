# Facilitator Screen

The facilitator screen is the shared display visible to everyone during a session — projected or shared on a large screen. It shows the full game state for one team.

## Single-Team Layout

Four panels:

### 1. Kanban Board
Current state of all work items across columns (e.g. Backlog / In Progress / Done). Shows blockers, who is working on what, and collaboration groupings at a glance.

Team members appear directly on the work items they are working on, labelled by their dominant skill and seniority level — e.g. **Senior Backend**, **Junior Frontend**, **Expert Analysis**. The full dot grid is not shown on the facilitator screen.

### 2. Cumulative Flow Diagram (CFD)
Plots the count of items in each column over time (days). The width of each band reveals WIP; the slope reveals throughput; a widening band reveals a bottleneck forming. Updates at the end of each simulated day.

### 3. Cycle Time Scatter Plot
One dot per completed story, plotted by completion date (x) and cycle time in days (y). Reveals trends, outliers, and whether the team is getting faster or slower as the round progresses.

### 4. Cycle Time Histogram
Distribution of cycle times across all completed stories. Shows whether delivery is predictable (tight distribution) or erratic (wide spread).

## What the Metrics Measure

All flow metrics are tracked at **Story level** by default — a story is the unit of value delivered to the user. Task-level metrics may be available as a drill-down.

## Round Navigation

The facilitator explicitly ends a round. Once ended:
- The screen stays on that round's state
- The facilitator can navigate to any previous round to compare metrics during debrief
- The facilitator controls the pace — they decide what to show and when

When the facilitator starts a new round, the screen automatically focuses on the live state of that round. Historical rounds remain accessible but are no longer the active view.

## Facilitator Controls

- **End round**: freezes the current round's state for debrief
- **Navigate to round N**: switches the display to a previous round's four panels
- **Start new round**: resets game state and begins the next round
- **Trigger hiring**: shows QR code for new participants to join
- Further controls TBD
