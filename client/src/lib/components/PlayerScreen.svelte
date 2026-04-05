<script lang="ts">
  import type { Socket } from 'socket.io-client'
  import { onMount, onDestroy } from 'svelte'

  type Skill = { name: string; level: number }
  type Character = { name: string; skills: Skill[] }
  type Task = { id: string; name: string; requiredSkill: string; remainingEffort: number }
  type GamePhase = 'standup' | 'work'
  type GameState = { phase: GamePhase; tasks: Task[]; players: { id: string; assignedTaskId?: string; hasActed: boolean }[] }

  let { socket, playerId, character }: { socket: Socket; playerId: string; character?: Character } = $props()

  let connected = $state(socket.connected)
  let phase = $state<GamePhase>('standup')
  let tasks = $state<Task[]>([])
  let assignedTaskId = $state<string | undefined>(undefined)
  let hasActed = $state(false)

  function applyGameState(game: GameState) {
    phase = game.phase
    tasks = game.tasks
    const me = game.players.find(p => p.id === playerId)
    if (me) {
      assignedTaskId = me.assignedTaskId
      hasActed = me.hasActed
    }
  }

  function assignTask(taskId: string) {
    socket.emit('assign_task', { taskId })
  }

  function tap() {
    socket.emit('player_action')
  }

  onMount(() => {
    socket.on('connect', () => { connected = true })
    socket.on('disconnect', () => { connected = false })
    socket.on('game_updated', applyGameState)
  })

  onDestroy(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('game_updated')
  })

  const assignedTask = $derived(tasks.find(t => t.id === assignedTaskId))
</script>

<div class="player-screen">
  {#if character}
    <p class="character-name">{character.name}</p>
    <ul class="skills">
      {#each character.skills as skill}
        <li>{skill.name}: {skill.level}</li>
      {/each}
    </ul>
  {:else}
    <p>Player: {playerId}</p>
  {/if}

  {#if phase === 'standup'}
    <p class="phase-label">Standup — pick a task</p>
    {#if tasks.length > 0}
      <ul class="tasks">
        {#each tasks as task}
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
  {:else}
    <p class="phase-label">Work phase</p>
    {#if assignedTask}
      <p class="assigned-task">{assignedTask.name}</p>
    {:else}
      <p class="no-task">No task assigned</p>
    {/if}
    <button class="tap-btn" onclick={tap} disabled={hasActed}>
      {hasActed ? 'Done for today' : 'Tap'}
    </button>
  {/if}

  <p class="status">{connected ? '🟢' : '🔴'}</p>
</div>

<style>
  .player-screen { font-family: sans-serif; padding: 16px; }
  p { margin: 4px 0; font-size: 0.9rem; }
  .character-name { font-weight: bold; font-size: 1rem; }
  .skills { margin: 4px 0; padding-left: 16px; font-size: 0.9rem; }
  .skills li { margin: 2px 0; }
  .phase-label { margin-top: 12px; font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
  .tasks { list-style: none; padding: 0; margin: 8px 0; }
  .tasks li { margin: 4px 0; }
  .task-btn { width: 100%; text-align: left; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; font-size: 0.85rem; }
  .task-btn.selected { background: #e0f0ff; border-color: #4a90d9; font-weight: bold; }
  .skill { color: #888; font-size: 0.8rem; }
  .assigned-task { font-weight: bold; margin: 8px 0; }
  .no-task { color: #999; }
  .tap-btn { margin-top: 8px; padding: 12px 24px; font-size: 1rem; border: none; border-radius: 8px; background: #4a90d9; color: white; cursor: pointer; width: 100%; }
  .tap-btn:disabled { background: #ccc; cursor: default; }
  .status { margin-top: 12px; font-size: 0.75rem; }
</style>
