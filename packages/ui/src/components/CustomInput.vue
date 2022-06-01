<template>
  <input class="input" v-model="value" :placeholder="`type your ${label} account`">
</template>

<script>
import { ref, watch } from 'vue'
export default {
  props: {
    label: {
      type: String,
      required: true,
    }
  },
  setup (props, { emit }) {
    const value = ref('')
    watch(value, () => {
      emit('value', { label: props.label, value: value.value })
    })
    return { value }
  }
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
