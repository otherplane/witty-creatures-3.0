<template>
  <div class="bg-beige px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-beige sm:mx-0 sm:h-10 sm:w-10"
      >
        <SvgImage :svg="modalSvg" />
      </div>
      <div class="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-bold text-black" id="modal-title">
          {{ title }}
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            {{ description }}
          </p>
          <p v-if="subtitle" class="import-link text-xs text-red">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="actionAllow"
      v-if="allow"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-primary shadow-sm px-4 py-2 bg-primary text-base font-bold text-pink hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm modal-big-text"
    >
      {{ allowText }}
    </button>
    <button
      v-if="cancel"
      @click="actionCancel"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border-primary shadow-sm px-4 py-2 bg-transparent text-base font-bold text-brown hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm modal-big-text"
    >
      {{ cancelText }}
    </button>
  </div>
</template>

<script>
import modalSvg from '@/assets/egg-icon.svg?raw'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: null,
    },
    allow: {
      type: Boolean,
      default: true,
    },
    allowText: {
      type: String,
      required: true,
    },
    cancel: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      required: true,
    },
  },
  emits: ['allow', 'cancel'],
  setup(props, { emit }) {
    const actionAllow = () => {
      emit('allow')
    }
    const actionCancel = () => {
      emit('cancel')
    }
    return {
      actionAllow,
      actionCancel,
      modalSvg,
    }
  },
}
</script>

<style scoped>
.modal-big-text {
  font-family: JoystixMonospace, mono;
}
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
