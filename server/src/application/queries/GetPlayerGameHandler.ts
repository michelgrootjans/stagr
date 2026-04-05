import type { GameRepository } from '../ports/GameRepository'

export class GetPlayerGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(playerId: string): string | undefined {
    return this.repository.findByPlayerId(playerId)?.id
  }
}
