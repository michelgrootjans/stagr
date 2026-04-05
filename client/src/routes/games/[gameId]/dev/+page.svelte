<script lang="ts">
  import { io, type Socket } from 'socket.io-client'
  import { page } from '$app/stores'
  import { serverUrl } from '$lib/socket'
  import { onDestroy } from 'svelte'

  const gameId = $page.params.gameId

  type PlayerPanel = {
    socket: Socket
    playerId: string | null
    connected: boolean
  }

  let panels = $state<PlayerPanel[]>([])

  function addPlayer() {
    const socket = io(serverUrl, { forceNew: true })
    const index = panels.length
    panels = [...panels, { socket, playerId: null, connected: false }]

    socket.on('connect', () => {
      panels[index].connected = true
      if (!panels[index].playerId) {
        socket.emit('join_game', { gameId }, (playerId: string) => {
          panels[index].playerId = playerId
        })
      } else {
        socket.emit('rejoin_game', { gameId, playerId: panels[index].playerId })
      }
    })
    socket.on('disconnect', () => {
      panels[index].connected = false
    })
  }

  onDestroy(() => {
    panels.forEach(p => p.socket.disconnect())
  })
</script>

<main>
  <header>
    <h1>Dev screen</h1>
    <p>Game: {gameId}</p>
    <button onclick={addPlayer}>Add player</button>
  </header>

  <div class="panels">
    {#each panels as panel, i}
      <div class="player-panel">
        <h2>Player {i + 1}</h2>
        <p>{panel.connected ? '🟢 connected' : '🔴 disconnected'}</p>
        <p class="player-id">{panel.playerId ?? '...'}</p>
        <div class="actions">
          <button onclick={() => panel.socket.disconnect()} disabled={!panel.connected}>Disconnect</button>
          <button onclick={() => panel.socket.connect()} disabled={panel.connected}>Reconnect</button>
        </div>
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
  .actions { display: flex; gap: 8px; margin-top: 8px; }
</style>
