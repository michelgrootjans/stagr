import { describe, it, expect } from 'vitest'
import { AdvanceDay } from './AdvanceDay'
import { AdvanceDayHandler } from './AdvanceDayHandler'
import { CreateGame } from './CreateGame'
import { StartRound } from './StartRound'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('AdvanceDayHandler', () => {
  it('clears acted state and stays in active phase', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new StartRound('game-1'))

    new AdvanceDayHandler(repository).handle(new AdvanceDay('game-1'))

    expect(repository.findById('game-1')?.getPhase()).toBe('active')
  })
})
