<template>
  <MainLayout>
    <div class="disclaimer">
      <p class="title">INTERACT</p>
      <CustomButton type="dark" @click="interact">
        INTERACT
      </CustomButton>
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { useRouter } from 'vue-router'
export default {
  setup () {
    const player = useStore()
    const router = useRouter()

    const interact = () => {
      player.interact({ key: router.currentRoute.value.params.id })
    }

    return { player, interact }
  }
}
</script>

<style lang="scss" scoped>
.disclaimer {
  text-align: center;
  display: grid;
  row-gap: 24px;
  .btn {
    width: max-content;
    justify-self: center;
  }
}
</style>
