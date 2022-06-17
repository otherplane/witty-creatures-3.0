<template>
  <div ref="contactRef">
    <div @click="toggleDetails" class="contact-container">
      <EggSvg class="egg" :color="THEME_COLORS[color]" :speed="1" />
      <p v-if="contact.name" class="name">
        Name:
        <span>{{ contact.name }}</span>
      </p>
      <p v-if="contact.company" class="contact-label">
        Company:
        <span>{{ contact.company }}</span>
      </p>
      <p class="contact-label date">
        {{ format(utcToZonedTime(timestamp, timeZone), 'LLL dd @ HH:mm') }}
      </p>
    </div>
    <div :id="`details-${timestamp}`" class="details">
      <div class="content">
        <div v-for="social in socialDetails" :key="social.key">
          <a
            v-if="social.label && social.url"
            class="social"
            :href="social.url"
            target="_blank"
          >
            <SvgImage :svg="social.svg" />
            <span class="highlight">{{ social.label }}</span>
          </a>
          <p v-if="social.label && !social.url" class="social">
            <SvgImage :svg="social.svg" />
            <span class="highlight" @click="copyToClipboard(social.label)">{{
              social.label
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useStore } from '../stores/player'
import { THEME_COLORS } from '../constants'
import { copyTextToClipboard } from '../services/copyToClipboard'
import telegramSvg from '@/assets/telegram.svg?raw'
import twitterSvg from '@/assets/twitter.svg?raw'
import discordSvg from '@/assets/discord.svg?raw'
import gsap from 'gsap'
import { Sine } from 'gsap'

export default {
  props: {
    contact: {
      type: Object,
      required: true,
    },
    color: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const player = useStore()
    const timeZone = 'Europe/Paris'
    const showDetails = ref(false)
    const contactRef = ref('contactRef')
    const socialDetails = reactive([
      {
        label: 'twitter',
        svg: twitterSvg,
        url: 'https://twitter.com/',
      },
      {
        label: 'discord',
        svg: discordSvg,
        url: null,
      },
      {
        label: 'telegram',
        svg: telegramSvg,
        url: null,
      },
    ])
    onBeforeUnmount(() => {
      hideDetails
    })
    const toggleDetails = () => {
      showDetails.value = !showDetails.value
      if (!showDetails.value) {
        gsap.to(`#details-${props.timestamp}`, {
          duration: 0.2,
          height: 0,
          ease: Sine.easeIn,
        })
      } else {
        gsap.to(`#details-${props.timestamp}`, {
          duration: 0.2,
          height: 104,
          ease: Sine.easeIn,
        })
      }
    }
    const hideDetails = () => {
      showDetails.value = false
    }
    return {
      showDetails,
      socialDetails,
      toggleDetails,
      timeZone,
      format,
      utcToZonedTime,
      telegramSvg,
      twitterSvg,
      discordSvg,
      contactRef,
      THEME_COLORS,
      async copyToClipboard(value) {
        await copyTextToClipboard(value)
        player.notify({ message: 'Copied', icon: 'none' })
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.details {
  background: $dark-screen;
  height: 0;
  overflow: hidden;
  margin-bottom: 1px;
  .content {
    padding: 16px;
  }
  .social {
    text-decoration: underline;
    cursor: pointer;
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: 8px;
    align-items: center;
    color: $screen;
    font-weight: bolder;
  }
}
.contact-container {
  cursor: pointer;
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 16px;
  padding: 16px;
  grid-template-rows: repeat(3, max-content);
  border-bottom: 2px solid $dark-screen;
  .contact-label {
    color: $dark-screen;
    font-weight: bold;
  }
  .egg {
    width: 40px;
    grid-row: 1 / span 3;
  }
  .name {
    color: $dark-screen;
    font-family: JoystixMonospace, mono;
  }
  .date {
    width: max-content;
    font-size: 12px;
  }
}
</style>
