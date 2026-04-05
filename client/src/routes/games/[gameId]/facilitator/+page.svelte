<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { socket } from '$lib/socket'

  let connected = $state(false)

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
  <p>Facilitator screen</p>
  <p>Server: {connected ? '🟢 connected' : '🔴 disconnected'}</p>
</main>
