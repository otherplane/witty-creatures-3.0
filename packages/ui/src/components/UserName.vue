<template>
  <div class="dark-background">
    <img class="network" :src="importSvg(player.mintConfig)" />
    <p class="name">{{ player.username.toUpperCase() }}</p>
    <p class="name">{{ NETWORKS[player.mintConfig].name }}</p>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { importSvg } from '@/composables/importSvg.js'
import { NETWORKS } from '@/constants'

export default {
  setup() {
    const player = useStore()
    return {
      player,
      importSvg,
      NETWORKS,
    }
  },
}
</script>

<style lang="scss" scoped>
.dark-background {
  padding: 4px 8px;
  border-radius: 4px;
  background: $dark-screen;
  color: $screen;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content max-content;
  grid-column-gap: 8px;
  align-items: center;
  .name {
    font-family: JoystixMonospace, sans-serif;
  }
  .network {
    height: 60%;
    grid-row: 1 / span 2;
  }
}
</style>
