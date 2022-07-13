<template>
  <div class="background" :class="THEME_COLORS[player?.color]">
    <WitnetStrip class="witnet-logo-strip" />
    <div class="layout" :class="{ padding, 'three-col': threeCol }">
      <slot />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue-demi'
import { useStore } from '@/stores/player'
import { THEME_COLORS } from '../constants'
export default defineComponent({
  props: {
    padding: {
      type: Boolean,
      default: true,
    },
    threeCol: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const player = useStore()
    return {
      player,
      THEME_COLORS,
    }
  },
})
</script>
<style scoped lang="scss">
.background {
  height: 100vh;
  display: grid;
  grid-template-rows: max-content 1fr;
}
.layout {
  display: grid;
  width: 100%;
  max-width: 700px;
  grid-gap: 16px;
  grid-template-rows: max-content 1fr;
  grid-template-columns: 1fr;
  margin: 0 auto;
  &.three-col {
    grid-template-rows: max-content 1fr max-content;
  }
  &.padding {
    padding: 24px 16px 16px 16px;
  }
}
@media (max-width: 600px) {
  .background {
    height: -webkit-fill-available;
  }
}
</style>
