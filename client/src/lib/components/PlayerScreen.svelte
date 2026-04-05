<script lang="ts">
  import type { Socket } from 'socket.io-client'
  import { onMount, onDestroy } from 'svelte'

  let { socket, playerId }: { socket: Socket; playerId: string } = $props()

  let connected = $state(socket.connected)

  onMount(() => {
    socket.on('connect', () => { connected = true })
    socket.on('disconnect', () => { connected = false })
  })

  onDestroy(() => {
    socket.off('connect')
    socket.off('disconnect')
  })
</script>

<div class="player-screen">
  <h1>Stagr</h1>
  <p>Player: {playerId}</p>
  <p>Server: {connected ? '🟢 connected' : '🔴 disconnected'}</p>
</div>

<style>
  .player-screen { font-family: sans-serif; padding: 16px; }
  h1 { margin: 0 0 8px; font-size: 1.2rem; }
  p { margin: 4px 0; font-size: 0.9rem; }
</style>
