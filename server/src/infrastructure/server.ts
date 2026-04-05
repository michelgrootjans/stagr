import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { join } from 'path'
import sirv from 'sirv'
import { Server } from 'socket.io'
import { CreateGameHandler } from '../application/commands/CreateGameHandler'
import { JoinGameHandler } from '../application/commands/JoinGameHandler'
import { GetGameHandler } from '../application/queries/GetGameHandler'
import { InMemoryGameRepository } from './InMemoryGameRepository'

const gameRepository = new InMemoryGameRepository()
const createGameHandler = new CreateGameHandler(gameRepository)
const joinGameHandler = new JoinGameHandler(gameRepository)
const getGameHandler = new GetGameHandler(gameRepository)

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

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('create_game', (callback: (gameId: string) => void) => {
    const gameId = randomUUID()
    createGameHandler.handle(gameId)
    callback(gameId)
  })

  socket.on('join_game', ({ gameId }: { gameId: string }, callback: (playerId: string) => void) => {
    const playerId = randomUUID()
    socket.join(gameId)
    joinGameHandler.handle(gameId, playerId)
    const game = gameRepository.findById(gameId)
    io.to(gameId).emit('game_updated', { players: game?.players ?? [] })
    console.log(`Player ${playerId} joined game ${gameId}`)
    callback(playerId)
  })

  socket.on('get_game', ({ gameId }: { gameId: string }, callback: (game: { players: string[] } | undefined) => void) => {
    callback(getGameHandler.handle(gameId))
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
