import { describe, it, expect } from 'vitest'
import { Game } from './Game'

describe('Game', () => {
  it('assigns a character to a player when they join', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    expect(game.getCharacter('player-1')).toBeDefined()
  })

  it('starts in standup phase', () => {
    const game = new Game('game-1')
    expect(game.getPhase()).toBe('standup')
  })

  it('has a seeded task backlog', () => {
    const game = new Game('game-1')
    expect(game.tasks.length).toBeGreaterThan(0)
  })

  it('allows a player to assign themselves to a task during standup', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    const taskId = game.tasks[0].id

    game.assignTask('player-1', taskId)

    expect(game.getAssignment('player-1')).toBe(taskId)
  })

  it('transitions to work phase when facilitator starts work', () => {
    const game = new Game('game-1')

    game.startWork()

    expect(game.getPhase()).toBe('work')
  })

  it('records a player action during the work phase', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.startWork()

    game.recordAction('player-1')

    expect(game.hasActed('player-1')).toBe(true)
    expect(game.getEffortCount()).toBe(1)
  })

  it('ignores a second action from the same player in one day', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.startWork()
    game.recordAction('player-1')

    game.recordAction('player-1')

    expect(game.getEffortCount()).toBe(1)
  })

  it('ignores an action during standup', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')

    game.recordAction('player-1')

    expect(game.getEffortCount()).toBe(0)
  })

  it('returns to standup and clears acted state after advancing the day', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.startWork()
    game.recordAction('player-1')

    game.advanceDay()

    expect(game.getPhase()).toBe('standup')
    expect(game.hasActed('player-1')).toBe(false)
  })
})
