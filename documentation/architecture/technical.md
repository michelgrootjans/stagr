# Technical Stack

## Approved Stack

| Layer | Technology |
|---|---|
| **Server** | Node.js + TypeScript |
| **Real-time** | Socket.io (WebSocket rooms per session, broadcast, reconnection) |
| **Client** | Svelte + TypeScript (SvelteKit for routing) |
| **Charts** | TBD |

## Architecture Principles

- **Server is the source of truth**: all game logic, dice rolls, and state changes happen server-side. The client is a display and input layer only.
- **Shared types**: a shared TypeScript package defines game state types (characters, tasks, events, configuration) used by both server and client.
- **One Socket.io room per session**: players and the facilitator screen join the same room. Events broadcast to the room keep all views in sync.

## Views (SvelteKit routes)

| Route | Description |
|---|---|
| `/facilitator` | Facilitator screen — Kanban board, metrics, character panel |
| `/play/:sessionId` | Player view on mobile — character, dice, current task |
| `/dev` | Solo/dev mode — simulated player panels + mass actions |
| `/join/:sessionId` | Landing page after scanning QR code |

## Scaling

A single server handles multiple concurrent sessions comfortably at 20–30 players per session. For larger scale (multiple teams in an organisation), Socket.io's Redis adapter can distribute sessions across multiple server instances.
