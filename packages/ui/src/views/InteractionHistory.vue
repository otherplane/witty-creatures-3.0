<template>
  <MainLayout>
    <SectionHeader title="HISTORY" />
    <GameScreen :padding="false" class="screen-container">
      <InteractionEntry
        v-for="(interaction, index) in player.history?.interactions"
        :key="interaction.timestamp"
        :class="{ even: index % 2 }"
        :points="interaction.points"
        :from="interaction.from"
        :timestamp="interaction.timestamp"
      />
    </GameScreen>
    <CustomPagination
      v-if="numberPages > 1"
      :limit="numberPages"
      @update-page="updateCurrentPage"
    />
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { onMounted, computed, ref, watch } from 'vue'
export default {
  setup() {
    const player = useStore()
    onMounted(() => {
      player.getInteractionHistory()
    })
    const currentPage = ref(0)
    const limit = ref(25)
    const numberPages = computed(() => {
      return Math.ceil((player.history?.total || 0) / limit.value)
    })
    const offset = computed(() => {
      return limit.value * currentPage.value
    })
    watch(currentPage, async () => {
      await player.getInteractionHistory(offset.value, limit.value)
    })
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    return {
      player,
      numberPages,
      updateCurrentPage,
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
