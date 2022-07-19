<template>
  <div class="players-container">
    <p class="item">{{ formatNumber(position) }}</p>
    <img class="network bold" :src="importSvg(NETWORKS[network].kind)" />
    <p class="item player-name">
      <span>{{ NETWORKS[network].kind }}</span>
      <span>{{ name }}</span>
    </p>
    <p class="item player-score">{{ formatNumber(score) }}</p>
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import { NETWORKS } from '@/constants'
import { formatNumber } from '../utils'
export default {
  props: {
    index: Number,
    name: String,
    network: Number,
    score: Number,
    position: Number,
  },
  setup() {
    return {
      importSvg,
      NETWORKS,
      formatNumber,
    }
  },
}
</script>

<style scoped lang="scss">
.players-container {
  display: grid;
  grid-template-columns: 30px max-content 1fr 1fr;
  text-align: center;
  align-items: center;
  row-gap: 8px;
  column-gap: 16px;
  padding: 16px;
  color: $dark-screen;
  font-weight: bolder;
  font-size: 12px;
  .player-name {
    text-align: left;
    font-family: JoystixMonospace, mono;
    font-weight: bold;
    display: grid;
    justify-self: flex-start;
  }
  .network {
    width: 40px;
    max-height: 40px;
    padding: 8px;
  }
  .player-score {
    justify-self: flex-end;
  }
}
</style>
