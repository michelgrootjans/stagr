import { describe, it, expect } from 'vitest'
import { CreateGameHandler } from './CreateGameHandler'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'

describe('CreateGameHandler', () => {
  it('stores a game with the given id', () => {
    const repository = new InMemoryGameRepository()
    const handler = new CreateGameHandler(repository)
    handler.handle('game-123')

    expect(repository.findById('game-123')).toBeDefined()
  })
})
