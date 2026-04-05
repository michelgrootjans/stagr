<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { socket } from '$lib/socket'

  const gameId = $page.params.gameId

  let connected = $state(false)
  let players = $state<string[]>([])

  function fetchGame() {
    socket.emit('get_game', { gameId }, (game: { players: string[] } | undefined) => {
      if (game) players = game.players
    })
  }

  onMount(() => {
    connected = socket.connected
    if (socket.connected) fetchGame()

    socket.on('connect', () => {
      connected = true
      fetchGame()
    })
    socket.on('disconnect', () => { connected = false })
    socket.on('game_updated', (game: { players: string[] }) => {
      players = game.players
    })
  })

  onDestroy(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('game_updated')
  })
</script>

<main>
  <h1>Stagr</h1>
  <p>Facilitator screen</p>
  <p>Server: {connected ? '🟢 connected' : '🔴 disconnected'}</p>

  <h2>Players ({players.length})</h2>
  {#if players.length === 0}
    <p>Waiting for players to join...</p>
  {:else}
    <ul>
      {#each players as player}
        <li>{player}</li>
      {/each}
    </ul>
  {/if}

  <a href="/games/{gameId}/dev">Dev</a>
</main>
