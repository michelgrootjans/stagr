# Stagr — Claude Instructions

## Project

Browser-based multiplayer serious game teaching software teams about flow, lead time, cycle time, WIP, and collaboration modes. Built around a fictional concert & festival app called Stagr.

Full design docs in `/documentation/design/`. Architecture in `/documentation/ways-of-working/`.

## Stack

- **Monorepo** with npm workspaces: `/server`, `/client`, `/shared`
- **Server**: Node.js + TypeScript + Socket.io. Serves SvelteKit static build via `sirv` in production.
- **Client**: SvelteKit + TypeScript. SSR disabled globally. `adapter-static` with SPA fallback.
- **Shared**: communication contract only — commands, query request/response, Socket.io events. No domain types.
- Node version pinned in `.nvmrc` (24.x LTS). Always `nvm use` before running commands.
- Dev: `npm run dev` from root starts both server (port 3000) and client (port 5173) via `concurrently`.

## Architecture

Hexagonal architecture with DDD and CQS. See `/documentation/ways-of-working/architecture.md` for full detail.

- **Domain**: pure game logic, no external dependencies
- **Application/commands**: change state, return nothing
- **Application/queries**: read state, no side effects, ever
- **Ports**: TypeScript interfaces, no `I` prefix
- **Adapters**: concrete implementations (Socket.io input, in-memory repositories)

Socket.io events push **full game state** to all clients after commands. Targeted events for player-specific moments.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Command | No suffix | `RollDice`, `PickTask` |
| Command handler | `Handler` suffix | `RollDiceHandler` |
| Query request | `Request` suffix | `GetGameStateRequest` |
| Query response | `Response` suffix | `GetGameStateResponse` |
| Socket.io event | No suffix, past tense | `GameStateUpdated`, `DiceRolled` |
| Port interface | No `I` prefix | `SessionRepository`, `GameService` |

## TDD workflow

1. Claude writes a failing test
2. User verifies the test
3. Claude implements
4. User verifies the implementation

Tests live alongside the code they test (`Character.ts` / `Character.test.ts`). Tests describe behaviour, not implementation.

Always run the full test suite with `npm test` from the root (runs all workspaces), never a single file or test.

## Story map

`/documentation/story-map/current.md` — active tasks
`/documentation/story-map/next.md` — next features
`/documentation/story-map/later.md` — full roadmap in release columns

Always update `current.md` when a task is completed — move it to Done without waiting to be asked.

## Routes

| Route | Description |
|---|---|
| `/games/:gameId/facilitator` | Facilitator screen |
| `/games/:gameId/join` | Entry point (QR code target), redirects to player screen |
| `/players/:playerId` | Player's personal screen |
| `/dev` | Dev mode — simulated player panels |
