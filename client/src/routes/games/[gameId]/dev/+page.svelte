<script lang="ts">
  import { io, type Socket } from 'socket.io-client'
  import { page } from '$app/stores'
  import { serverUrl } from '$lib/socket'
  import { onDestroy } from 'svelte'
  import PlayerScreen from '$lib/components/PlayerScreen.svelte'

  const gameId = $page.params.gameId

  type Skill = { name: string; level: number }
  type Character = { name: string; skills: Skill[] }

  type PlayerPanel = {
    socket: Socket
    playerId: string | null
    character: Character | null
    connected: boolean
  }

  let panels = $state<PlayerPanel[]>([])

  function addPlayer() {
    const socket = io(serverUrl, { forceNew: true })
    const index = panels.length
    panels = [...panels, { socket, playerId: null, character: null, connected: false }]

    socket.on('connect', () => {
      panels[index].connected = true
      if (!panels[index].playerId) {
        socket.emit('join_game', { gameId }, ({ playerId, character }: { playerId: string; character: Character }) => {
          panels[index].playerId = playerId
          panels[index].character = character
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
</main>

<style>
  main { font-family: sans-serif; padding: 24px; }
  header { margin-bottom: 24px; display: flex; align-items: center; gap: 24px; }
  h1 { margin: 0; }
  .panels { display: flex; gap: 16px; }
  .player-panel {
    border: 1px solid #ccc; border-radius: 8px;
    overflow: hidden; width: 240px;
  }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 12px; background: #f5f5f5; border-bottom: 1px solid #ccc;
    font-weight: bold; font-size: 0.9rem;
  }
  .actions { display: flex; gap: 6px; }
  .joining { padding: 16px; color: #999; margin: 0; }
</style>
