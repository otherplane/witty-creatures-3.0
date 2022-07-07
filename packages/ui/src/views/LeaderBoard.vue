<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="LEADERBOARD" />
      <div class="tabs-container">
        <div v-for="tab in Object.values(tabs)" :key="tab.key">
          <TabButton
            :active="tab.active"
            :label="tab.label"
            @click="activateTab({ primaryValue: tab.key })"
          />
        </div>
      </div>
    </div>
    <ListStats :gameEntity="primaryTab" />
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onMounted, ref, onBeforeUnmount, computed } from 'vue'
import { NETWORKS } from '../constants'
export default {
  setup() {
    const player = useStore()
    let primaryTab = ref('global')
    const tabs = computed(() => {
      return {
        global: {
          key: 'global',
          label: 'global',
          active: true,
          showSubtabs: false,
        },
        network: {
          key: 'network',
          label: NETWORKS[player.mintConfig]?.kind || 'network',
          active: false,
          showSubtabs: false,
        },
      }
    })
    onMounted(async () => {
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
