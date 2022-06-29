<template>
  <ModalBase
    title="Eggxport information"
    description="Copy the link to import your egg in another browser:"
    :subtitle="importLink"
    allowText="Copy"
    cancelText="Cancel"
    @allow="copyToClipboard"
    @cancel="close"
  />
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { createImportLink } from '../services/exportInformation'
import { copyTextToClipboard } from '../services/copyToClipboard'
import { useStore } from '../stores/player'
import modalSvg from '@/assets/egg.svg?raw'
export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    const importLink = createImportLink()
    const player = useStore()
    return {
      close() {
        instance.parent.emit('close')
      },
      player,
      modalSvg,
      importLink,
      async copyToClipboard() {
        await copyTextToClipboard(importLink)
        player.notify({ message: 'Copied', icon: 'none' })
        instance.parent.emit('close')
      },
    }
  },
})
</script>

<style scoped>
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
