<template>
  <GameScreen :padding="false">
    <div v-if="gameEntity === 'global'" class="list">
      <PlayerGlobalData
        v-for="(player, index) in player.playersGlobalStats"
        :class="{ even: index % 2 }"
        :index="index"
        :key="player.username"
        :name="player.username"
        :position="player.position + 1"
        :score="player.score"
        :network="player.network"
      />
      <CustomInfiniteLoading
        :getItems="player.getGlobalStats"
        filter="global"
        :total="totalGlobalItems"
        :list="player.playersGlobalStats || []"
        @result="pushGlobalItems"
      />
    </div>
    <div v-if="gameEntity === 'network'" class="list">
      <PlayerGlobalData
        v-for="(player, index) in player.playersNetworkStats"
        :class="{ even: index % 2 }"
        :index="index"
        :key="player.username"
        :name="player.username"
        :position="player.position + 1"
        :score="player.score"
        :network="player.network"
      />
      <CustomInfiniteLoading
        :getItems="player.getGlobalStats"
        filter="network"
        :total="totalNetworkItems"
        :list="player.playersNetworkStats || []"
        @result="pushNetworkItems"
      />
    </div>
  </GameScreen>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'
export default {
  props: {
    gameEntity: {
      type: String,
      required: true,
    },
  },
  setup() {
    const player = useStore()
    const totalGlobalItems = ref(0)
    const pushGlobalItems = items => {
      if (items) {
        player.playersGlobalStats.push(...items.global.result)
        totalGlobalItems.value = items.global.total
      }
    }
    const totalNetworkItems = ref(0)
    const pushNetworkItems = items => {
      if (items) {
        player.playersNetworkStats.push(...items.network.result)
        totalNetworkItems.value = items.network.total
      }
    }
    return {
      player,
      pushGlobalItems,
      pushNetworkItems,
      totalNetworkItems,
      totalGlobalItems,
    }
  },
}
</script>
<style lang="scss" scoped>
.even {
  background: var(--primary-color-opacity-2);
  border-radius: 4px;
}
.list-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 40px;
}
@media (max-width: 600px) {
  .list-container {
    grid-template-columns: 1fr;
  }
}
</style>
