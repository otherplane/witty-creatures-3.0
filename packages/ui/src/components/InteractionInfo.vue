<template>
  <div class="counter">
    <transition name="fade">
      <div class="incubation-info left" :class="{ disabled: disabledOut }">
        <p>
          Incubating
          <span class="name">{{ player.interactionOut?.to || '' }}</span>
        </p>
        <div class="box-container">
          <div class="info">
            <TimeLeft
              v-if="player.interactionOut?.ends"
              class="time-left"
              :timestamp="player.interactionOut?.ends"
              :seconds="true"
              @clear-timestamp="clearTimestamp('interactionOut')"
            />
          </div>
          <div class="info">
            <p>+{{ player.interactionOut?.points || '' }}p</p>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="incubation-info right" :class="{ disabled: disabledIn }">
        <p>
          Incubated by
          <span class="name">{{ player.interactionIn?.from || '' }}</span>
        </p>
        <div class="box-container">
          <div class="info">
            <TimeLeft
              v-if="player.interactionIn?.ends"
              class="time-left"
              :timestamp="player.interactionIn?.ends"
              :seconds="true"
              @clear-timestamp="clearTimestamp('interactionIn')"
            />
          </div>
          <div class="info">
            <p>+{{ player.interactionIn?.points || '' }}p</p>
          </div>
        </div>
      </div>
    </transition>
    <div></div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/player'
import { importSvg } from '@/composables/importSvg.js'
export default {
  setup() {
    const player = useStore()
    const show = ref(false)
    const clearTimestamp = interactionType => {
      player[interactionType] = null
      player.socialsSharedMessage = false
    }
    const disabledIn = computed(() => !player.interactionIn)
    const disabledOut = computed(() => !player.interactionOut)
    return { player, show, importSvg, clearTimestamp, disabledIn, disabledOut }
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
.name {
  min-height: 20px;
  background-color: $dark-screen;
  color: $screen;
  border-radius: 4px;
  padding-left: 4px;
  min-width: 50px;
  font-family: JoystixMonospace, sans-serif;
  display: block;
}

.counter {
  margin: 8px 0;
  color: $dark-screen;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  text-align: left;
  grid-template-rows: max-content;

  .box-container {
    margin-top: 4px;
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr;
  }
  .info {
    width: max-content;
    background-color: $dark-screen;
    color: $screen;
    font-weight: 600;
    padding: 2px 4px;
    border-radius: 4px;
    text-align: left;
    display: flex;
    min-width: 100%;
    min-height: 25px;
    font-size: 14px;
  }
  .trait-icon {
    display: inline-block;
    width: 14px;
  }
  .incubation-info {
    display: grid;
    grid-template-rows: max-content 1fr;
    align-items: center;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    &.disabled {
      opacity: 0.2;
      transition: opacity 0.3s ease-in-out;
    }
  }
  .left {
    grid-column: 1;
    display: grid;
    grid-template-rows: max-content 1fr;
    align-items: center;
  }
  .right {
    grid-column: 2;
    display: grid;
    grid-template-rows: max-content 1fr;
    align-items: center;
  }
  .time-left {
    width: max-content;
    overflow: hidden;
    text-align: left;
    font-size: 14px;
  }
}
</style>
