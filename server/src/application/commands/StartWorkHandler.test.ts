import { describe, it, expect } from 'vitest'
import { StartWork } from './StartWork'
import { StartWorkHandler } from './StartWorkHandler'
import { CreateGame } from './CreateGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('StartWorkHandler', () => {
  it('transitions the game to work phase', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))

    new StartWorkHandler(repository).handle(new StartWork('game-1'))

    expect(repository.findById('game-1')?.getPhase()).toBe('work')
  })
})
