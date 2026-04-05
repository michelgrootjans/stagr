<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { socket } from '$lib/socket'

  type Player = { id: string; connected: boolean }

  const gameId = $page.params.gameId

  let connected = $state(false)
  let players = $state<Player[]>([])

  function watchGame() {
    socket.emit('watch_game', { gameId })
    socket.emit('get_game', { gameId }, (game: { players: Player[] } | undefined) => {
      if (game) players = game.players
    })
  }

  onMount(() => {
    connected = socket.connected
    if (socket.connected) watchGame()

    socket.on('connect', () => {
      connected = true
      watchGame()
    })
    socket.on('disconnect', () => { connected = false })
    socket.on('game_updated', (game: { players: Player[] }) => {
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
        <li>{player.connected ? '🟢' : '🔴'} {player.id}</li>
      {/each}
    </ul>
  {/if}

  <a href="/games/{gameId}/dev">Dev</a>
</main>
