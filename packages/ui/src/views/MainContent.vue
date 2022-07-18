<template>
  <MainLayout v-if="player.username" :threeCol="true">
    <NavBar class="navbar" @openExportModal="openModal('export')" />
    <MainScreen />
    <div class="sticky-btn" v-if="!player.gameOver">
      <router-link class="btn" :to="type === 'disable' ? '' : '/scan'">
        <CustomButton :type="type" :slim="true"> INCUBATE </CustomButton>
      </router-link>
    </div>
    <div class="sticky-btn" v-if="player.gameOver">
      <CustomButton
        v-if="player.gameOver"
        @click="mint"
        :type="type"
        :slim="true"
      >
        CLAIM NFT
      </CustomButton>
      <a
        v-if="player.gameOver && player.errors.network"
        @click="addNetwork()"
        class="add-network"
      >
        <SvgImage class="metamask" :svg="metamask" />
        Switch to {{ NETWORKS[player.mintConfig].name }} Network
      </a>
    </div>
  </MainLayout>

  <ModalDialog :show="modal.visible.value" @close="closeModal">
    <ModalExport v-if="modals.export" />
    <ModalShareSocials v-if="modals.shareSocials" />
    <ModalGameOver v-if="modals.gameOver" />
    <ModalMint v-if="modals.mint" />
  </ModalDialog>
</template>

<script>
import { useStore } from '@/stores/player'
import {
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  reactive,
  watch,
} from 'vue'
import egg from '@/assets/egg.svg?raw'
import metamask from '@/assets/metamask.svg?raw'
import { useModal } from '@/composables/useModal'
import { useWeb3 } from '../composables/useWeb3'
import {
  EXPLORER_BASE_URL,
  OPENSEA_BASE_URL,
  NETWORKS,
  TOKEN_STATUS,
} from '../constants'
import { checkEmptySocials } from '@/utils.js'
import { POLLER_MILLISECONDS } from '@/constants.js'
import { importSvg } from '@/composables/importSvg.js'
import { useRouter } from 'vue-router'
export default {
  setup() {
    let playerInfoPoller = null
    const modal = useModal()
    const player = useStore()
    const router = useRouter()
    const web3WittyCreatures = useWeb3()
    const interactionIn = computed(() => player?.interactionIn)
    const interactionOut = computed(() => player?.interactionOut)
    const modals = reactive({
      shareConfig: false,
      mint: false,
      export: false,
      preview: false,
      gameOver: false,
    })
    // Handle end of game
    onBeforeMount(async () => {
      const token = await player.getToken()
      if (!token) {
        await player.authorize({ key: router.currentRoute.value.params.id })
        openModal('export')
      } else {
        await player.getPlayerInfo()
        if (player.id && router.currentRoute.value.params.id) {
          await player.interact({ key: router.currentRoute.value.params.id })
        }
      }
    })
    onMounted(async () => {
      await player.getSocials()
      playerInfoPoller = setInterval(async () => {
        await player.getPlayerInfo()
      }, POLLER_MILLISECONDS)
    })
    onBeforeUnmount(() => {
      clearInterval(playerInfoPoller)
    })
    const type = computed(() => {
      // TODO: update player.incubating naming when contracts are available
      if (
        (player.gameOver && player.tokenStatus === TOKEN_STATUS.minted) ||
        (player.gameOver && player.mintInfo) ||
        (player.gameOver && !player.nft.length) ||
        (player.gameOver && player.errors.network)
      ) {
        return 'disable'
      } else {
        return 'primary'
      }
    })
    async function openModal(name) {
      const needProvider = name === 'mint'
      if (needProvider) {
        await web3WittyCreatures.enableProvider()
      }
      if (
        !(await web3WittyCreatures.isProviderConnected.value) &&
        needProvider
      ) {
        modals['gameOver'] = true
      } else {
        modals[name] = true
      }
      modal.showModal()
    }
    function closeModal() {
      modals.shareSocials = false
      modals.mint = false
      modals.export = false
      modals.preview = false
      modals.gameOver = false
      modal.hideModal()
    }
    function mint() {
      if (type.value !== 'disable') {
        openModal('mint')
      }
    }
    function checkSocialsOpenModal() {
      if (
        player.interactionOut?.to !== player.username &&
        checkEmptySocials(player.socials) &&
        !player.shareConfig &&
        (interactionIn.value || interactionOut.value) &&
        !player.socialsSharedMessage
      ) {
        openModal('shareSocials')
        player.socialsSharedMessage = true
      } else {
        closeModal('shareSocials')
      }
    }
    watch(interactionIn, () => {
      checkSocialsOpenModal()
    })
    watch(interactionOut, () => {
      checkSocialsOpenModal()
    })
    return {
      etherscanBaseUrl: EXPLORER_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      NETWORKS,
      mint,
      player,
      type,
      closeModal,
      openModal,
      modal,
      modals,
      enableProvider: web3WittyCreatures.enableProvider,
      addNetwork: web3WittyCreatures.addNetwork,
      isProviderConnected: web3WittyCreatures.isProviderConnected,
      importSvg,
      egg,
      metamask,
    }
  },
}
</script>

<style lang="scss" scoped>
.main-content {
  display: grid;
  grid-gap: 16px;
}
.sticky-btn {
  bottom: 16px;
  text-align: center;
  display: grid;
  grid-template-rows: max-content max-content;
  grid-gap: 8px;
  justify-items: center;
  .btn {
    width: 100%;
  }
  .add-network {
    font-size: 14px;
    width: 100%;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    color: var(--primary-color);
    display: flex;
    text-align: left;
    .metamask {
      margin-right: 8px;
      width: 16px;
    }
  }
}
</style>
