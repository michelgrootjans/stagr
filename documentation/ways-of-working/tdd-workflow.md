# TDD Workflow

Development follows a strict test-first cycle. Each task from the kanban board is delivered through this loop.

## The Loop

```
1. Agree on what to build (pick task from current board)
2. Claude writes a failing test
3. You review and approve the test
4. Claude writes the implementation
5. You review and approve the implementation
6. Move task to Done, pick the next one
```

Steps 3 and 5 are explicit checkpoints. Nothing moves forward without your sign-off.

## What counts as a test

- **Domain layer**: pure unit tests. No mocks — domain objects have no external dependencies.
- **Application layer**: unit tests with mocked output ports (repositories, event emitters).
- **Adapters**: integration tests. The Socket.io adapter is tested against a real Socket.io server (in-memory).
- **Frontend**: component tests are optional and added when there is meaningful behaviour to verify.

Tests live alongside the code they test:

```
domain/character/
  Character.ts
  Character.test.ts
```

## Test naming

Tests describe behaviour, not implementation:

```ts
// Good
it('reduces remaining dots when a task is worked on')
it('marks a task as done when remaining dots reach zero')

// Avoid
it('calls decrementDots()')
it('sets isComplete to true')
```

## Failing first

The test Claude writes must fail before implementation begins. If it passes immediately, the test is wrong or the behaviour already exists.

## Scope

Each test covers exactly one behaviour. If a test requires complex setup to verify a simple behaviour, the design may need revisiting before writing the implementation.
