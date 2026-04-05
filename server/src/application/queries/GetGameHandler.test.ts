import { describe, it, expect } from 'vitest'
import { GetGameHandler } from './GetGameHandler'
import { CreateGameHandler } from '../commands/CreateGameHandler'
import { JoinGameHandler } from '../commands/JoinGameHandler'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'

describe('GetGameHandler', () => {
  it('returns the current state of the game', () => {
    const repository = new InMemoryGameRepository()
    new CreateGameHandler(repository).handle('game-1')
    new JoinGameHandler(repository).handle('game-1', 'player-1')
    new JoinGameHandler(repository).handle('game-1', 'player-2')

    const result = new GetGameHandler(repository).handle('game-1')

    expect(result).toEqual({ players: ['player-1', 'player-2'] })
  })

  it('returns undefined when the game does not exist', () => {
    const repository = new InMemoryGameRepository()

    const result = new GetGameHandler(repository).handle('unknown-game')

    expect(result).toBeUndefined()
  })
})
