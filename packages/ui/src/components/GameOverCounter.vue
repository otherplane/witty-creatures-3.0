<template>
  <p v-if="!player.gameOver" class="counter">
    <span>GAME ENDS IN: </span>
    <TimeLeft
      class="time-left"
      :timestamp="player.gameOverTimeMilli"
      :seconds="true"
    />
  </p>
  <p v-else class="counter">
    <span>GAME OVER</span>
  </p>
</template>

<script>
import { useStore } from '@/stores/player'
import { formatNumber } from '../utils'
export default {
  setup() {
    const player = useStore()
    return {
      player,
      formatNumber,
    }
  },
}
</script>

<style lang="scss" scoped>
.counter {
  font-weight: bold;
}
</style>
