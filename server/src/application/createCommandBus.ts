import { CommandBus } from './CommandBus'
import { CreateGame } from './commands/CreateGame'
import { CreateGameHandler } from './commands/CreateGameHandler'
import { JoinGame } from './commands/JoinGame'
import { JoinGameHandler } from './commands/JoinGameHandler'
import { RecordAction } from './commands/RecordAction'
import { RecordActionHandler } from './commands/RecordActionHandler'
import type { GameRepository } from './ports/GameRepository'

export function createCommandBus(repository: GameRepository): CommandBus {
  const bus = new CommandBus()
  bus.register(CreateGame, new CreateGameHandler(repository))
  bus.register(JoinGame, new JoinGameHandler(repository))
  bus.register(RecordAction, new RecordActionHandler(repository))
  return bus
}
