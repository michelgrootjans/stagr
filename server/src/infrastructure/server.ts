import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { join } from 'path'
import sirv from 'sirv'
import { Server } from 'socket.io'
import { createCommandBus } from '../application/createCommandBus'
import { CreateGame } from '../application/commands/CreateGame'
import { JoinGame } from '../application/commands/JoinGame'
import { AssignTask } from '../application/commands/AssignTask'
import { StartWork } from '../application/commands/StartWork'
import { AdvanceDay } from '../application/commands/AdvanceDay'
import { RecordAction } from '../application/commands/RecordAction'
import type { Character, Task, GamePhase } from '../domain/Game'
import { InMemoryGameRepository } from './InMemoryGameRepository'

const gameRepository = new InMemoryGameRepository()
const bus = createCommandBus(gameRepository)

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

type PlayerStatus = { id: string; name: string; connected: boolean; assignedTaskId: string | undefined; hasActed: boolean }
type GameUpdate = { phase: GamePhase; effortCount: number; tasks: Task[]; players: PlayerStatus[] }

function gameUpdate(gameId: string): GameUpdate {
  const game = gameRepository.findById(gameId)
  const connectedIds = new Set(
    [...socketToPlayer.values()]
      .filter(ref => ref.gameId === gameId)
      .map(ref => ref.playerId)
  )
  return {
    phase: game?.getPhase() ?? 'standup',
    effortCount: game?.getEffortCount() ?? 0,
    tasks: game?.tasks ?? [],
    players: (game?.players ?? []).map(id => ({
      id,
      name: game?.getCharacter(id)?.name ?? id,
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

  socket.on('assign_task', ({ taskId }: { taskId: string }) => {
    const ref = socketToPlayer.get(socket.id)
    if (!ref) return
    bus.execute(new AssignTask(ref.gameId, ref.playerId, taskId))
    io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
  })

  socket.on('start_work', ({ gameId }: { gameId: string }) => {
    bus.execute(new StartWork(gameId))
    io.to(gameId).emit('game_updated', gameUpdate(gameId))
  })

  socket.on('advance_day', ({ gameId }: { gameId: string }) => {
    bus.execute(new AdvanceDay(gameId))
    io.to(gameId).emit('game_updated', gameUpdate(gameId))
  })

  socket.on('player_action', () => {
    const ref = socketToPlayer.get(socket.id)
    if (!ref) return
    bus.execute(new RecordAction(ref.gameId, ref.playerId))
    io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
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
