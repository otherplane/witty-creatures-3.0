<template>
  <span>{{ timeLeft || '0s' }}</span>
</template>

<script>
import { intervalToDuration, formatDuration } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ref, watch, onBeforeUnmount } from 'vue'
import { TIMEZONE } from '@/constants'

export default {
  props: {
    timestamp: Number,
    seconds: Boolean,
  },
  setup(props, { emit }) {
    onBeforeUnmount(() => {
      clearInterval(polling)
    })
    const dateNow = ref(new Date())
    const polling = ref(
      setInterval(() => {
        dateNow.value = new Date()
      }, 0)
    )
    const timeLeft = ref(1)
    const formatWithSeconds = ['days', 'hours', 'minutes', 'seconds']
    const format = ['days', 'hours', 'minutes']
    const formatDistanceLocale = {
      xDays: '{{count}}d',
      xSeconds: '{{count}}s',
      xMinutes: '{{count}}m',
      xHours: '{{count}}h',
    }
    const shortEnLocale = {
      formatDistance: (token, count) =>
        formatDistanceLocale[token].replace('{{count}}', count),
    }
    watch(dateNow, () => {
      const duration = intervalToDuration({
        start: utcToZonedTime(dateNow.value, TIMEZONE),
        end: utcToZonedTime(new Date(props.timestamp), TIMEZONE),
      })
      timeLeft.value = formatDuration(duration, {
        format: props.seconds ? formatWithSeconds : format,
        locale: shortEnLocale,
      })
      if (
        utcToZonedTime(new Date(props.timestamp), TIMEZONE) <
        utcToZonedTime(dateNow.value, TIMEZONE).getTime()
      ) {
        timeLeft.value = '0 s'
        emit('clear-timestamp')
        clearInterval(polling.value)
      }
    })
    return { timeLeft, dateNow }
  },
}
</script>
