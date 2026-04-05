import { describe, it, expect } from 'vitest'
import { JoinGameHandler } from './JoinGameHandler'
import { CreateGameHandler } from './CreateGameHandler'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'

describe('JoinGameHandler', () => {
  it('adds the player to the game', () => {
    const repository = new InMemoryGameRepository()
    new CreateGameHandler(repository).handle('game-1')

    new JoinGameHandler(repository).handle('game-1', 'player-1')

    expect(repository.findById('game-1')?.players).toContain('player-1')
  })
})
