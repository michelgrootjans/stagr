import { describe, it, expect } from 'vitest'
import { RecordAction } from './RecordAction'
import { RecordActionHandler } from './RecordActionHandler'
import { CreateGame } from './CreateGame'
import { JoinGame } from './JoinGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('RecordActionHandler', () => {
  it('increments the action count for a player', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new JoinGame('game-1', 'player-1'))

    new RecordActionHandler(repository).handle(new RecordAction('game-1', 'player-1'))
    new RecordActionHandler(repository).handle(new RecordAction('game-1', 'player-1'))

    expect(repository.findById('game-1')?.getEffortCount()).toBe(2)
  })
})
