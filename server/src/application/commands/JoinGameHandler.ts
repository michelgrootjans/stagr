import type { GameRepository } from '../ports/GameRepository'
import type { JoinGame } from './JoinGame'

export class JoinGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: JoinGame): void {
    const game = this.repository.findById(command.gameId)
    if (!game) return
    game.addPlayer(command.playerId)
    this.repository.save(game)
  }
}
