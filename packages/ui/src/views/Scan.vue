<template>
  <Layout>
    <p class="small-title import-label">Scan a QR code</p>
    <QrStream class="qr-code pl-4 pr-4 pb-4" @decode="onDecode"></QrStream>
    <Button class="btn" color="black" @click="onDecode('/ef12efbd765f9ad3')">
      Import player id
    </Button>
    <ModalDialog :show="modal.visible.value" v-on:close="modal.hideModal">
      <ModalClaimConfirmation v-on:claim="register" />
    </ModalDialog>
  </Layout>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/stores/player'
import { QrStream } from 'vue3-qr-reader'
import { useRouter } from 'vue-router'
import { useModal } from '../composables/useModal'

export default {
  components: {
    QrStream
  },
  setup (props, ctx) {
    const modal = useModal()
    const player = useStore()
    const playerKey = ref(null)
    const decodedString = ref('')

    const router = useRouter()
    const previousRoute = ref('')

    function submitAndRedirect () {
      router.push({ name: 'main', params: { id: playerKey.value } })
    }

    function onDecode (value) {
      if (value) {
        decodedString.value = value
        if (!player.getToken()) {
          modal.showModal()
        } else {
          register()
        }
      }
    }

    function register () {
      const chunks = decodedString.value.split('/')
      const key = chunks[chunks.length - 1]
      if (key) {
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
      modal
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.previousRoute = from.path
    })
  }
}
</script>
