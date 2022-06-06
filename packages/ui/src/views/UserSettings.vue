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
          :checked="player.socials?.share"
          label="share"
          @change="setValue"
        />
        <CustomSelect
          :options="networks"
          :defaultOption="defaultSelectOption"
        />
      </form>
    </div>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { ref, onBeforeMount } from 'vue'
export default {
  setup() {
    const player = useStore()
    onBeforeMount(async () => {
      await player.getPlayerInfo()
    })
    const defaultSelectOption = ref({
      key: 'ethereum',
    })
    const networks = [
      {
        key: 'ethereum',
      },
      {
        key: 'boba',
      },
      {
        key: 'moonbeam',
      },
    ]
    const setValue = async value => {
      await player.saveSocials({
        ...player.socials,
        [value.label]: value.value,
      })
    }

    return {
      player,
      networks,
      setValue,
      defaultSelectOption,
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
