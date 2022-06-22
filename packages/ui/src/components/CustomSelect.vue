<template>
  <VSelect
    v-model="localValue"
    dir="rtl"
    :clearable="false"
    :filterable="false"
    :options="options"
    :searchable="false"
    class="selector"
    placeholder="Choose an option"
  >
    <template #selected-option-container="{ option }">
      <span class="vs__selected">{{ option.key }}</span>
    </template>

    <template #option="option">
      <span>{{ option.key }}</span>
    </template>
  </VSelect>
</template>

<script>
import { useLocalValue } from '@/composables/localValueGetSet'
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { localValue } = useLocalValue()
    console.log(localValue)
    return { localValue }
  },
}
</script>

<style lang="scss">
@import url('vue-select/dist/vue-select.css');

.selector {
  .vs__dropdown-toggle,
  .vs__dropdown-menu {
    width: max-content;
    padding: 0;
    background: var(--primary-color);
    border: var(--primary-color);
    border-radius: 4px;
    box-shadow: none;
    color: white;
    min-width: 100%;
    font-weight: 600;
  }
  .vs__open-indicator {
    font-size: 13px;
    color: white;
  }
  .vs__dropdown-menu {
    background: var(--secondary-color);
    right: 0;
    top: 50px;
    border: var(--primary-color);
    box-shadow: var(--selected-options-shadow);
    border-radius: 4px 4px 4px 4px;
    max-height: max-content;
  }

  .vs__dropdown-option {
    font-family: Almarai, sans-serif;
    padding: 12px;
    font-weight: 600;
    color: white;
  }

  .vs__dropdown-option--highlight {
    background: var(--primary-color);
  }

  .vs--single.vs--open.vs__dropdown-toggle {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom-color: black;
  }

  .vs__clear,
  .vs__open-indicator {
    color: white;
  }

  .image {
    height: 25px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .vs__selected {
    height: 40px;
    color: white;
    font-family: Almarai, sans-serif;
    font-weight: 600;
    margin: 0;
    padding: 0 8px 0 0;
  }
  &:hover {
    .vs__selected {
      color: white;
    }
    .vs__open-indicator {
      color: white;
    }
  }
  .vs__actions {
    padding: 8px;
  }
  // remove extra space
  .vs__search {
    padding: 0 !important;
  }
}
// avoid decrease size on open
.vs--single.vs--open .vs__selected {
  opacity: 1 !important;
  position: inherit !important;
}
</style>
