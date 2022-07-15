<template>
  <div class="header">
    <router-link to="/" v-if="!fromAuth">
      <SvgImage class="back-btn" :svg="backBtn" />
    </router-link>
    <h3 class="title-section">{{ title }}</h3>
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import backBtn from '@/assets/back-btn.svg?raw'
import { useStore } from '@/stores/player'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    fromAuth: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const player = useStore()
    return { player, importSvg, backBtn }
  },
}
</script>

<style scoped lang="scss">
.header {
  display: grid;
  grid-template-columns: max-content 1fr;
  text-align: left;
  align-items: center;
  column-gap: 24px;
  .back-btn {
    width: 25px;
  }
  .angle {
    margin-right: 8px;
    width: 10px;
  }
  .title-section {
    font-family: JoystixMonospace, 'mono';
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-color);
  }
}
</style>
