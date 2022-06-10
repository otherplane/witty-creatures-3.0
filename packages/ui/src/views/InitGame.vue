<template>
  <MainLayout :isBackground="true">
    <SvgImage :svg="mainLogo" class="logo" />
    <GameScreen class="screen-container">
      <EggSvg
        v-for="(egg, index) in eggList"
        :key="index"
        class="egg"
        :color="egg"
      />
    </GameScreen>
    <router-link to="/disclaimer" class="link">
      <CustomButton class="btn" type="primary"> PLAY NOW </CustomButton>
    </router-link>
  </MainLayout>
</template>

<script>
import mainLogo from '@/assets/witty-creatures-logo.svg?raw'
import { ref } from 'vue'
export default {
  setup() {
    const eggList = ref([
      'yellow',
      'red',
      'blue',
      'green',
      'black',
      'yellow',
      'red',
      'blue',
      'green',
      'blue',
      'black',
      'yellow',
    ])
    return { mainLogo, eggList }
  },
}
</script>

<style lang="scss" scoped>
.logo {
  margin-top: 16px;
}
.screen-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
}
.link {
  width: 100%;
  justify-self: center;
}
</style>
