import { describe, it, expect } from 'vitest'
import { Game } from './Game'

describe('Game', () => {
  it('assigns a character to a player when they join', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    expect(game.getCharacter('player-1')).toBeDefined()
  })

  it('assigns the product-owner role to the first player', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    expect(game.getRole('player-1')).toBe('product-owner')
  })

  it('assigns the developer role to subsequent players', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.addPlayer('player-2')
    expect(game.getRole('player-2')).toBe('developer')
  })

  it('starts in lobby phase', () => {
    const game = new Game('game-1')
    expect(game.getPhase()).toBe('lobby')
  })

  it('transitions to active when the facilitator starts a round', () => {
    const game = new Game('game-1')
    game.startRound()
    expect(game.getPhase()).toBe('active')
  })

  it('does not allow task assignment in lobby', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.addPlayer('player-2')
    const taskId = game.tasks[0].id
    game.readyTask(taskId)

    game.assignTask('player-2', taskId)

    expect(game.getAssignment('player-2')).toBeUndefined()
  })

  it('has a pool of tasks not yet ready', () => {
    const game = new Game('game-1')
    expect(game.tasks.length).toBeGreaterThan(0)
    expect(game.getReadyTasks()).toHaveLength(0)
  })

  it('allows the product owner to ready a task', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    const taskId = game.tasks[0].id

    game.readyTask(taskId)

    expect(game.getReadyTasks()).toContainEqual(expect.objectContaining({ id: taskId }))
  })

  it('allows a developer to assign themselves to a ready task during standup', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1') // PO
    game.addPlayer('player-2') // developer
    const taskId = game.tasks[0].id
    game.readyTask(taskId)
    game.startRound()

    game.assignTask('player-2', taskId)

    expect(game.getAssignment('player-2')).toBe(taskId)
  })

  it('does not allow assigning a task that is not ready', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.addPlayer('player-2')
    const taskId = game.tasks[0].id // not readied

    game.assignTask('player-2', taskId)

    expect(game.getAssignment('player-2')).toBeUndefined()
  })

  it('records a player action during standup', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.startRound()

    game.recordAction('player-1')

    expect(game.hasActed('player-1')).toBe(true)
    expect(game.getEffortCount()).toBe(1)
  })

  it('ignores a second action from the same player in one day', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.startRound()
    game.recordAction('player-1')

    game.recordAction('player-1')

    expect(game.getEffortCount()).toBe(1)
  })

  it('ignores an action in lobby', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')

    game.recordAction('player-1')

    expect(game.getEffortCount()).toBe(0)
  })

  it('reports all developers have acted when every developer has tapped once', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1') // PO
    game.addPlayer('player-2') // developer
    game.addPlayer('player-3') // developer
    game.startRound()

    expect(game.allDevelopersActed()).toBe(false)
    game.recordAction('player-2')
    expect(game.allDevelopersActed()).toBe(false)
    game.recordAction('player-3')
    expect(game.allDevelopersActed()).toBe(true)
  })

  it('returns to active and clears acted state after advancing the day', () => {
    const game = new Game('game-1')
    game.addPlayer('player-1')
    game.startRound()
    game.recordAction('player-1')

    game.advanceDay()

    expect(game.getPhase()).toBe('active')
    expect(game.hasActed('player-1')).toBe(false)
  })
})
