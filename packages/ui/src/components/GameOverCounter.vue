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
    <p v-if="player.gameOver && player.mintInfo?.txHash"></p>
    <p
      v-if="player.tokenStatus && player.tokenStatus < TOKEN_STATUS.hatching"
      class="game-over bold"
    >
      GAME OVER
    </p>
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
    const txHash = computed(() => player.mintInfo?.txHash)
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
      if (player.mintInfo?.mintConfirmation) {
        clearInterval(tokenStatusPoller)
      }
      clearInterval(mintConfirmationStatusPoller)
      if (player.mintInfo?.txHash && !player.mintInfo?.mintConfirmation) {
        mintConfirmationStatusPoller = await setInterval(async () => {
          await web3WittyCreatures.getMintConfirmationStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    const tokenStatus = computed(() => player?.tokenStatus)
    const mintConfirmation = computed(() => player.mintInfo?.mintConfirmation)
    watch(tokenStatus, () => {
      getGameOverInfo()
    })
    watch(txHash, () => {
      getGameOverInfo()
    })
    watch(mintConfirmation, () => {
      getGameOverInfo()
    })
    return {
      getTokenStatus,
      player,
      formatNumber,
      TOKEN_STATUS,
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
  margin-bottom: 4px;
  font-family: JoystixMonospace, monospace;
}
</style>
