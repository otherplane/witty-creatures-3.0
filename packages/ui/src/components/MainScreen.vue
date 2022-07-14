<template>
  <GameScreen class="main-screen">
    <UserName />
    <div class="top-info">
      <p class="points">
        <span class="points-bold">{{ formatNumber(player.score) }}</span>
        points
      </p>
      <LabelMintStatus v-if="player.mintInfo" class="mint-status" />
    </div>
    <NFTPreview v-if="player.nft[0]" />
    <EggSvg v-else class="egg" :speed="player.interactionIn ? 0.3 : 0.7" />
    <InteractionInfo v-if="!player.gameOver" />
    <div>
      <MintInformation />
      <GameOverCounter class="counter" />
      <WaitingToPreview
        v-if="player.gameOver && player.tokenStatus < 3"
        class="counter"
      />
    </div>
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
  grid-template-rows: max-content max-content 1fr max-content;
  align-items: center;
}
.top-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  padding: 8px 0;
}
.points {
  color: $dark-screen;
  font-size: 18px;
  font-weight: bold;
}
.counter {
  font-size: 12px;
  font-weight: bold;
}
.egg {
  height: 24vh;
}
.time-left {
  margin-left: 4px;
}
@media (max-width: 600px) {
  .egg {
    height: 20vh;
  }
}
</style>
