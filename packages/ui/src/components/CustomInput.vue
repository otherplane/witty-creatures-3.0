<template>
  <input
    class="input"
    v-model.lazy="localValue"
    :placeholder="`Type your ${label}`"
    :data-lpignore="true"
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
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--primary-color-opacity-1);
  &::placeholder {
    font-size: 18px;
    font-family: 'Source Code Pro', monospace;
    color: var(--primary-color-opacity-1);
  }
  &:focus {
    outline: none;
    border-bottom: 2px solid var(--primary-color);
  }
}
</style>
