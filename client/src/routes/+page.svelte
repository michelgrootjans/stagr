<script lang="ts">
  import { goto } from '$app/navigation'
  import { socket } from '$lib/socket'

  function startNewGame() {
    socket.emit('create_game', (gameId: string) => {
      goto(`/games/${gameId}/facilitator`)
    })
  }
</script>

<main>
  <h1>Stagr</h1>
  <button onclick={startNewGame}>Start new game</button>
</main>
