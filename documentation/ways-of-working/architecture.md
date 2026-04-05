# Architecture

## Principles

- The server is the single source of truth. All game logic happens server-side; the client is a display and input layer only.
- Functionality is isolated and composed. A feature lives in one place; nothing bleeds across boundaries without an explicit interface.
- The frontend is as simple as possible. No business logic in components — only rendering and user input forwarding.
- Commands and queries are strictly separated. A command changes state and returns nothing. A query reads state and changes nothing.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Command | No suffix | `RollDice`, `PickTask` |
| Command handler | `Handler` suffix | `RollDiceHandler` |
| Query request | `Request` suffix | `GetGameStateRequest` |
| Query response | `Response` suffix | `GetGameStateResponse` |
| Query handler | `Handler` suffix | `GetGameStateHandler` |
| Socket.io event | No suffix, past tense | `GameStateUpdated`, `DiceRolled`, `InterviewStarted` |
| Port interface | No `I` prefix | `SessionRepository`, `GameService` |
| Adapter | Descriptive name | `InMemorySessionRepository`, `SocketIoAdapter` |

Suffixes are only added when they disambiguate. If the name is already unambiguous, no suffix is needed.

---

## Backend — Hexagonal Architecture with DDD

The backend is structured in four layers. Dependencies only point inward: adapters depend on ports, ports depend on application, application depends on domain. The domain has no external dependencies.

```
server/src/
  domain/          ← Pure game logic. No framework, no I/O.
  application/     ← Use cases. Orchestrates domain objects.
  ports/           ← Interfaces. Defines what the application needs.
  adapters/        ← Implementations. Wires the outside world to ports.
```

### Domain

Contains entities, value objects, domain events, and domain services. No dependencies on anything outside this layer — not even Node.js built-ins where avoidable.

Examples: `Character`, `Task`, `GameSession`, `DiceRoll`, `HappinessLevel`.

Domain logic is the most tested layer. Tests are pure unit tests with no mocks.

### Application

The application layer is split into commands and queries.

**Commands** express intent to change state. A command handler executes domain logic, persists the result, and emits domain events. It returns nothing (or a bare acknowledgment at most).

Examples: `RollDice`, `PickTask`, `StartSession`, `HireCharacter`.

**Queries** return data without touching state. A query handler reads from a repository and returns a typed result. No side effects, ever.

Examples: `GetGameStateRequest` / `GetGameStateResponse`, `GetCharacterDetailsRequest` / `GetCharacterDetailsResponse`.

### Ports

TypeScript interfaces — no implementation here.

- **Input ports**: what the application exposes (e.g. `GameService`)
- **Output ports**: what the application needs from the outside (e.g. `SessionRepository`, `EventEmitter`)

### Adapters

Concrete implementations of ports.

- **Input adapters**: translate external input into commands or queries (e.g. `SocketIoAdapter` maps Socket.io events to command/query handlers). Socket.io events that carry intent (`roll_dice`, `pick_task`) become commands; events that request data (`get_game_state`) become queries and return a result via callback.
- **Output adapters**: implement output port interfaces (e.g. `InMemorySessionRepository` implements `SessionRepository`, future: `RedisSessionRepository`)

### Folder structure

```
server/src/
  domain/
    character/
      Character.ts
      CharacterRepository.ts         ← output port interface
    game/
      GameSession.ts
      GameState.ts
    task/
      Task.ts
    events/
      DomainEvent.ts
  application/
    commands/
      RollDice.ts
      RollDiceHandler.ts
      PickTask.ts
      PickTaskHandler.ts
      StartSession.ts
      StartSessionHandler.ts
    queries/
      GetGameStateRequest.ts
      GetGameStateResponse.ts
      GetGameStateHandler.ts
      GetCharacterDetailsRequest.ts
      GetCharacterDetailsResponse.ts
      GetCharacterDetailsHandler.ts
  ports/
    input/
      CommandHandler.ts
      QueryHandler.ts
    output/
      SessionRepository.ts
      EventEmitter.ts
  adapters/
    socket-io/
      SocketIoAdapter.ts             ← maps socket events to commands/queries
    in-memory/
      InMemorySessionRepository.ts
  infrastructure/
    server.ts
```

---

## Frontend — Simple Display Layer

The client receives game state from the server via Socket.io and renders it. It forwards user input back to the server. No game logic lives here.

```
client/src/
  routes/
    games/[gameId]/
      facilitator/   ← /games/:gameId/facilitator
    play/[sessionId] ← /play/:sessionId
    join/[sessionId] ← /join/:sessionId
    dev/             ← /dev
  lib/
    components/      ← Svelte components, pure display
    stores/          ← Reactive game state, updated from socket events
    socket.ts        ← Socket.io client setup
```

Components receive data as props or from stores. They do not call use cases or contain conditional game logic. If a component is getting complex, it should be split or the logic should move to the server.

---

## Shared Types

The `shared` package is the communication contract between server and client. It contains three things only:

- **Commands** — what the client can tell the server to do
- **Query requests and responses** — what the client can ask for and what it gets back
- **Socket.io events** — what the server pushes to clients after state changes

Domain types (`Character`, `Task`, `GameSession`) stay server-side. The client never needs the full domain model — only the shaped responses that queries and events deliver.

```
shared/src/
  commands/
    RollDice.ts
    PickTask.ts
    StartSession.ts
  queries/
    GetGameStateRequest.ts
    GetGameStateResponse.ts
    GetCharacterDetailsRequest.ts
    GetCharacterDetailsResponse.ts
  events/
    GameStateUpdated.ts        ← broadcast to all clients in room
    DiceRolled.ts              ← targeted: sent to rolling player only
    InterviewStarted.ts        ← targeted: sent to candidate only
```

Neither `server` nor `client` define their own versions of these types.

---

## Socket.io Event Model

After a command changes state, the server broadcasts the **full current game state** to all clients in the room. The client replaces its local state entirely — no merging, no risk of drift.

This keeps the client simple: it holds one reactive store (`gameState`) that gets replaced on each push. Reconnecting clients request the current state once and are immediately back in sync.

Two categories of push:

| Type | Direction | When |
|---|---|---|
| `GameStateUpdated` | Server → all clients in room | After any command that changes game state |
| Targeted event | Server → one client | Roll result reveal, interview notification, hire decision |

Queries use Socket.io's callback pattern: the client emits with a callback, the server responds directly. No state is changed.
