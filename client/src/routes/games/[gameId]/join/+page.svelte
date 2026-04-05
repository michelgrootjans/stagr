<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { socket } from '$lib/socket'
  import { onMount } from 'svelte'

  const gameId = $page.params.gameId

  onMount(() => {
    const join = () => {
      socket.emit('join_game', { gameId }, ({ playerId, character }: { playerId: string; character: unknown }) => {
        goto(`/players/${playerId}`, { state: { character } })
      })
    }

    if (socket.connected) {
      join()
    } else {
      socket.once('connect', join)
    }
  })
</script>

<p>Joining game...</p>
