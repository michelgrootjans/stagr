import type { GameRepository } from '../ports/GameRepository'

export class CreateGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string): void {
    this.repository.save(gameId)
  }
}
