import { describe, it, expect } from 'vitest'
import { AdvanceDay } from './AdvanceDay'
import { AdvanceDayHandler } from './AdvanceDayHandler'
import { CreateGame } from './CreateGame'
import { StartWork } from './StartWork'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('AdvanceDayHandler', () => {
  it('returns the game to standup phase', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new StartWork('game-1'))

    new AdvanceDayHandler(repository).handle(new AdvanceDay('game-1'))

    expect(repository.findById('game-1')?.getPhase()).toBe('standup')
  })
})
