import { describe, it, expect } from 'vitest'
import { JoinGameHandler } from './JoinGameHandler'
import { Game } from '../../domain/Game'

describe('JoinGameHandler', () => {
  it('adds the player to the game', () => {
    const game = new Game('game-1')
    const repository = {
      save: (_game: Game) => {},
      findById: (_gameId: string) => game
    }

    const handler = new JoinGameHandler(repository)
    handler.handle('game-1', 'player-1')

    expect(game.players).toContain('player-1')
  })
})
