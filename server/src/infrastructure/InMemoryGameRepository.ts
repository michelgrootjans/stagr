import type { GameRepository } from '../application/ports/GameRepository'

export class InMemoryGameRepository implements GameRepository {
  private readonly games = new Set<string>()

  save(gameId: string): void {
    this.games.add(gameId)
  }
}
