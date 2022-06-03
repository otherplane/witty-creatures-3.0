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
        v-for="(contact, index) in player?.contacts"
        :key="contact"
        class="contact-container"
        :class="{ even: index % 2 }"
      >
        <p class="contact-label date">
          {{
            format(
              utcToZonedTime(contact.timestamp, timeZone),
              'yyyy-MM-dd HH:mm:ss'
            )
          }}
        </p>
        <p>
          Twitter: <span class="highlight">{{ contact.twitter }}</span>
        </p>
        <p>
          Telegram: <span class="highlight">{{ contact.telegram }}</span>
        </p>
        <p>
          Discord: <span class="highlight">{{ contact.discord }}</span>
        </p>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onBeforeMount, computed, ref } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export default {
  setup() {
    const player = useStore()
    onBeforeMount(() => {
      player.getContacts()
    })
    const timeZone = 'Europe/Paris'
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
      utcToZonedTime,
      format,
      exportContacts,
      timeZone,
      dataStr,
      downloadLink,
      dataInput,
      readFile,
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
.contact-label {
  color: var(--primary-color);
  font-weight: bold;
}
.highlight {
  color: var(--primary-color);
  font-weight: 600;
}
.date {
  width: max-content;
  font-size: 218x;
}
</style>
