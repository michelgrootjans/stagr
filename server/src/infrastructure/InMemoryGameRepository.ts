import type { GameRepository } from '../application/ports/GameRepository'
import type { Game } from '../domain/Game'

export class InMemoryGameRepository implements GameRepository {
  private readonly games = new Map<string, Game>()

  save(game: Game): void {
    this.games.set(game.id, game)
  }

  findById(gameId: string): Game | undefined {
    return this.games.get(gameId)
  }

  findAll(): Game[] {
    return [...this.games.values()]
  }
}
