<template>
  <div class="players-container">
    <p class="item">{{ position }}</p>
    <img class="network bold" :src="importSvg(network)" />
    <p class="item player-name">
      <span>{{ network }}</span>
      <span>{{ name }}</span>
    </p>
    <p class="item player-score">{{ score }}</p>
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
export default {
  props: {
    index: Number,
    name: String,
    network: String,
    score: Number,
    position: Number,
  },
  setup() {
    return {
      importSvg,
    }
  },
}
</script>

<style scoped lang="scss">
.players-container {
  display: grid;
  grid-template-columns: max-content max-content max-content 1fr;
  align-items: center;
  row-gap: 16px;
  column-gap: 16px;
  padding: 16px;
  color: $dark-screen;
  font-weight: bolder;
  font-size: 12px;
  .player-name {
    text-align: left;
    display: grid;
    font-family: JoystixMonospace, mono;
    font-weight: bold;
    justify-self: flex-start;
  }
  .network {
    width: 30px;
    padding: 8px;
  }
  .player-score {
    justify-self: flex-end;
  }
}
</style>
