<template>
  <MainLayout>
    <StreamBarcodeReader class="qr-code" @decode="onDecode" />
    <ModalDialog :show="modal.visible.value" v-on:close="modal.hideModal">
      <ModalClaimConfirmation v-on:claim="register" />
    </ModalDialog>
  </MainLayout>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/stores/player'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { useRouter } from 'vue-router'
import { useModal } from '../composables/useModal'

export default {
  components: {
    StreamBarcodeReader,
  },
  setup() {
    const modal = useModal()
    const player = useStore()
    const playerKey = ref(null)
    const decodedString = ref('')

    const router = useRouter()
    const previousRoute = ref('')

    function submitAndRedirect() {
      router.push({ name: 'main', params: { id: playerKey.value } })
    }

    function onDecode(value) {
      if (value) {
        decodedString.value = value
        if (!player.getToken()) {
          modal.showModal()
        } else {
          register()
        }
      }
    }

    function register() {
      const chunks = decodedString.value.split('/')
      const key = chunks[chunks.length - 1]
      if (key) {
        // TODO: Add scanned key from QR
        playerKey.value = key
        submitAndRedirect()
      }
    }

    return {
      player,
      playerKey,
      submitAndRedirect,
      onDecode,
      previousRoute,
      register,
      modal,
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.previousRoute = from.path
    })
  },
}
</script>

<style lang="scss" scoped>
.qr-code {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 8;
  div {
    height: 100vh;
    video {
      height: 100vh;
    }
    .overlay-element {
      display: none;
    }
    .overlay-element {
      height: 100vh;
    }
  }
}
.btn {
  position: fixed;
  top: 20vh;
  z-index: 400;
  left: 0;
  color: black;
  background: white;
}
.pl-4 {
  padding-bottom: 0;
  padding-right: 0;
  padding-left: 0;
}
.content {
  color: white;
  width: 100vw;
  top: 10vh;
  left: 0px;
  position: fixed;
  text-align: center;
  z-index: 0;
}
</style>
