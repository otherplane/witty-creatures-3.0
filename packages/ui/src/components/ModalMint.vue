<template>
  <ModalBase
    title="Mint now your NFT"
    description="You are about to bequeath to posterity your perfomance in the Witty Creatures social game that took place during EthCC 2022. The minting process will occur in the Polygon mainnet and it is powered by the Witnet Random Number Generator (RNG) functionality."
    allowText="Continue"
    cancelText="Cancel"
    @allow="mint"
    @cancel="$parent.$emit('close')"
  />
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useWeb3 } from '../composables/useWeb3'
import bufficornMain from '@/assets/egg.svg?raw'
import { useStore } from '@/stores/player'
export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    const web3WittyCreatures = useWeb3()
    const player = useStore()
    return {
      player,
      bufficornMain,
      mint() {
        web3WittyCreatures.mint()
        instance.parent.emit('close')
      },
    }
  },
})
</script>
