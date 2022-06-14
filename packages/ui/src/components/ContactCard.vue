<template>
  <p class="contact-label date">
    {{
      format(utcToZonedTime(contact.timestamp, timeZone), 'yyyy-MM-dd HH:mm:ss')
    }}
  </p>
  <p v-if="contact.name">
    Name:
    <span class="highlight">{{ contact.name }}</span>
  </p>
  <p v-if="contact.company">
    Company:
    <span class="highlight">{{ contact.company }}</span>
  </p>
  <p v-if="contact.twitter">
    Twitter:
    <span class="highlight">{{ contact.twitter }}</span>
  </p>
  <p v-if="contact.telegram">
    Telegram:
    <span class="highlight">{{ contact.telegram }}</span>
  </p>
  <p v-if="contact.discord">
    Discord:
    <span class="highlight">{{ contact.discord }}</span>
  </p>
</template>

<script>
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
export default {
  props: {
    contact: {
      type: Object,
      requiered: true,
    },
  },
  setup() {
    const timeZone = 'Europe/Paris'
    return {
      timeZone,
      format,
      utcToZonedTime,
    }
  },
}
</script>

<style lang="scss" scoped>
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
