import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { join } from 'path'
import sirv from 'sirv'
import { Server } from 'socket.io'
import { createCommandBus } from '../application/createCommandBus'
import { CreateGame } from '../application/commands/CreateGame'
import { JoinGame } from '../application/commands/JoinGame'
import { RecordAction } from '../application/commands/RecordAction'
import type { Character } from '../domain/Game'
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

type PlayerStatus = { id: string; name: string; connected: boolean }

function gameUpdate(gameId: string): { effortCount: number; players: PlayerStatus[] } {
  const game = gameRepository.findById(gameId)
  const connectedIds = new Set(
    [...socketToPlayer.values()]
      .filter(ref => ref.gameId === gameId)
      .map(ref => ref.playerId)
  )
  return {
    effortCount: game?.getEffortCount() ?? 0,
    players: (game?.players ?? []).map(id => ({
      id,
      name: game?.getCharacter(id)?.name ?? id,
      connected: connectedIds.has(id),
    }))
  }
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('create_game', (callback: (gameId: string) => void) => {
    const gameId = randomUUID()
    bus.execute(new CreateGame(gameId))
    callback(gameId)
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

  socket.on('player_action', () => {
    const ref = socketToPlayer.get(socket.id)
    if (!ref) return
    bus.execute(new RecordAction(ref.gameId, ref.playerId))
    io.to(ref.gameId).emit('game_updated', gameUpdate(ref.gameId))
  })

  socket.on('watch_game', ({ gameId }: { gameId: string }) => {
    socket.join(gameId)
  })

  socket.on('get_game', ({ gameId }: { gameId: string }, callback: (game: { players: PlayerStatus[] } | undefined) => void) => {
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
