<script lang="ts">
  import { page } from '$app/stores'
  import { socket } from '$lib/socket'
  import PlayerScreen from '$lib/components/PlayerScreen.svelte'

  const playerId = $page.params.playerId
  const character = $page.state.character
</script>

<PlayerScreen {socket} {playerId} {character} />
