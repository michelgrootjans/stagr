export type Skill = { name: string; level: number }
export type Character = { name: string; skills: Skill[] }

const CHARACTERS: Character[] = [
  { name: 'Alice', skills: [{ name: 'Backend', level: 3 }, { name: 'Frontend', level: 1 }] },
  { name: 'Bob', skills: [{ name: 'Frontend', level: 3 }, { name: 'Infrastructure', level: 2 }] },
  { name: 'Carol', skills: [{ name: 'Backend', level: 2 }, { name: 'Security', level: 3 }] },
  { name: 'Dave', skills: [{ name: 'Infrastructure', level: 3 }, { name: 'Backend', level: 1 }] },
]

export class Game {
  readonly players: string[] = []
  private readonly characters = new Map<string, Character>()
  private effortCount = 0

  constructor(readonly id: string) {}

  addPlayer(playerId: string): void {
    this.players.push(playerId)
    this.characters.set(playerId, CHARACTERS[this.players.length - 1 % CHARACTERS.length])
  }

  getCharacter(playerId: string): Character | undefined {
    return this.characters.get(playerId)
  }

  recordAction(): void {
    this.effortCount++
  }

  getEffortCount(): number {
    return this.effortCount
  }
}
