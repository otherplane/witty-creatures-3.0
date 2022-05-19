<template>
  <div class="medals-container" v-if="player.previews.length >= 1">
    <p class="medals-title">{{ title }}</p>
    <div class="nft-container">
      {{ medals }}
      <!-- <CarouselMedals :medals="medals" /> -->
    </div>
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { OPENSEA_BASE_URL } from '../constants'
export default {
  setup () {
    const player = useStore()
    const title = computed(() => {
      return player.mintedAwards ? 'NFT AWARDS' : 'NFT AWARDS (PREVIEW)'
    })
    const medals = computed(() => {
      if (player.mintedAwards.length) {
        return player.mintedAwards
      } else {
        return player.previews
      }
    })
    return { importSvg, title, player, OPENSEA_BASE_URL, medals }
  }
}
</script>

<style lang="scss" scoped>
.medals-container {
  width: 700px;
}
.nft-container {
  overflow: hidden;
  display: grid;
  border-radius: 4px;
  margin: 16px 0px;
  justify-content: center;
}
.medals-title {
  font-weight: bold;
  font-family: Zilla Slab, sans-serif;
  font-size: 12px;
  color: var(--primary-color);
}
@media (max-width: 600px) {
  .medals-container {
    width: 90vw;
  }
}
</style>
