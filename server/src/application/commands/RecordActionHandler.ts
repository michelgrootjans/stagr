import type { GameRepository } from '../ports/GameRepository'
import type { RecordAction } from './RecordAction'

export class RecordActionHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: RecordAction): void {
    const game = this.repository.findById(command.gameId)
    if (!game) return
    game.recordAction()
    this.repository.save(game)
  }
}
