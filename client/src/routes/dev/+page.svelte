<script lang="ts">
  import { io, type Socket } from 'socket.io-client'
  import { serverUrl } from '$lib/socket'
  import { onMount, onDestroy } from 'svelte'

  const GAME_ID = 'dev-game'
  const PLAYER_COUNT = 3

  type PlayerPanel = {
    socket: Socket
    playerId: string | null
    connected: boolean
  }

  let panels = $state<PlayerPanel[]>([])

  onMount(() => {
    panels = Array.from({ length: PLAYER_COUNT }, () => ({
      socket: io(serverUrl, { forceNew: true }),
      playerId: null,
      connected: false
    }))

    panels.forEach((panel, i) => {
      panel.socket.on('connect', () => {
        panels[i].connected = true
        panels[i].socket.emit('join_game', { gameId: GAME_ID }, (playerId: string) => {
          panels[i].playerId = playerId
        })
      })
      panel.socket.on('disconnect', () => {
        panels[i].connected = false
      })
    })
  })

  onDestroy(() => {
    panels.forEach(p => p.socket.disconnect())
  })
</script>

<main>
  <header>
    <h1>Dev screen</h1>
    <p>Game: {GAME_ID}</p>
    <button disabled>Roll all</button>
  </header>

  <div class="panels">
    {#each panels as panel, i}
      <div class="player-panel">
        <h2>Player {i + 1}</h2>
        <p>{panel.connected ? '🟢 connected' : '🔴 disconnected'}</p>
        <p class="player-id">{panel.playerId ?? '...'}</p>
      </div>
    {/each}
  </div>
</main>

<style>
  main { font-family: sans-serif; padding: 24px; }
  header { margin-bottom: 24px; display: flex; align-items: center; gap: 24px; }
  h1 { margin: 0; }
  .panels { display: flex; gap: 16px; }
  .player-panel {
    border: 1px solid #ccc; border-radius: 8px;
    padding: 16px; width: 200px;
  }
  h2 { margin: 0 0 8px; }
  p { margin: 4px 0; }
  .player-id { font-size: 11px; color: #999; word-break: break-all; }
</style>
