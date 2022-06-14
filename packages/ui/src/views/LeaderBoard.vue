<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="LEADERBOARD" />
      <div class="tabs-container">
        <div v-for="tab in Object.values(tabs)" :key="tab.key">
          <TabButton
            :active="tab.active"
            :label="tab.key"
            @click="activateTab({ primaryValue: tab.key })"
          />
        </div>
      </div>
      <ListStats :gameEntity="primaryTab" />
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { STATS_FILTERS } from '../constants'
export default {
  setup() {
    const player = useStore()
    let primaryTab = ref('global')
    let tabs = ref(STATS_FILTERS)
    onMounted(() => {
      tabs.value[primaryTab.value].active = true
    })
    onBeforeUnmount(() => {
      resetTabs()
    })
    const resetTabs = () => {
      tabs.value[primaryTab.value].active = false
    }
    const stats = {}
    const activateTab = ({ primaryValue }) => {
      resetTabs()
      primaryTab.value = primaryValue
      tabs.value[primaryTab.value].active = true
    }
    return { player, activateTab, tabs, primaryTab, stats }
  },
}
</script>

<style lang="scss" scoped>
.tabs-container {
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-gap: 8px;
  justify-content: center;
}
.subtabs-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .tab {
    margin: 4px 8px;
  }
}
</style>
