<template>
  <div ref="contactRef">
    <div @click="toggleDetails" class="contact-container">
      <EggSvg class="egg" :color="THEME_COLORS[contact?.color]" :speed="1" />
      <p v-if="contact.name" class="contact-info name">
        Name: {{ contact.name }}
      </p>
      <p v-if="contact.company" class="contact-info contact-label">
        Company: {{ contact.company }}
      </p>
      <p class="contact-info contact-label date">
        {{
          format(utcToZonedTime(contact.timestamp, timeZone), 'LLL dd @ HH:mm')
        }}
      </p>
    </div>
    <div
      :id="`details-${contact?.timestamp}`"
      class="details"
      v-if="!isEmptySocials"
    >
      <div class="content">
        <div v-for="social in socialDetails" :key="social.key">
          <a
            v-if="social.label && social.url"
            class="social"
            :href="social.url"
            target="_blank"
          >
            <SvgImage :svg="social.svg" />
            <p class="contact-info highlight">{{ social.label }}</p>
          </a>
          <p v-if="social.label && !social.url" class="social">
            <SvgImage :svg="social.svg" />
            <span
              class="contact-info highlight"
              @click="copyToClipboard(social.label)"
              >{{ social.label }}</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ref, reactive, onBeforeUnmount, computed } from 'vue'
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
  },
  setup(props) {
    const player = useStore()
    const timeZone = 'Europe/Paris'
    const showDetails = ref(false)
    const contactRef = ref('contactRef')
    const socialDetails = reactive([
      {
        label: props.contact.twitter,
        svg: twitterSvg,
        url: 'https://twitter.com/',
      },
      {
        label: props.contact.discord,
        svg: discordSvg,
        url: null,
      },
      {
        label: props.contact.telegram,
        svg: telegramSvg,
        url: null,
      },
    ])
    const isEmptySocials = computed(() =>
      socialDetails.every(social => !social.label)
    )
    onBeforeUnmount(() => {
      hideDetails
    })
    const toggleDetails = () => {
      showDetails.value = !showDetails.value
      if (!showDetails.value) {
        gsap.to(`#details-${props.contact.timestamp}`, {
          duration: 0.2,
          height: 0,
          ease: Sine.easeIn,
        })
      } else {
        gsap.to(`#details-${props.contact.timestamp}`, {
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
      isEmptySocials,
      async copyToClipboard(value) {
        await copyTextToClipboard(value)
        player.notify({ message: 'Copied', icon: 'none' })
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.contact-info {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}
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
  grid-template-columns: max-content max-content;
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
