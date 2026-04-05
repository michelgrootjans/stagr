<script lang="ts">
  import { io, type Socket } from 'socket.io-client'
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { socket, serverUrl } from '$lib/socket'
  import PlayerScreen from '$lib/components/PlayerScreen.svelte'

  const gameId = $page.params.gameId

  type Skill = { name: string; level: number }
  type Character = { name: string; skills: Skill[] }
  type Player = { id: string; name: string; connected: boolean }
  type GameState = { effortCount: number; players: Player[] }

  type PlayerPanel = {
    socket: Socket
    playerId: string | null
    character: Character | null
    connected: boolean
  }

  let players = $state<Player[]>([])
  let effortCount = $state(0)
  let panels = $state<PlayerPanel[]>([])

  function applyGameState(game: GameState) {
    players = game.players
    effortCount = game.effortCount
    const panelPlayerIds = new Set(panels.map(p => p.playerId))
    game.players
      .filter(p => !panelPlayerIds.has(p.id))
      .forEach(p => spawnPanel(p.id))
  }

  function watchGame() {
    socket.emit('watch_game', { gameId })
    socket.emit('get_game', { gameId }, (game: GameState | undefined) => {
      if (game) applyGameState(game)
    })
  }

  function spawnPanel(existingPlayerId?: string) {
    const playerSocket = io(serverUrl, { forceNew: true })
    const index = panels.length
    panels = [...panels, { socket: playerSocket, playerId: existingPlayerId ?? null, character: null, connected: false }]

    playerSocket.on('connect', () => {
      panels[index].connected = true
      if (!panels[index].playerId) {
        playerSocket.emit('join_game', { gameId }, ({ playerId, character }: { playerId: string; character: Character }) => {
          panels[index].playerId = playerId
          panels[index].character = character
        })
      } else {
        playerSocket.emit('rejoin_game', { gameId, playerId: panels[index].playerId })
      }
    })
    playerSocket.on('disconnect', () => {
      panels[index].connected = false
    })
  }

  function addPlayer() {
    spawnPanel()
  }

  onMount(() => {
    socket.emit('watch_game', { gameId })
    socket.emit('get_game', { gameId }, (game: GameState | undefined) => {
      if (game) applyGameState(game)
    })
    socket.on('connect', watchGame)
    socket.on('game_updated', applyGameState)
  })

  onDestroy(() => {
    socket.off('connect', watchGame)
    socket.off('game_updated', applyGameState)
    panels.forEach(p => p.socket.disconnect())
  })
</script>

<main>
  <header>
    <h1>Dev screen</h1>
    <p>Game: {gameId} — Effort: {effortCount}</p>
    <a href="/games/{gameId}/facilitator">Facilitator</a>
    <button onclick={addPlayer}>Add player</button>
  </header>

  <h2>Players ({players.length})</h2>
  {#if players.length === 0}
    <p>No players yet.</p>
  {:else}
    <ul>
      {#each players as player}
        <li>{player.connected ? '🟢' : '🔴'} {player.name} <span class="id">{player.id}</span></li>
      {/each}
    </ul>
  {/if}

  {#if panels.length > 0}
    <h2>Simulated players</h2>
    <div class="panels">
      {#each panels as panel, i}
        <div class="player-panel">
          <div class="panel-header">
            <span>Player {i + 1}</span>
            <div class="actions">
              <button onclick={() => panel.socket.disconnect()} disabled={!panel.connected}>Disconnect</button>
              <button onclick={() => panel.socket.connect()} disabled={panel.connected}>Reconnect</button>
            </div>
          </div>
          {#if panel.playerId}
            <PlayerScreen socket={panel.socket} playerId={panel.playerId} character={panel.character ?? undefined} />
          {:else}
            <p class="joining">Joining...</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  main { font-family: sans-serif; padding: 24px; }
  header { margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
  h1 { margin: 0; }
  h2 { margin: 16px 0 8px; }
  ul { margin: 0; padding-left: 16px; }
  li { font-size: 0.9rem; margin: 2px 0; }
  .id { color: #999; font-size: 0.75rem; margin-left: 8px; }
  .panels { display: flex; gap: 16px; flex-wrap: wrap; }
  .player-panel { border: 1px solid #ccc; border-radius: 8px; overflow: hidden; width: 240px; }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 12px; background: #f5f5f5; border-bottom: 1px solid #ccc;
    font-weight: bold; font-size: 0.9rem;
  }
  .actions { display: flex; gap: 6px; }
  .joining { padding: 16px; color: #999; margin: 0; }
</style>
