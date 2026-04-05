import type { GameRepository } from '../ports/GameRepository'
import { Game } from '../../domain/Game'
import type { CreateGame } from './CreateGame'

export class CreateGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(command: CreateGame): void {
    this.repository.save(new Game(command.gameId))
  }
}
