import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { join } from 'path'
import sirv from 'sirv'
import { Server } from 'socket.io'
import { createCommandBus } from '../application/createCommandBus'
import { CreateGame } from '../application/commands/CreateGame'
import { JoinGame } from '../application/commands/JoinGame'
import { AssignTask } from '../application/commands/AssignTask'
import { ReadyTask } from '../application/commands/ReadyTask'
import { StartRound } from '../application/commands/StartRound'
import { AdvanceDay } from '../application/commands/AdvanceDay'
import { RecordAction } from '../application/commands/RecordAction'
import type { Character, GamePhase, PlayerRole } from '../domain/Game'
import { InMemoryGameRepository } from './InMemoryGameRepository'
import { GetPlayerGameHandler } from '../application/queries/GetPlayerGameHandler'

const gameRepository = new InMemoryGameRepository()
const bus = createCommandBus(gameRepository)
const getPlayerGame = new GetPlayerGameHandler(gameRepository)

const isDev = process.env.NODE_ENV !== 'production'
const httpServer = isDev
  ? createServer()
  : (() => {
      const clientBuildPath = join(process.cwd(), 'client', 'build')
      const serve = sirv(clientBuildPath, { single: true })
      return createServer((req, res) => serve(req, res))
    })()
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

type PlayerRef = { gameId: string; playerId: string }
const socketToPlayer = new Map<string, PlayerRef>()

type TaskStatus = { id: string; name: string; requiredSkill: string; remainingEffort: number; ready: boolean }
type PlayerStatus = { id: string; name: string; role: PlayerRole; connected: boolean; assignedTaskId: string | undefined; hasActed: boolean }
type GameUpdate = { phase: GamePhase; effortCount: number; tasks: TaskStatus[]; players: PlayerStatus[] }

function gameUpdate(gameId: string): GameUpdate {
  const game = gameRepository.findById(gameId)
  const connectedIds = new Set(
    [...socketToPlayer.values()]
      .filter(ref => ref.gameId === gameId)
      .map(ref => ref.playerId)
  )
  const readyIds = new Set(game?.getReadyTasks().map(t => t.id) ?? [])
  return {
    phase: game?.getPhase() ?? 'lobby',
    effortCount: game?.getEffortCount() ?? 0,
    tasks: (game?.tasks ?? []).map(t => ({ ...t, ready: readyIds.has(t.id) })),
    players: (game?.players ?? []).map(id => ({
      id,
      name: game?.getCharacter(id)?.name ?? id,
      role: game?.getRole(id) ?? 'developer',
      connected: connectedIds.has(id),
      assignedTaskId: game?.getAssignment(id),
      hasActed: game?.hasActed(id) ?? false,
    }))
  }
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('create_game', (callback: (gameId: string) => void) => {
    const gameId = randomUUID()
    bus.execute(new CreateGame(gameId))
    io.emit('games_updated', gameRepository.findAll().map(g => g.id))
    callback(gameId)
  })

  socket.on('get_games', (callback: (gameIds: string[]) => void) => {
    callback(gameRepository.findAll().map(g => g.id))
  })

  socket.on('join_game', ({ gameId }: { gameId: string }, callback: (result: { playerId: string; character: Character | undefined }) => void) => {
    const playerId = randomUUID()
    socket.join(gameId)
    bus.execute(new JoinGame(gameId, playerId))
    socketToPlayer.set(socket.id, { gameId, playerId })
    io.to(gameId).emit('game_updated', gameUpdate(gameId))
    const character = gameRepository.findById(gameId)?.getCharacter(playerId)
    console.log(`Player ${playerId} joined game ${gameId}`)
    callback({ playerId, character })
  })

  socket.on('rejoin_game', ({ gameId, playerId }: { gameId: string; playerId: string }) => {
    socket.join(gameId)
    socketToPlayer.set(socket.id, { gameId, playerId })
    io.to(gameId).emit('game_updated', gameUpdate(gameId))
    console.log(`Player ${playerId} rejoined game ${gameId}`)
  })

  socket.on('ready_task', ({ taskId }: { taskId: string }) => {
    const ref = socketToPlayer.get(socket.id)
    if (!ref) return
    bus.execute(new ReadyTask(ref.gameId, taskId))
    io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
  })

  socket.on('assign_task', ({ taskId }: { taskId: string }) => {
    const ref = socketToPlayer.get(socket.id)
    if (!ref) return
    bus.execute(new AssignTask(ref.gameId, ref.playerId, taskId))
    io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
  })

  socket.on('start_round', ({ gameId }: { gameId: string }) => {
    bus.execute(new StartRound(gameId))
    io.to(gameId).emit('game_updated', gameUpdate(gameId))
  })

  socket.on('advance_day', () => {
    const ref = socketToPlayer.get(socket.id)
    if (!ref) return
    if (gameRepository.findById(ref.gameId)?.getRole(ref.playerId) !== 'product-owner') return
    bus.execute(new AdvanceDay(ref.gameId))
    io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
  })

  socket.on('player_action', () => {
    const ref = socketToPlayer.get(socket.id)
    if (!ref) return
    bus.execute(new RecordAction(ref.gameId, ref.playerId))
    io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
  })

  socket.on('get_player_game', ({ playerId }: { playerId: string }, callback: (gameId: string | undefined) => void) => {
    callback(getPlayerGame.handle(playerId))
  })

  socket.on('watch_game', ({ gameId }: { gameId: string }) => {
    socket.join(gameId)
  })

  socket.on('get_game', ({ gameId }: { gameId: string }, callback: (game: GameUpdate | undefined) => void) => {
    const game = gameRepository.findById(gameId)
    if (!game) { callback(undefined); return }
    callback(gameUpdate(gameId))
  })

  socket.on('disconnect', () => {
    const ref = socketToPlayer.get(socket.id)
    if (ref) {
      socketToPlayer.delete(socket.id)
      io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
      console.log(`Player ${ref.playerId} disconnected from game ${ref.gameId}`)
    } else {
      console.log(`Client disconnected: ${socket.id}`)
    }
  })
})

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
