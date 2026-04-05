import type { GameRepository } from '../ports/GameRepository'
import type { ReadyTask } from './ReadyTask'

export class ReadyTaskHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: ReadyTask): void {
    const game = this.repository.findById(command.gameId)
    if (!game) return
    game.readyTask(command.taskId)
    this.repository.save(game)
  }
}
