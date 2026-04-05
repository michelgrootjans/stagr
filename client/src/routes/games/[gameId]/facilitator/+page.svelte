<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { socket } from '$lib/socket'

  type Player = { id: string; name: string; connected: boolean }
  type GameState = { effortCount: number; players: Player[] }

  const gameId = $page.params.gameId

  let connected = $state(false)
  let players = $state<Player[]>([])
  let effortCount = $state(0)

  function applyGameState(game: GameState) {
    players = game.players
    effortCount = game.effortCount
  }

  function watchGame() {
    socket.emit('watch_game', { gameId })
    socket.emit('get_game', { gameId }, (game: GameState | undefined) => {
      if (game) applyGameState(game)
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
    socket.on('game_updated', (game: GameState) => {
      applyGameState(game)
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

  <p>Effort: {effortCount}</p>

  <h2>Players ({players.length})</h2>
  {#if players.length === 0}
    <p>Waiting for players to join...</p>
  {:else}
    <ul>
      {#each players as player}
        <li>{player.connected ? '🟢' : '🔴'} {player.name}</li>
      {/each}
    </ul>
  {/if}

  <a href="/games/{gameId}/join">Join game</a>
  <a href="/dev/{gameId}">Dev</a>
</main>
