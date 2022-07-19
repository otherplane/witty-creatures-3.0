<template>
  <ModalBase
    title="Do you want to share your social information?"
    description="Share your social information"
    allowText="Share"
    cancelText="Cancel"
    @allow="share"
    @cancel="$parent.$emit('close')"
  />
</template>

<script>
import { useStore } from '@/stores/player'
import modalSvg from '@/assets/egg.svg?raw'

export default {
  emits: ['close'],
  setup(props, { emit }) {
    const player = useStore()
    const share = async () => {
      await player.shareSocials()
      player.socialsSharedMessage = true
      emit('close', 'shareSocials')
    }

    return {
      player,
      share,
      modalSvg,
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
