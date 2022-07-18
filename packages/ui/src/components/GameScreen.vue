<template>
  <div class="main-screen" :class="{ padding }">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    padding: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.main-screen {
  background: $screen;
  border-radius: 4px;
}
@media (max-width: 280px) {
  .main-screen {
    max-width: 250px;
  }
}
.padding {
  padding: 8px;
}
</style>
