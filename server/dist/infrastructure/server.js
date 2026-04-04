import { createServer } from 'http';
import { randomUUID } from 'crypto';
import { join } from 'path';
import sirv from 'sirv';
import { Server } from 'socket.io';
const clientBuildPath = join(process.cwd(), 'client', 'build');
const serve = sirv(clientBuildPath, { single: true });
const httpServer = createServer((req, res) => serve(req, res));
const io = new Server(httpServer, {
    cors: { origin: '*' }
});
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('join_game', ({ gameId }, callback) => {
        const playerId = randomUUID();
        socket.join(gameId);
        console.log(`Player ${playerId} joined game ${gameId}`);
        callback(playerId);
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
