import type { GameRepository } from '../ports/GameRepository'
import type { StartRound } from './StartRound'

export class StartRoundHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: StartRound): void {
    const game = this.repository.findById(command.gameId)
    if (!game) return
    game.startRound()
    this.repository.save(game)
  }
}
