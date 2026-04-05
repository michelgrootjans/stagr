import { CommandBus } from './CommandBus'
import { CreateGame } from './commands/CreateGame'
import { CreateGameHandler } from './commands/CreateGameHandler'
import { JoinGame } from './commands/JoinGame'
import { JoinGameHandler } from './commands/JoinGameHandler'
import { AssignTask } from './commands/AssignTask'
import { AssignTaskHandler } from './commands/AssignTaskHandler'
import { StartWork } from './commands/StartWork'
import { StartWorkHandler } from './commands/StartWorkHandler'
import { AdvanceDay } from './commands/AdvanceDay'
import { AdvanceDayHandler } from './commands/AdvanceDayHandler'
import { RecordAction } from './commands/RecordAction'
import { RecordActionHandler } from './commands/RecordActionHandler'
import type { GameRepository } from './ports/GameRepository'

export function createCommandBus(repository: GameRepository): CommandBus {
  const bus = new CommandBus()
  bus.register(CreateGame, new CreateGameHandler(repository))
  bus.register(JoinGame, new JoinGameHandler(repository))
  bus.register(AssignTask, new AssignTaskHandler(repository))
  bus.register(StartWork, new StartWorkHandler(repository))
  bus.register(AdvanceDay, new AdvanceDayHandler(repository))
  bus.register(RecordAction, new RecordActionHandler(repository))
  return bus
}
