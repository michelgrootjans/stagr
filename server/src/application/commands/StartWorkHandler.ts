import type { GameRepository } from '../ports/GameRepository'
import type { StartWork } from './StartWork'

export class StartWorkHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: StartWork): void {
    const game = this.repository.findById(command.gameId)
    if (!game) return
    game.startWork()
    this.repository.save(game)
  }
}
