<template>
  <MainLayout :threeCol="true">
    <SvgImage :svg="mainLogo" class="logo" />
    <GameScreen class="screen-container">
      <EggSvg
        v-for="(egg, index) in eggList"
        :key="index"
        class="egg"
        :eggIndex="index"
        :color="egg.color"
        :speed="egg.speed"
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
      {
        color: 'yellow',
        speed: 0.7,
      },
      {
        color: 'red',
        speed: 0.9,
      },
      {
        color: 'blue',
        speed: 1,
      },
      {
        color: 'green',
        speed: 2,
      },
      {
        color: 'black',
        speed: 0.6,
      },
      {
        color: 'yellow',
        speed: 1.2,
      },
      {
        color: 'red',
        speed: 0.8,
      },
      {
        color: 'blue',
        speed: 0.7,
      },
      {
        color: 'green',
        speed: 1.3,
      },
      {
        color: 'blue',
        speed: 0.9,
      },
      {
        color: 'black',
        speed: 1.5,
      },
      {
        color: 'yellow',
        speed: 2,
      },
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
@media (max-height: 1060px) {
  .background {
    height: 100vh;
  }
  .screen-container {
    .egg {
      height: 100px;
      width: auto;
    }
  }
}
</style>
