<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { socket } from '$lib/socket'
  import QRCode from 'qrcode'

  type Task = { id: string; name: string; requiredSkill: string; remainingEffort: number }
  type GamePhase = 'standup' | 'work'
  type Player = { id: string; name: string; connected: boolean; assignedTaskId: string | undefined; hasActed: boolean }
  type GameState = { phase: GamePhase; effortCount: number; tasks: Task[]; players: Player[] }

  const gameId = $page.params.gameId
  const joinUrl = `${window.location.origin}/games/${gameId}/join`

  let connected = $state(false)
  let phase = $state<GamePhase>('standup')
  let players = $state<Player[]>([])
  let tasks = $state<Task[]>([])
  let effortCount = $state(0)
  let qrDataUrl = $state('')

  function applyGameState(game: GameState) {
    phase = game.phase
    players = game.players
    tasks = game.tasks
    effortCount = game.effortCount
  }

  function watchGame() {
    socket.emit('watch_game', { gameId })
    socket.emit('get_game', { gameId }, (game: GameState | undefined) => {
      if (game) applyGameState(game)
    })
  }

  function startWork() {
    socket.emit('start_work', { gameId })
  }

  function advanceDay() {
    socket.emit('advance_day', { gameId })
  }

  const taskMap = $derived(new Map(tasks.map(t => [t.id, t])))
  const allActed = $derived(players.length > 0 && players.every(p => p.hasActed))

  onMount(async () => {
    qrDataUrl = await QRCode.toDataURL(joinUrl, { width: 200, margin: 1 })

    connected = socket.connected
    if (socket.connected) watchGame()

    socket.on('connect', () => {
      connected = true
      watchGame()
    })
    socket.on('disconnect', () => { connected = false })
    socket.on('game_updated', applyGameState)
  })

  onDestroy(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('game_updated')
  })
</script>

<main>
  <h1>Stagr</h1>
  <p>Server: {connected ? '🟢 connected' : '🔴 disconnected'}</p>
  <p>Phase: <strong>{phase}</strong> — Effort: {effortCount}</p>

  {#if phase === 'standup'}
    <button onclick={startWork} disabled={players.length === 0}>Start work</button>
  {:else}
    <button onclick={advanceDay}>
      {allActed ? 'Next day' : 'Advance day'}
    </button>
  {/if}

  <h2>Players ({players.length})</h2>
  {#if players.length === 0}
    <p>Waiting for players to join...</p>
  {:else}
    <ul>
      {#each players as player}
        <li>
          {player.connected ? '🟢' : '🔴'}
          {player.name}
          {#if player.assignedTaskId}
            — {taskMap.get(player.assignedTaskId)?.name ?? player.assignedTaskId}
          {:else if phase === 'standup'}
            — <em>no task</em>
          {/if}
          {#if phase === 'work'}
            {player.hasActed ? '✅' : '⏳'}
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

  {#if qrDataUrl}
    <a href={joinUrl}><img src={qrDataUrl} alt="Scan to join the game" width="200" height="200" /></a>
  {/if}

  <a href="/dev/{gameId}">Dev</a>
</main>
