<template>
  <div class="bg-beige px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-beige sm:mx-0 sm:h-10 sm:w-10"
      >
        <SvgImage :svg="modalSvg" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-bold text-black" id="modal-title">
          Do you want to share your social information?
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">Share your social information</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="share"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Share
    </button>
    <button
      @click="$parent.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Cancel
    </button>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import modalSvg from '@/assets/egg.svg?raw'

export default {
  emits: ['close'],
  setup(props, { emit }) {
    const player = useStore()
    const share = async () => {
      await player.shareSocials()
      emit('close', 'shareSocials')
    }

    return {
      player,
      share,
      modalSvg,
    }
  },
}
</script>

<style scoped>
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
