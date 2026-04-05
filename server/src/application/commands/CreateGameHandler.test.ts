import { describe, it, expect } from 'vitest'
import { CreateGameHandler } from './CreateGameHandler'

describe('CreateGameHandler', () => {
  it('stores a game with the given id', async () => {
    const stored: string[] = []
    const repository = {
      save: (gameId: string) => { stored.push(gameId) }
    }

    const handler = new CreateGameHandler(repository)
    handler.handle('game-123')

    expect(stored).toContain('game-123')
  })
})
