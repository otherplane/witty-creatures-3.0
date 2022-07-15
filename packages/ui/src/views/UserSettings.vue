<template>
  <MainLayout>
    <div class="container">
      <SectionHeader
        :title="fromAuth ? 'WELCOME' : 'MY SOCIALS'"
        :from-auth="fromAuth"
      />
      <form class="form">
        <h3 v-if="fromAuth" class="form-title">Choose your network</h3>
        <p v-if="fromAuth" class="form-label">
          Once the game is over, a NFT creature will hatch from your egg. You
          need to choose now which network you will mint your NFT on.
          Additionally, different networks will give you extra prizes on top of
          the NFT. Choose wisely — this choice can't be changed afterwards!
        </p>
        <CustomSelect
          v-if="fromAuth"
          class="field margin"
          :options="formatedNetworks"
          :value="{
            key: NETWORKS[player.mintConfig]?.id,
            name: NETWORKS[player.mintConfig]?.name,
          }"
          label="network"
          @change="setValue"
        />
        <label class="form-label">Your name</label>
        <CustomInput
          class="field"
          type="text"
          label="name"
          :value="player.socials?.name"
          @change="setValue"
        />
        <label class="form-label">Your company name</label>
        <CustomInput
          class="field"
          type="text"
          label="company"
          :value="player.socials?.company"
          @change="setValue"
        />
        <label class="form-label">Your Twitter username</label>
        <CustomInput
          class="field"
          type="text"
          label="twitter"
          :value="player.socials?.twitter"
          @change="setValue"
        />
        <label class="form-label">Your Discord username</label>
        <CustomInput
          class="field"
          type="text"
          label="discord"
          :value="player.socials?.discord"
          @change="setValue"
        />
        <label class="form-label">Your Telegram username</label>
        <CustomInput
          class="field"
          type="text"
          label="telegram"
          :value="player.socials?.telegram"
          @change="setValue"
        />
        <label class="form-label">Share socials by default</label>
        <CustomSwitch
          class="field margin"
          :value="player.shareConfig"
          label="share"
          @change="setValue"
        />
      </form>
      <router-link v-if="fromAuth" to="/">
        <CustomButton type="primary" :slim="true"> CONTINUE </CustomButton>
      </router-link>
    </div>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { onBeforeMount, computed, ref } from 'vue'
import { NETWORKS } from '@/constants'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const player = useStore()
    const router = useRouter()
    const fromAuth = ref(!!router.currentRoute.value.params?.id)
    onBeforeMount(async () => {
      await player.getPlayerInfo()
      await player.getSocials()
    })
    const formatedNetworks = computed(() => {
      return Object.values(NETWORKS)
        .map(network => {
          return {
            key: network.id,
            name: network.name,
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name))
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
      NETWORKS,
      player,
      setValue,
      formatedNetworks,
      fromAuth,
    }
  },
}
</script>
<style lang="scss" scoped>
.form {
  display: grid;
  grid-gap: 16px;
  grid-template-rows: repeat(7, max-content);
  text-align: left;
  .form-title {
    font-weight: bolder;
    font-size: 16px;
    font-family: JoystixMonospace, mono;
  }
  .field {
    margin-bottom: 16px;
  }
  .margin {
    margin-bottom: 16px;
  }
  .form-label {
    font-size: 16px;
    text-align: left;
    font-weight: bold;
  }
  .social-label {
    font-size: 16px;
    font-weight: bold;
    color: var(--primary-color);
  }
}
</style>
