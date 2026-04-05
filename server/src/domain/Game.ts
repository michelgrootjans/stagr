export class Game {
  readonly players: string[] = []

  constructor(readonly id: string) {}

  addPlayer(playerId: string): void {
    this.players.push(playerId)
  }
}
