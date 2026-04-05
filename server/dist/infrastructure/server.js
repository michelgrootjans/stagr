// src/infrastructure/server.ts
import { createServer } from "http";
import { randomUUID } from "crypto";
import { join } from "path";
import sirv from "sirv";
import { Server } from "socket.io";

// src/application/commands/CreateGameHandler.ts
var CreateGameHandler = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  handle(gameId) {
    this.repository.save(gameId);
  }
};

// src/infrastructure/InMemoryGameRepository.ts
var InMemoryGameRepository = class {
  games = /* @__PURE__ */ new Set();
  save(gameId) {
    this.games.add(gameId);
  }
};

// src/infrastructure/server.ts
var gameRepository = new InMemoryGameRepository();
var createGameHandler = new CreateGameHandler(gameRepository);
var isDev = process.env.NODE_ENV !== "production";
var httpServer = isDev ? createServer() : (() => {
  const clientBuildPath = join(process.cwd(), "client", "build");
  const serve = sirv(clientBuildPath, { single: true });
  return createServer((req, res) => serve(req, res));
})();
var io = new Server(httpServer, {
  cors: { origin: "*" }
});
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("create_game", (callback) => {
    const gameId = randomUUID();
    createGameHandler.handle(gameId);
    callback(gameId);
  });
  socket.on("join_game", ({ gameId }, callback) => {
    const playerId = randomUUID();
    socket.join(gameId);
    console.log(`Player ${playerId} joined game ${gameId}`);
    callback(playerId);
  });
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 3e3;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
