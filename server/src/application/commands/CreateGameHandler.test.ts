import { describe, it, expect } from 'vitest'
import { CreateGame } from './CreateGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('CreateGameHandler', () => {
  it('stores a game with the given id', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)

    bus.execute(new CreateGame('game-123'))

    expect(repository.findById('game-123')).toBeDefined()
  })
})
