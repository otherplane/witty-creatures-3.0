<template>
  <div class="flex items-center justify-left w-full">
    <label for="toggleB" class="flex items-center cursor-pointer">
      <div class="relative">
        <input
          v-model="localValue"
          type="checkbox"
          id="toggleB"
          class="sr-only"
        />
        <div class="block border-primary bg-white w-14 h-8 rounded-full"></div>
        <div
          class="dot border-primary absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
        ></div>
      </div>
      <div class="ml-3 text-gray-700 font-medium">{{ label }}</div>
    </label>
  </div>
</template>

<script>
import { useLocalValue } from '@/composables/localValueGetSet'
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { localValue } = useLocalValue()
    return { localValue }
  },
}
</script>

<style lang="scss" scoped>
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: var(--primary-color) !important;
}
</style>
