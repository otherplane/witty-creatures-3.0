<template>
  <div class="nft">
    <img id="medal-img" :src="nft" />
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { OPENSEA_BASE_URL } from '../constants'
export default {
  setup() {
    const player = useStore()
    const title = computed(() => {
      return player.mintedAwards ? 'NFT' : 'NFT (PREVIEW)'
    })
    const nft = computed(() => {
      let blob = new Blob([player.nft[0]?.svg], { type: 'image/svg+xml' })
      return URL.createObjectURL(blob)
    })
    return { importSvg, title, player, OPENSEA_BASE_URL, nft }
  },
}
</script>

<style lang="scss" scoped>
.nft {
  width: 50%;
  height: auto;
  align-self: center;
  justify-self: center;
}
</style>
