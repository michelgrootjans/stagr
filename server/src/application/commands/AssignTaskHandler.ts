import type { GameRepository } from '../ports/GameRepository'
import type { AssignTask } from './AssignTask'

export class AssignTaskHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: AssignTask): void {
    const game = this.repository.findById(command.gameId)
    if (!game) return
    game.assignTask(command.playerId, command.taskId)
    this.repository.save(game)
  }
}
