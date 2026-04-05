import { describe, it, expect } from 'vitest'
import { RecordAction } from './RecordAction'
import { RecordActionHandler } from './RecordActionHandler'
import { CreateGame } from './CreateGame'
import { JoinGame } from './JoinGame'
import { StartRound } from './StartRound'
import { ReadyTask } from './ReadyTask'
import { AssignTask } from './AssignTask'
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository'
import { createCommandBus } from '../createCommandBus'

describe('RecordActionHandler', () => {
  it('records a player action during standup', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new JoinGame('game-1', 'player-1'))
    const taskId = repository.findById('game-1')!.tasks[0].id
    bus.execute(new ReadyTask('game-1', taskId))
    bus.execute(new StartRound('game-1'))
    bus.execute(new AssignTask('game-1', 'player-1', taskId))

    new RecordActionHandler(repository).handle(new RecordAction('game-1', 'player-1'))

    expect(repository.findById('game-1')?.getEffortCount()).toBe(1)
  })

  it('ignores an action in lobby', () => {
    const repository = new InMemoryGameRepository()
    const bus = createCommandBus(repository)
    bus.execute(new CreateGame('game-1'))
    bus.execute(new JoinGame('game-1', 'player-1'))

    new RecordActionHandler(repository).handle(new RecordAction('game-1', 'player-1'))

    expect(repository.findById('game-1')?.getEffortCount()).toBe(0)
  })
})
