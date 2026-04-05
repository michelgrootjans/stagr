import { describe, it, expect } from 'vitest'
import { CreateGameHandler } from './CreateGameHandler'
import { Game } from '../../domain/Game'

describe('CreateGameHandler', () => {
  it('stores a game with the given id', () => {
    const stored: Game[] = []
    const repository = {
      save: (game: Game) => { stored.push(game) },
      findById: (_gameId: string) => undefined
    }

    const handler = new CreateGameHandler(repository)
    handler.handle('game-123')

    expect(stored.map(g => g.id)).toContain('game-123')
  })
})
