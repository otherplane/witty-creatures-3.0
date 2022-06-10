<template>
  <router-view />
  <GameNotification />
</template>

<style lang="scss">
#app {
  font-family: 'Source Code Pro', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100vh;
}
</style>
