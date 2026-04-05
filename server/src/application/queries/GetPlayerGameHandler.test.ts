import { describe, it, expect, beforeEach } from 'vitest'
import { GetPlayerGameHandler } from './GetPlayerGameHandler'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { Game } from '../../domain/Game'

describe('GetPlayerGameHandler', () => {
  let repository: InMemoryGameRepository
  let handler: GetPlayerGameHandler

  beforeEach(() => {
    repository = new InMemoryGameRepository()
    handler = new GetPlayerGameHandler(repository)
  })

  it('returns the gameId for a player that has joined a game', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    repository.save(game)

    expect(handler.handle('player-1')).toBe('game-1')
  })

  it('returns undefined for an unknown player', () => {
    expect(handler.handle('unknown-player')).toBeUndefined()
  })
})
