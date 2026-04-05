import type { GameRepository } from '../ports/GameRepository'

export interface GameView {
  players: string[]
}

export class GetGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string): GameView | undefined {
    const game = this.repository.findById(gameId)
    if (!game) return undefined
    return { players: game.players }
  }
}
