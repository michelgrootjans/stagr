import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('join_game', ({ gameId }: { gameId: string }, callback: (playerId: string) => void) => {
    const playerId = randomUUID()
    socket.join(gameId)
    console.log(`Player ${playerId} joined game ${gameId}`)
    callback(playerId)
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
