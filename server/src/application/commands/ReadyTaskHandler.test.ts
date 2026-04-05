import { describe, it, expect } from 'vitest'
import { ReadyTask } from './ReadyTask'
import { ReadyTaskHandler } from './ReadyTaskHandler'
import { CreateGame } from './CreateGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('ReadyTaskHandler', () => {
  it('moves a task from the pool to the ready backlog', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    const taskId = repository.findById('game-1')!.tasks[0].id

    new ReadyTaskHandler(repository).handle(new ReadyTask('game-1', taskId))

    expect(repository.findById('game-1')?.getReadyTasks().some(t => t.id === taskId)).toBe(true)
  })
})
