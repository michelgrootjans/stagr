import { describe, it, expect } from 'vitest'
import { CreateGame } from './CreateGame'
import { JoinGame } from './JoinGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('JoinGameHandler', () => {
  it('adds the player to the game', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)

    bus.execute(new CreateGame('game-1'))
    bus.execute(new JoinGame('game-1', 'player-1'))

    expect(repository.findById('game-1')?.players).toContain('player-1')
  })
})
