<template>
  <input
    class="input"
    v-model.lazy="localValue"
    :placeholder="`type your ${label}`"
  />
</template>

<script>
import { useLocalValue } from '@/composables/localValueGetSet.js'
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { localValue } = useLocalValue()
    return { localValue }
  },
}
</script>

<style lang="scss" scoped>
.input {
  display: block;
  width: 100%;
  padding: 8px;
  color: var(--primary-color);
  font-size: 18px;
  border-bottom: 1px solid var(--primary-color-opacity-1);
  &::placeholder {
    font-size: 18px;
  }
  &:focus {
    outline: none;
    border-bottom: 2px solid var(--primary-color);
  }
}
</style>
