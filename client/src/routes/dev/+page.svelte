<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { socket } from '$lib/socket'

  let gameIds = $state<string[]>([])

  onMount(() => {
    socket.emit('get_games', (ids: string[]) => { gameIds = ids })
    socket.on('games_updated', (ids: string[]) => { gameIds = ids })
  })

  onDestroy(() => {
    socket.off('games_updated')
  })
</script>

<main>
  <h1>Dev</h1>
  {#if gameIds.length === 0}
    <p>No active games.</p>
  {:else}
    <ul>
      {#each gameIds as id}
        <li><a href="/dev/{id}">{id}</a></li>
      {/each}
    </ul>
  {/if}
</main>
