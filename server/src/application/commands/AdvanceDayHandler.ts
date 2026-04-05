import type { GameRepository } from '../ports/GameRepository'
import type { AdvanceDay } from './AdvanceDay'

export class AdvanceDayHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: AdvanceDay): void {
    const game = this.repository.findById(command.gameId)
    if (!game) return
    game.advanceDay()
    this.repository.save(game)
  }
}
