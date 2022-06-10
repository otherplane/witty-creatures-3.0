<template>
  <ModalBase
    title="Hatch your Witty Creature"
    description="This is a preview of the NFT, click the 'Mint' button to receive your Witty Creature NFT."
    allowText="Open"
    cancelText="Cancel"
    @allow="mint"
    @cancel="$parent.$emit('close')"
  />
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useWeb3Witmon } from '../composables/useWeb3Witmon'
import { useStore } from '@/stores/player'

export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    const w3Witmon = useWeb3Witmon()
    const player = useStore()

    return {
      player,
      mint() {
        w3Witmon.open()
        instance.parent.emit('close')
      },
    }
  },
})
</script>
