<template>
  <div v-if="player?.contacts" class="list-container">
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
      <p> Twitter: <span class="highlight">{{ contact.twitter }}</span></p>
      <p> Telegram: <span class="highlight">{{ contact.telegram }}</span></p>
      <p> Discord: <span class="highlight">{{ contact.discord }}</span></p>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { onBeforeMount } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export default {
  setup() {
    const player = useStore()
    onBeforeMount(() => {
      player.getContacts()
    })
    return { player, utcToZonedTime, format }
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