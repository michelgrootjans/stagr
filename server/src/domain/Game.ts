export type Skill = { name: string; level: number }
export type Character = { name: string; skills: Skill[] }
export type Task = { id: string; name: string; requiredSkill: string; remainingEffort: number }
export type GamePhase = 'lobby' | 'active'
export type PlayerRole = 'product-owner' | 'developer'

const CHARACTERS: Character[] = [
  { name: 'Alice', skills: [{ name: 'Backend', level: 3 }, { name: 'Frontend', level: 1 }] },
  { name: 'Bob', skills: [{ name: 'Frontend', level: 3 }, { name: 'Infrastructure', level: 2 }] },
  { name: 'Carol', skills: [{ name: 'Backend', level: 2 }, { name: 'Security', level: 3 }] },
  { name: 'Dave', skills: [{ name: 'Infrastructure', level: 3 }, { name: 'Backend', level: 1 }] },
]

const INITIAL_TASKS: Task[] = [
  { id: 'task-1', name: 'Artist profile API', requiredSkill: 'Backend', remainingEffort: 5 },
  { id: 'task-2', name: 'Artist profile page', requiredSkill: 'Frontend', remainingEffort: 4 },
  { id: 'task-3', name: 'Event listing API', requiredSkill: 'Backend', remainingEffort: 4 },
  { id: 'task-4', name: 'Event listing page', requiredSkill: 'Frontend', remainingEffort: 3 },
  { id: 'task-5', name: 'Set up CI pipeline', requiredSkill: 'Infrastructure', remainingEffort: 3 },
  { id: 'task-6', name: 'Security audit', requiredSkill: 'Security', remainingEffort: 4 },
]

export class Game {
  readonly players: string[] = []
  readonly tasks: Task[] = INITIAL_TASKS.map(t => ({ ...t }))
  private readonly characters = new Map<string, Character>()
  private readonly roles = new Map<string, PlayerRole>()
  private readonly readyTaskIds = new Set<string>()
  private readonly assignments = new Map<string, string>()
  private readonly actedToday = new Set<string>()
  private phase: GamePhase = 'lobby'
  private effortCount = 0

  constructor(readonly id: string) {}

  addPlayer(playerId: string): void {
    this.players.push(playerId)
    this.characters.set(playerId, CHARACTERS[this.players.length - 1 % CHARACTERS.length])
    this.roles.set(playerId, this.players.length === 1 ? 'product-owner' : 'developer')
  }

  getCharacter(playerId: string): Character | undefined {
    return this.characters.get(playerId)
  }

  getRole(playerId: string): PlayerRole | undefined {
    return this.roles.get(playerId)
  }

  getPhase(): GamePhase {
    return this.phase
  }

  readyTask(taskId: string): void {
    this.readyTaskIds.add(taskId)
  }

  getReadyTasks(): Task[] {
    return this.tasks.filter(t => this.readyTaskIds.has(t.id))
  }

  assignTask(playerId: string, taskId: string): void {
    if (this.phase !== 'active') return
    if (!this.readyTaskIds.has(taskId)) return
    this.assignments.set(playerId, taskId)
  }

  getAssignment(playerId: string): string | undefined {
    return this.assignments.get(playerId)
  }

  startRound(): void {
    this.phase = 'active'
  }

  recordAction(playerId: string): void {
    if (this.phase !== 'active') return
    if (this.actedToday.has(playerId)) return
    this.actedToday.add(playerId)
    this.effortCount++
  }

  hasActed(playerId: string): boolean {
    return this.actedToday.has(playerId)
  }

  getEffortCount(): number {
    return this.effortCount
  }

  allDevelopersActed(): boolean {
    const developers = this.players.filter(id => this.roles.get(id) === 'developer')
    return developers.length > 0 && developers.every(id => this.actedToday.has(id))
  }

  advanceDay(): void {
    this.actedToday.clear()
  }
}
