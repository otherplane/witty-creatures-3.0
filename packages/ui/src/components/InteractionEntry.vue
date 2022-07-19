<template>
  <div class="interaction-container">
    <p class="points bold">+{{ points }}p</p>
    <p class="origin">
      from
      <span class="name">{{ NETWORKS[network].kind }}</span>
      <span class="name">{{ from }}</span>
    </p>
    <p class="interaction-label date">
      {{
        formatDistanceToNowStrict(utcToZonedTime(timestamp, timeZone), {
          includeSeconds: true,
          addSuffix: true,
        })
      }}
    </p>
  </div>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { NETWORKS, TIMEZONE } from '@/constants'
export default {
  props: {
    points: {
      type: Number,
      required: true,
    },
    network: {
      type: Number,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return {
      utcToZonedTime,
      timeZone: TIMEZONE,
      formatDistanceToNowStrict,
      NETWORKS,
    }
  },
}
</script>

<style lang="scss" scoped>
.interaction-container {
  display: grid;
  grid-template-columns: 44px 1fr max-content;
  color: $dark-screen;
  justify-content: center;
  align-items: center;
  padding: 16px;
  font-size: 12px;
  grid-gap: 16px;
  font-weight: bold;
}
.points {
  font-weight: bolder;
}
.date {
  font-size: 10px;
}
.origin {
  display: grid;
  text-align: left;
  .name {
    font-family: JoystixMonospace, mono;
  }
}
</style>
