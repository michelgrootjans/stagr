import { describe, it, expect } from 'vitest'
import { AssignTask } from './AssignTask'
import { AssignTaskHandler } from './AssignTaskHandler'
import { CreateGame } from './CreateGame'
import { JoinGame } from './JoinGame'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('AssignTaskHandler', () => {
  it('assigns a task to a player during standup', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new JoinGame('game-1', 'player-1'))
    const taskId = repository.findById('game-1')!.tasks[0].id

    new AssignTaskHandler(repository).handle(new AssignTask('game-1', 'player-1', taskId))

    expect(repository.findById('game-1')?.getAssignment('player-1')).toBe(taskId)
  })
})
