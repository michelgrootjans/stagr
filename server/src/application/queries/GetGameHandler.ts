import type { GameRepository } from '../ports/GameRepository'
import type { Task, GamePhase } from '../../domain/Game'

export interface PlayerView {
  id: string
  name: string
  assignedTaskId: string | undefined
  hasActed: boolean
}

export interface GameView {
  phase: GamePhase
  effortCount: number
  tasks: Task[]
  players: PlayerView[]
}

export class GetGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string): GameView | undefined {
    const game = this.repository.findById(gameId)
    if (!game) return undefined
    return {
      phase: game.getPhase(),
      effortCount: game.getEffortCount(),
      tasks: game.tasks,
      players: game.players.map(id => ({
        id,
        name: game.getCharacter(id)?.name ?? id,
        assignedTaskId: game.getAssignment(id),
        hasActed: game.hasActed(id),
      }))
    }
  }
}
