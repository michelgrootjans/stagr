import { describe, it, expect } from 'vitest'
import { GetCharacterHandler } from './GetCharacterHandler'
import { CreateGameHandler } from '../commands/CreateGameHandler'
import { JoinGameHandler } from '../commands/JoinGameHandler'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'

describe('GetCharacterHandler', () => {
  it('returns the character for a player in a game', () => {
    const repository = new InMemoryGameRepository()
    new CreateGameHandler(repository).handle('game-1')
    new JoinGameHandler(repository).handle('game-1', 'player-1')

    const character = new GetCharacterHandler(repository).handle('game-1', 'player-1')

    expect(character).toBeDefined()
  })
})
