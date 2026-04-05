import { describe, it, expect } from 'vitest'
import { GetCharacterHandler } from './GetCharacterHandler'
import { CreateGame } from '../commands/CreateGame'
import { JoinGame } from '../commands/JoinGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('GetCharacterHandler', () => {
  it('returns the character for a player in a game', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new JoinGame('game-1', 'player-1'))

    const character = new GetCharacterHandler(repository).handle('game-1', 'player-1')

    expect(character).toBeDefined()
  })
})
