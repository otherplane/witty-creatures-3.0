<template>
  <MainLayout>
    <SectionHeader title="INSTRUCTIONS" />
    <GameScreen class="instructions">
      <p class="paragraph">
        To <span class="bold">incubate</span> somebody's egg, you just need to
        <span class="bold">scan their QR code</span>.
      </p>
      <p class="paragraph">
        These are the <span class="bold">rules</span> for incubation:
      </p>
      <ul class="list-container">
        <li class="list">Incubation takes 5 minutes.</li>
        <li class="list">
          You can’t start incubating somebody’s egg while you are incubating
          someone else's — you need to wait until incubation is complete.
        </li>
        <li class="list">
          You can incubate each player’s egg only once every 2 hours.
        </li>
        <li class="list">
          Incubating somebody’s egg gives more points if that is the first time
          interacting with that player.
        </li>
      </ul>
      <p class="paragraph">
        Right after the closing ceremony, your egg will
        <span class="bold">open</span>, an
        <span class="bold">exclusive NFT</span> out of a
        <span class="bold">limited series of 500</span> will be born, and you
        will be able to <span class="bold">mint</span> it on the network
        selected!.
      </p>
      <p class="paragraph">
        The higher your EggScore™ ranks in comparison to other players, the more
        numerous and <span class="bold">rare traits</span> it will get. Inside
        traits with the same level of rarity, those are chosen at random using
        the Witnet oracle’s new
        <span class="bold">Random Number Generator</span> functionality.
      </p>
    </GameScreen>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onMounted } from 'vue'
export default {
  setup() {
    const player = useStore()
    onMounted(() => {
      player.getTheme()
    })
    return { player }
  },
}
</script>

<style lang="scss" scoped>
.list-container {
  padding-left: 16px;
  .list {
    list-style-type: square;
    &::marker {
      color: $dark-screen;
    }
  }
}
.paragraph {
  margin-bottom: 8px;
}
.instructions {
  color: $dark-screen;
  font-family: JoystixMonospace, mono;
}
</style>
