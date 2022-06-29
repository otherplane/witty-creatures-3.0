<template>
  <button class="btn" :class="[type]">
    <slot class="btn-content"> </slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator(value) {
      return ['primary', 'disable'].includes(value)
    },
  },
})
</script>

<style scoped lang="scss">
.btn {
  width: 100%;
  color: $white;
  padding: 16px 16px;
  border-radius: 4px;
  font-family: JoystixMonospace, sans-serif;
  font-weight: bold;
  &.primary {
    color: $white;
    -webkit-transition: all 3ms linear;
    -ms-transition: all 3ms linear;
    transition: all 3ms linear;
    background-color: var(--primary-color);
    border: 2px solid var(--primary-color);
  }
  &.disable {
    color: var(--primary-color-opacity-2);
    -webkit-transition: all 3ms linear;
    -ms-transition: all 3ms linear;
    transition: all 3ms linear;
    background-color: $white;
    border: 2px solid var(--primary-color-opacity-2);
    cursor: no-drop;
    opacity: 0.7;
  }
}
</style>
