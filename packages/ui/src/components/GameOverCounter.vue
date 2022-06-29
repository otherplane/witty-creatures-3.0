<template>
  <div>
    <p v-if="!player.gameOver" class="counter">
      <span>GAME ENDS IN: </span>
      <TimeLeft
        class="time-left"
        :timestamp="player.gameOverTimeMilli"
        :seconds="true"
        @clear-timestamp="getTokenStatus"
      />
    </p>
    <p v-if="player.gameOver && player.mintInfo?.transactionHash"></p>
    <p class="game-over bold" v-else>GAME OVER</p>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { formatNumber } from '../utils'
import { useWeb3 } from '../composables/useWeb3'
import { onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { POLLER_MILLISECONDS, TOKEN_STATUS } from '@/constants.js'
export default {
  setup() {
    let tokenStatusPoller
    let mintConfirmationStatusPoller
    const player = useStore()
    const web3WittyCreatures = useWeb3()
    const getTokenStatus = async () => {
      if (player.gameOverTimeMilli < Date.now()) {
        player.gameOver = true
        await web3WittyCreatures.getTokenStatus()
        tokenStatusPoller = setInterval(async () => {
          await web3WittyCreatures.getTokenStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    onBeforeUnmount(() => {
      clearInterval(tokenStatusPoller)
      clearInterval(mintConfirmationStatusPoller)
    })
    onMounted(async () => {
      await player.getPlayerInfo()
      if (player.gameOver) {
        tokenStatusPoller = await setInterval(async () => {
          await web3WittyCreatures.getTokenStatus()
        }, POLLER_MILLISECONDS)
        await web3WittyCreatures.enableProvider()
      }
    })
    const getGameOverInfo = async () => {
      if (Number(player.tokenStatus) >= TOKEN_STATUS.hatching) {
        await player.getPreview()
        await player.getMintInfo()
      }
      if (player.mintConfirmation) {
        clearInterval(tokenStatusPoller)
      }
      clearInterval(mintConfirmationStatusPoller)
      if (player.mintInfo?.transactionHash && !player.mintConfirmation) {
        mintConfirmationStatusPoller = await setInterval(async () => {
          await web3WittyCreatures.getMintConfirmationStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    const tokenStatus = computed(() => player?.tokenStatus)
    const mintConfirmation = computed(() => player?.mintConfirmation)
    watch(tokenStatus, () => {
      getGameOverInfo()
    })
    watch(mintConfirmation, () => {
      getGameOverInfo()
    })
    return {
      getTokenStatus,
      player,
      formatNumber,
    }
  },
}
</script>

<style lang="scss" scoped>
.counter {
  font-size: 12px;
  font-weight: bold;
}
.game-over {
  margin-top: 4px;
  font-weight: bold;
  width: max-content;
  font-size: 12px;
  font-family: JoystixMonospace, monospace;
}
</style>
