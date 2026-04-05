---

kanban-plugin: board

---

## Todo

- [ ] Deploy to Heroku — app accessible via public URL

## Busy



## Done

- [x] Player connects on mobile phone (joins via URL, sees hello world + connection status)
- [x] Dev screen (`/games/:gameId/dev`) — simulated player panels, connected to server
- [x] Index page — "Start new game" button creates a game and redirects to facilitator screen


***

## Archive

- [x] Initialize monorepo structure (`/server`, `/client`, `/shared`)
- [x] `shared`: TypeScript package with build setup, no content yet
- [x] `server`: Node.js + TypeScript + Socket.io — starts, accepts connections, joins a room
- [x] `client`: SvelteKit + TypeScript — Socket.io client configured, connects to server
- [x] `/games/:gameId/facilitator` route: Hello World page showing server connection status
- [x] Dev scripts: single command starts both server and client

%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false]}
```
%%