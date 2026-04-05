import { describe, it, expect } from 'vitest'
import { GetCharacterHandler } from './GetCharacterHandler'
import { Game } from '../../domain/Game'

describe('GetCharacterHandler', () => {
  it('returns the character for a player in a game', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    const repository = { save: () => {}, findById: () => game }

    const handler = new GetCharacterHandler(repository)
    const character = handler.handle('game-1', 'player-1')

    expect(character).toBeDefined()
  })
})
