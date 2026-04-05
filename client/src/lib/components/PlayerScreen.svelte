<script lang="ts">
  import type { Socket } from 'socket.io-client'
  import { onMount, onDestroy } from 'svelte'

  type Skill = { name: string; level: number }
  type Character = { name: string; skills: Skill[] }

  let { socket, playerId, character }: { socket: Socket; playerId: string; character?: Character } = $props()

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
  <p class="status">{connected ? '🟢 connected' : '🔴 disconnected'}</p>
</div>

<style>
  .player-screen { font-family: sans-serif; padding: 16px; }
  h1 { margin: 0 0 8px; font-size: 1.2rem; }
  p { margin: 4px 0; font-size: 0.9rem; }
  .character-name { font-weight: bold; font-size: 1rem; }
  .skills { margin: 4px 0; padding-left: 16px; font-size: 0.9rem; }
  .skills li { margin: 2px 0; }
  .status { margin-top: 8px; }
</style>
