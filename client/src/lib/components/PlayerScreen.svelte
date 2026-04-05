<script lang="ts">
  import type { Socket } from 'socket.io-client'
  import { onMount, onDestroy } from 'svelte'

  type Skill = { name: string; level: number }
  type Character = { name: string; skills: Skill[] }
  type Task = { id: string; name: string; requiredSkill: string; remainingEffort: number; ready: boolean }
  type GamePhase = 'lobby' | 'active'
  type PlayerRole = 'product-owner' | 'developer'
  type PlayerState = { id: string; role: PlayerRole; assignedTaskId?: string; hasActed: boolean; name: string }
  type GameState = { phase: GamePhase; tasks: Task[]; players: PlayerState[] }

  let { socket, playerId, character, gameId }: { socket: Socket; playerId: string; character?: Character; gameId?: string } = $props()

  let connected = $state(socket.connected)
  let phase = $state<GamePhase>('active')
  let tasks = $state<Task[]>([])
  let allPlayers = $state<PlayerState[]>([])
  let role = $state<PlayerRole>('developer')
  let assignedTaskId = $state<string | undefined>(undefined)
  let hasActed = $state(false)
  let playerName = $state('')

  function applyGameState(game: GameState) {
    phase = game.phase
    tasks = game.tasks
    allPlayers = game.players
    const me = game.players.find(p => p.id === playerId)
    if (me) {
      role = me.role
      assignedTaskId = me.assignedTaskId
      hasActed = me.hasActed
      playerName = me.name
    }
  }

  function advanceDay() {
    socket.emit('advance_day')
  }

  function readyTask(taskId: string) {
    socket.emit('ready_task', { taskId })
  }

  function assignTask(taskId: string) {
    socket.emit('assign_task', { taskId })
  }

  function tap() {
    socket.emit('player_action')
  }

  function watchGame(id: string) {
    socket.emit('watch_game', { gameId: id })
    socket.emit('get_game', { gameId: id }, (game: GameState | undefined) => {
      if (game) applyGameState(game)
    })
  }

  onMount(() => {
    socket.on('connect', () => { connected = true })
    socket.on('disconnect', () => { connected = false })
    socket.on('game_updated', applyGameState)

    if (gameId) {
      watchGame(gameId)
    } else {
      socket.emit('get_player_game', { playerId }, (id: string | undefined) => {
        if (id) watchGame(id)
      })
    }
  })

  onDestroy(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('game_updated')
  })

  const assignedTask = $derived(tasks.find(t => t.id === assignedTaskId))
  const poolTasks = $derived(tasks.filter(t => !t.ready))
  const readyTasks = $derived(tasks.filter(t => t.ready))
  const developers = $derived(allPlayers.filter(p => p.role === 'developer'))
  const allDevelopersActed = $derived(developers.length > 0 && developers.every(p => p.hasActed))
</script>

<div class="player-screen">
  <p class="character-name">{character?.name ?? (playerName || playerId)}</p>
  <p class="role-label">{role === 'product-owner' ? 'Product Owner' : 'Developer'}</p>
  {#if character?.skills}
    <p class="skills">{character.skills.map(s => `${s.name} ${s.level}`).join(' · ')}</p>
  {/if}

  {#if phase === 'lobby'}
    <p class="muted">Waiting for the facilitator to start the round…</p>
  {:else if role === 'product-owner'}
    {#if allDevelopersActed}
      <button class="advance-btn" onclick={advanceDay}>Advance day</button>
    {/if}

    <p class="phase-label">Backlog</p>
    {#if readyTasks.length > 0}
      <ul class="tasks">
        {#each readyTasks as task}
          <li class="task ready">✅ {task.name} <span class="skill">({task.requiredSkill})</span></li>
        {/each}
      </ul>
    {/if}
    {#if poolTasks.length > 0}
      <p class="phase-label">Pool</p>
      <ul class="tasks">
        {#each poolTasks as task}
          <li>
            <button class="task-btn" onclick={() => readyTask(task.id)}>
              {task.name} <span class="skill">({task.requiredSkill})</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}

  {:else}
    <p class="phase-label">Pick a task</p>
    {#if readyTasks.length === 0}
      <p class="muted">Waiting for Product Owner to add tasks…</p>
    {:else}
      <ul class="tasks">
        {#each readyTasks as task}
          <li>
            <button
              class="task-btn"
              class:selected={task.id === assignedTaskId}
              onclick={() => assignTask(task.id)}
            >
              {task.name} <span class="skill">({task.requiredSkill})</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    {#if assignedTask}
      <button class="tap-btn" onclick={tap} disabled={hasActed}>
        {hasActed ? 'Done for today' : 'Tap'}
      </button>
    {/if}
  {/if}

  <p class="status">{connected ? '🟢' : '🔴'}</p>

</div>

<style>
  .player-screen { font-family: sans-serif; padding: 16px; }
  p { margin: 4px 0; font-size: 0.9rem; }
  .character-name { font-weight: bold; font-size: 1rem; margin-bottom: 0; }
  .role-label { font-size: 0.75rem; color: #888; margin-bottom: 2px; }
  .skills { font-size: 0.75rem; color: #aaa; margin-bottom: 8px; }
  .phase-label { margin-top: 12px; font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
  .muted { color: #999; }
  .tasks { list-style: none; padding: 0; margin: 6px 0; }
  .tasks li { margin: 4px 0; }
  .task-btn { width: 100%; text-align: left; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; font-size: 0.85rem; }
  .task-btn.selected { background: #e0f0ff; border-color: #4a90d9; font-weight: bold; }
  .task.ready { font-size: 0.85rem; padding: 4px 0; color: #555; }
  .skill { color: #888; font-size: 0.8rem; }
  .assigned-task { font-weight: bold; margin: 8px 0; }
  .tap-btn { margin-top: 8px; padding: 12px 24px; font-size: 1rem; border: none; border-radius: 8px; background: #4a90d9; color: white; cursor: pointer; width: 100%; }
  .tap-btn:disabled { background: #ccc; cursor: default; }
  .advance-btn { margin-bottom: 12px; padding: 12px; font-size: 1rem; border: none; border-radius: 8px; background: #2e7d32; color: white; cursor: pointer; width: 100%; }
  .advance-btn:disabled { background: #ccc; color: #666; cursor: default; }
  .status { margin-top: 12px; font-size: 0.75rem; }
</style>
