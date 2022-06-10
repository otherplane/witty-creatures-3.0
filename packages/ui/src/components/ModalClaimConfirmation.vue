<template>
  <ModalBase
    title="Register your egg"
    description=" Do you want to start playing on this browser? If not, create a backup using the button in the next page"
    allowText="Continue"
    cancelText="Cancel"
    @allow="emitClaim"
    @cancel="$parent.$emit('close')"
  />
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import bufficornMain from '@/assets/egg.svg?raw'
export default defineComponent({
  emits: ['claim'],
  setup() {
    const instance = getCurrentInstance()
    return {
      bufficornMain,
      emitClaim() {
        instance.emit('claim')
      },
    }
  },
})
</script>
