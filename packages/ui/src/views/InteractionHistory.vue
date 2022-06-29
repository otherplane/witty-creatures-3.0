<template>
  <MainLayout>
    <SectionHeader title="HISTORY" />
    <GameScreen :padding="false" class="screen-container">
      <InteractionEntry
        v-for="(interaction, index) in player.history"
        :key="interaction.timestamp"
        :class="{ even: index % 2 }"
        :network="interaction.fromNetwork"
        :points="interaction.points"
        :from="interaction.from"
        :timestamp="interaction.timestamp"
      />
      <CustomInfiniteLoading
        :getItems="player.getInteractionHistory"
        :list="player.history || []"
        :total="totalItems"
        @result="pushItems"
      />
    </GameScreen>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'
export default {
  setup() {
    const player = useStore()
    const totalItems = ref(0)
    const pushItems = items => {
      if (items) {
        player.history.push(...items.result)
        totalItems.value = items.total
      }
    }
    return {
      player,
      totalItems,
      pushItems,
    }
  },
}
</script>
<style lang="scss" scoped>
.even {
  background: $screen-highlight;
  border-radius: 4px;
}
.container {
  row-gap: 0px;
}
</style>
