import { describe, it, expect } from 'vitest'
import { Game } from './Game'

describe('Game', () => {
  it('assigns a character to a player when they join', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    expect(game.getCharacter('player-1')).toBeDefined()
  })
})
