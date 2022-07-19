<template>
  <div class="logos-container bold">
    <a
      v-for="network in MAINNET_NETWORKS"
      target="_blank"
      :key="network.kind"
      :href="network.blockExplorerUrls[0]"
    >
      <img class="network" :src="importSvg(network.kind)" />
    </a>
  </div>
</template>

<script>
import { MAINNET_NETWORKS } from '@/constants'
import { importSvg } from '@/composables/importSvg.js'

export default {
  setup() {
    return { MAINNET_NETWORKS, importSvg }
  },
}
</script>

<style lang="scss" scoped>
.logos-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
  grid-template-rows: max-content;
  grid-gap: 8px;
  justify-content: center;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: max-content;
  margin-top: 16px;
  .network {
    padding: 4px;
    height: 30px;
    width: 30px;
  }
}
</style>
