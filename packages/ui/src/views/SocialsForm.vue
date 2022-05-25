<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="SOCIALS" />
      <div v-if="player?.socials && !editSocials" class="form">
        <QrcodeVue class="qr-code" :value="qrUrl" :size="250" level="H"></QrcodeVue>
        <p><span class="social-label">Twitter:</span> {{ player.socials.twitter }}</p>
        <p><span class="social-label">Discord:</span> {{ player.socials.discord }}</p>
        <p><span class="social-label">Telegram:</span> {{ player.socials.telegram }}</p>
        <CustomButton type="primary" @click="edit()">
          Edit socials
        </CustomButton>
        <CustomButton type="primary" @click="deleteSocials">
          Delete socials
        </CustomButton>
      </div>
      <form v-else class="form">
        <CustomInput data-lpignore="false" type="text" label="twitter" @value="setValue" />
        <CustomInput data-lpignore="false" type="text" label="discord" @value="setValue" />
        <CustomInput data-lpignore="false" type="text" label="telegram" @value="setValue" />
        <CustomButton type="primary" @click="saveSocials">
          Save
        </CustomButton>
      </form>
      <ContactList />
    </div>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { BASE_URL } from '@/constants.js'
import { ref, computed, onBeforeMount } from 'vue'
import QrcodeVue from 'qrcode.vue'
export default {
  components: {
    QrcodeVue,
  },
  setup () {
    const player = useStore()
    let editSocials = ref(false)
    let socials = ref({
      twitter: null,
      discord: null,
      telegram: null
    })
    onBeforeMount(() => {
      player.getSocials()
      player.getPlayerInfo()
    })
    const setValue = (value) => {
      socials.value[value.label] = value.value
    }
    const saveSocials = async () => {
      await player.saveSocials(socials.value)
      editSocials.value = false
    }
    const qrUrl = computed(() => {
      return `${BASE_URL}/username=${player?.username}&twitter=${player?.socials.twitter}&discord=${player?.socials.twitter}&telegram=${player?.socials.telegram}&`
    })
    const edit = () => {
      editSocials.value = true
    }
    const deleteSocials = async () => { 
      await player.deleteSocials()
    }
    return {
      player,
      setValue,
      socials,
      saveSocials,
      edit,
      editSocials,
      deleteSocials,
      qrUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  margin-top: 24px;
  display: grid;
  grid-gap: 16px;
  .qr-code {
    justify-self: center;
  }
  .social-label {
    font-size: 18px;
    font-weight: bold;
    color: var(--primary-color);
  }
}
</style>