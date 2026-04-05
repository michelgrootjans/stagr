import type { GameRepository } from '../ports/GameRepository'

export interface PlayerView {
  id: string
  name: string
}

export interface GameView {
  players: PlayerView[]
}

export class GetGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string): GameView | undefined {
    const game = this.repository.findById(gameId)
    if (!game) return undefined
    return {
      players: game.players.map(id => ({
        id,
        name: game.getCharacter(id)?.name ?? id,
      }))
    }
  }
}
