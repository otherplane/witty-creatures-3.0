<template>
  <MainLayout>
    <SectionHeader title="HISTORY" />
    <GameScreen :padding="false" class="screen-container">
      <div v-if="!player.history.length" class="empty-state bold">
        <p class="state-text">No incubations yet.</p>
        <p>
          What are you waiting for? Go look for other players and ask them to
          scan your egg now!
        </p>
      </div>
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
.empty-state {
  padding: 8px;
  margin: 8px;
  .state-text {
    margin-bottom: 8px;
  }
}
.even {
  background: $screen-highlight;
  border-radius: 4px;
}
.container {
  row-gap: 0px;
}
</style>
