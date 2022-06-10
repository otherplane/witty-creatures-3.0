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
.padding {
  padding: 8px;
}
</style>
