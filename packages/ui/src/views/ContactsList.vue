<template>
  <MainLayout>
    <SectionHeader title="CONTACTS" />
    <GameScreen :padding="false">
      <div v-if="!player.contacts.length" class="empty-state bold">
        <p class="state-text">
          Once you get your egg incubated by other player, their contact info
          will show up here if they allow it.
        </p>
        <p>
          What are you waiting for? Go looking for other players and ask them to
          scan your egg now!
        </p>
      </div>
      <div
        v-for="(contact, index) in player.contacts"
        :key="contact"
        :class="{ even: index % 2 }"
      >
        <ContactCard :contact="contact" />
      </div>
      <CustomInfiniteLoading
        :getItems="player.getContacts"
        :list="player.contacts || []"
        :total="totalItems"
        @result="pushItems"
      />
    </GameScreen>
    <!-- <CustomButton
      v-if="player?.contacts"
      type="primary"
      @click="exportContacts"
    >
      Export contact list
    </CustomButton> -->
    <a
      ref="downloadLink"
      class="none"
      :href="dataStr"
      :download="'witty-creatures-contacts.json'"
    ></a>
    <input
      ref="dataInput"
      :style="{ display: 'none' }"
      type="file"
      @change="readFile"
    />
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onBeforeMount, computed, ref } from 'vue'

export default {
  setup() {
    const player = useStore()
    onBeforeMount(() => {
      player.getPlayerInfo()
      player.getContacts()
    })
    const downloadLink = ref('downloadLink')
    const dataInput = ref(null)
    const dataStr = computed(
      () =>
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(player.contacts))
    )
    const exportContacts = () => {
      downloadLink.value.click()
    }
    const totalItems = ref(0)
    const pushItems = items => {
      if (items) {
        player.contacts.push(...items.result)
        totalItems.value = items.total
      }
    }
    const readFile = () => {
      const file = dataInput.value.files[0]
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => {
          const fileText = reader.result
          try {
            const template = JSON.parse(fileText)
            // try to save template if it is valid
            console.log('imported data', template)

            // clear file input to be able to try to load the same file twitce
            dataInput.value = ''
          } catch (error) {
            console.log('Error parsing json')
          }
        },
        false
      )
      reader.readAsText(file)
    }
    return {
      player,
      exportContacts,
      totalItems,
      dataStr,
      downloadLink,
      dataInput,
      readFile,
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
  background: var(--primary-color-opacity-2);
  border-radius: 4px;
}
.container {
  row-gap: 0px;
}
</style>
