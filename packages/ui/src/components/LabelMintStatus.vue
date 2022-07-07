<template>
  <div class="mint-status">
    <p class="label">MINT STATUS</p>
    <div class="status" :class="mintStatus">
      {{ mintStatus.toUpperCase() }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from '@/stores/player'
export default {
  setup() {
    const player = useStore()
    const mintStatus = computed(() => {
      if (
        player.mintInfo?.mintConfirmation ||
        player.mintInfo?.mintExternalConfirmation
      ) {
        return 'minted'
      } else if (player.errors.mint) {
        return 'error'
      } else {
        return 'pending'
      }
    })
    return { mintStatus }
  },
}
</script>

<style scoped lang="scss">
.mint-status {
  justify-self: flex-end;
  width: max-content;
}
.error-text {
  font-size: 12px;
  font-weight: bold;
}
.status {
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  justify-self: flex-end;
  color: var(--primary-color);
  font-family: JoystixMonospace, monospace;
  border: 1px solid $dark-screen;
  background-color: $dark-screen;
  color: $screen;
}
.label {
  color: $dark-screen;
  font-weight: bold;
}
</style>
