import type { GameRepository } from '../ports/GameRepository'
import type { GamePhase, PlayerRole } from '../../domain/Game'

export interface TaskView {
  id: string
  name: string
  requiredSkill: string
  remainingEffort: number
  ready: boolean
}

export interface PlayerView {
  id: string
  name: string
  role: PlayerRole
  assignedTaskId: string | undefined
  hasActed: boolean
}

export interface GameView {
  phase: GamePhase
  effortCount: number
  tasks: TaskView[]
  players: PlayerView[]
}

export class GetGameHandler {
  constructor(private readonly repository: GameRepository) {}

  handle(gameId: string): GameView | undefined {
    const game = this.repository.findById(gameId)
    if (!game) return undefined
    const readyIds = new Set(game.getReadyTasks().map(t => t.id))
    return {
      phase: game.getPhase(),
      effortCount: game.getEffortCount(),
      tasks: game.tasks.map(t => ({ ...t, ready: readyIds.has(t.id) })),
      players: game.players.map(id => ({
        id,
        name: game.getCharacter(id)?.name ?? id,
        role: game.getRole(id) ?? 'developer',
        assignedTaskId: game.getAssignment(id),
        hasActed: game.hasActed(id),
      }))
    }
  }
}
