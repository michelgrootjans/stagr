import type { GameRepository } from '../ports/GameRepository'
import { Game } from '../../domain/Game'

export class CreateGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string): void {
    this.repository.save(new Game(gameId))
  }
}
