<template>
  <MainLayout>
    <SectionHeader title="CONTACTS" />
    <div v-if="player?.contacts" class="list-container">
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
      <CustomButton type="primary" @click="exportContacts">
        Export contact list
      </CustomButton>
      <div
        v-for="(contact, index) in player.contacts?.contacts"
        :key="contact"
        class="contact-container"
        :class="{ even: index % 2 }"
      >
        <div v-if="contact.from !== player.username">
          <ContactCard
            :contact="contact.socialsFrom"
            :timestamp="contact.timestamp"
          />
        </div>
        <div v-if="contact.to !== player.username">
          <ContactCard
            :contact="contact.socialsTo"
            :timestamp="contact.timestamp"
          />
        </div>
      </div>
      <CustomPagination
        v-if="numberPages > 1"
        :limit="numberPages"
        @update-page="updateCurrentPage"
      />
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onBeforeMount, computed, ref, watch } from 'vue'

export default {
  setup() {
    const player = useStore()
    onBeforeMount(() => {
      player.getPlayerInfo()
      player.getContacts()
    })
    const downloadLink = ref('downloadLink')
    const dataInput = ref(null)
    const currentPage = ref(0)
    const limit = ref(25)
    const dataStr = computed(
      () =>
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(player.contacts))
    )
    const numberPages = computed(() => {
      return Math.ceil((player.contacts?.total || 0) / limit.value)
    })
    const offset = computed(() => {
      return limit.value * currentPage.value
    })
    watch(currentPage, async () => {
      await player.getContacts(offset.value, limit.value)
    })
    const exportContacts = () => {
      downloadLink.value.click()
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
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    return {
      player,
      exportContacts,
      dataStr,
      downloadLink,
      dataInput,
      readFile,
      updateCurrentPage,
      numberPages,
    }
  },
}
</script>

<style lang="scss" scoped>
.even {
  background: var(--primary-color-opacity-2);
  border-radius: 4px;
}
.container {
  row-gap: 0px;
}
.contact-container {
  padding: 16px;
  display: grid;
  grid-template-columns: max-content;
  grid-template-rows: max-content;
  justify-content: center;
  column-gap: 24px;
  text-align: left;
}
</style>
