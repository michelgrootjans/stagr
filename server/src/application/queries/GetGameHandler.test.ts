import { describe, it, expect } from 'vitest'
import { GetGameHandler } from './GetGameHandler'
import { CreateGame } from '../commands/CreateGame'
import { JoinGame } from '../commands/JoinGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('GetGameHandler', () => {
  it('returns phase, tasks, and players', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new JoinGame('game-1', 'player-1'))
    bus.execute(new JoinGame('game-1', 'player-2'))

    const result = new GetGameHandler(repository).handle('game-1')

    expect(result?.phase).toBe('standup')
    expect(result?.effortCount).toBe(0)
    expect(result?.tasks.length).toBeGreaterThan(0)
    expect(result?.players).toEqual([
      { id: 'player-1', name: 'Alice', assignedTaskId: undefined, hasActed: false },
      { id: 'player-2', name: 'Bob', assignedTaskId: undefined, hasActed: false },
    ])
  })

  it('returns undefined when the game does not exist', () => {
    const repository = new InMemoryGameRepository()

    const result = new GetGameHandler(repository).handle('unknown-game')

    expect(result).toBeUndefined()
  })
})
