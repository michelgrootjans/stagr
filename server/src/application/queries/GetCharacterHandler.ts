import type { GameRepository } from '../ports/GameRepository'
import type { Character } from '../../domain/Game'

export class GetCharacterHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string, playerId: string): Character | undefined {
    const game = this.repository.findById(gameId)
    return game?.getCharacter(playerId)
  }
}
