import { describe, it, expect } from 'vitest'
import { GetGameHandler } from './GetGameHandler'
import { Game } from '../../domain/Game'

describe('GetGameHandler', () => {
  it('returns the current state of the game', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.addPlayer('player-2')

    const repository = {
      save: (_game: Game) => {},
      findById: (_gameId: string) => game
    }

    const handler = new GetGameHandler(repository)
    const result = handler.handle('game-1')

    expect(result).toEqual({ players: ['player-1', 'player-2'] })
  })

  it('returns undefined when the game does not exist', () => {
    const repository = {
      save: (_game: Game) => {},
      findById: (_gameId: string) => undefined
    }

    const handler = new GetGameHandler(repository)
    const result = handler.handle('unknown-game')

    expect(result).toBeUndefined()
  })
})
