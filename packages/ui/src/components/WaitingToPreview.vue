<template>
  <transition name="fade">
    <div class="info bold">
      <p class="time-container">
        Wait a few minutes to preview your Witty Creature.
        <span v-if="player.tokenStatus < TOKEN_STATUS.randomizing"
          >Waiting for randomization</span
        >
        <span v-if="player.tokenStatus === TOKEN_STATUS.randomizing"
          >Witnet is randomizing</span
        >
        <span id="dots" class="dots"></span>
      </p>
    </div>
  </transition>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from '@/stores/player'
import { TOKEN_STATUS } from '@/constants'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

export default {
  setup() {
    const player = useStore()
    gsap.registerPlugin(TextPlugin)
    onMounted(() => {
      const dots = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
      })
      dots
        .to(`#dots`, {
          text: '',
        })
        .to(`#dots`, {
          text: '.',
        })
        .to(`#dots`, {
          text: '..',
        })
        .to(`#dots`, {
          text: '...',
        })
    })
    const showDefaultMessage = computed(
      () => player.tokenStatus < TOKEN_STATUS.randomizing
    )
    return { player, TOKEN_STATUS, showDefaultMessage }
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.dots {
  display: inline-block;
}
.time-container {
  width: 100%;
  font-size: 16px;
}
.bonus-title {
  text-align: left;
  font-size: 16px;
  color: var(--primary-color);
  margin-right: 8px;
  font-weight: bold;
  .highlight {
    color: var(--primary-color);
  }
}
.time-left {
  width: max-content;
  overflow: hidden;
  text-align: left;
  font-size: 18px;
}
</style>
