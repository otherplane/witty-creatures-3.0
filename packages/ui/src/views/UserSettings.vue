<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="SETTINGS" />
      <form class="form">
        <CustomInput
          data-lpignore="false"
          type="text"
          label="name"
          :value="player.socials?.name"
          @change="setValue"
        />
        <CustomInput
          data-lpignore="false"
          type="text"
          label="company"
          :value="player.socials?.company"
          @change="setValue"
        />
        <CustomInput
          data-lpignore="false"
          type="text"
          label="twitter"
          :value="player.socials?.twitter"
          @change="setValue"
        />
        <CustomInput
          data-lpignore="false"
          type="text"
          label="discord"
          :value="player.socials?.discord"
          @change="setValue"
        />
        <CustomInput
          data-lpignore="false"
          type="text"
          label="telegram"
          :value="player.socials?.telegram"
          @change="setValue"
        />
        <CustomSwitch
          :checked="player.shareConfig"
          label="share"
          @change="setValue"
        />
        <CustomSelect
          :options="formatedNetworks"
          :defaultOption="{ key: player.mintConfig }"
          label="network"
          @change="setValue"
        />
      </form>
    </div>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { onBeforeMount, computed } from 'vue'
import { NETWORKS } from '@/constants'
export default {
  setup() {
    const player = useStore()
    onBeforeMount(async () => {
      await player.getPlayerInfo()
      await player.getSocials()
    })
    const formatedNetworks = computed(() => {
      return NETWORKS.map(network => {
        return { key: network.key }
      })
    })
    const setValue = async ({ label, value }) => {
      // TODO: refactor
      if (label) {
        const setMintConfig = label === 'network'
        const setShareConfig = label === 'share'
        const socials =
          setMintConfig || setShareConfig
            ? {
                ...player.socials,
              }
            : {
                ...player.socials,
                [label]: value,
              }
        const mintConfig = setMintConfig ? value : player.mintConfig
        const shareConfig = setShareConfig ? value : player.shareConfig
        await player.saveConfig({
          socials,
          shareConfig,
          mintConfig,
        })
      }
    }

    return {
      player,
      setValue,
      formatedNetworks,
    }
  },
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
