import type { Game } from '../../domain/Game'

export interface GameRepository {
  save(game: Game): void
  findById(gameId: string): Game | undefined
  findAll(): Game[]
}
