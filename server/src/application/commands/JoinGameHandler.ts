import type { GameRepository } from '../ports/GameRepository'

export class JoinGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string, playerId: string): void {
    const game = this.repository.findById(gameId)
    if (!game) return
    game.addPlayer(playerId)
    this.repository.save(game)
  }
}
