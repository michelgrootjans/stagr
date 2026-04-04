<script lang="ts">
  import { page } from '$app/stores'
  import { socket } from '$lib/socket'
  import { onMount, onDestroy } from 'svelte'

  const playerId = $page.params.playerId
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

<main>
  <h1>Stagr</h1>
  <p>Player: {playerId}</p>
  <p>Server: {connected ? '🟢 connected' : '🔴 disconnected'}</p>
</main>
