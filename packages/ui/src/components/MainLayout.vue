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
  min-height: 100vh;
  display: grid;
  grid-template-rows: max-content;
}
.layout {
  width: 100%;
  max-width: 700px;
  display: grid;
  grid-gap: 16px;
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-template-columns: 1fr;
  margin: 0 auto;
  &.three-col {
    grid-template-rows: max-content 1fr max-content;
  }
  &.padding {
    margin-top: 16px;
    padding: 16px;
  }
  &.max-height {
    min-height: 80vh;
  }
}
@media (max-width: 600px) {
  .bufficorn-img {
    height: 50vh;
    right: -50px;
    position: fixed;
    bottom: 0;
  }
}
</style>
