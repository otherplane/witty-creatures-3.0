<template>
  <ModalBase
    title="Incubation time is over"
    :description="`Mint the NFT, you need to connect to a web3 provider (e.g. MetaMask) and switch to ${
      NETWORKS[player.mintConfig].name
    } network. Create a backup if needed.`"
    :cancel="false"
    cancelText=""
    allowText="Close"
    @allow="$parent.$emit('close')"
  />
</template>

<script>
import { useStore } from '@/stores/player'
import { NETWORKS } from '@/constants'
export default {
  setup() {
    const player = useStore()
    return {
      NETWORKS,
      player,
    }
  },
}
</script>

<style scoped>
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
