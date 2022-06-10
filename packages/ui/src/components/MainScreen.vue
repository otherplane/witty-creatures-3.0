<template>
  <GameScreen class="main-screen">
    <UserName />
    <p class="points">
      <span class="points-bold">{{ formatNumber(player.score) }}</span>
      points
    </p>
    <EggSvg class="egg" />
    <InteractionInfo />
    <NFTPreview />
    <MintInformation />
    <GameOverCounter class="counter" />
    <CountdownToAllowMint
      class="counter"
      v-if="!player.mintingAllow && player.previews.length"
    />
  </GameScreen>
</template>

<script>
import { useStore } from '@/stores/player'
import egg from '@/assets/egg.svg?raw'
import { formatNumber } from '../utils'
export default {
  setup() {
    const player = useStore()
    return {
      player,
      egg,
      formatNumber,
    }
  },
}
</script>

<style lang="scss" scoped>
.main-screen {
  display: grid;
  grid-template-rows: max-content max-content 1fr max-content max-content;
  align-items: center;
}
.points {
  color: $dark-screen;
  font-size: 18px;
  font-weight: bold;
  padding: 8px 0;
}
.counter {
  font-size: 12px;
  font-weight: bold;
}
.egg {
  height: 28vh;
}
.time-left {
  margin-left: 4px;
}
</style>
