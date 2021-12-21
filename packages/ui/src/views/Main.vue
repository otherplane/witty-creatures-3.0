<template>
  <Layout v-if="player.username">
    <div class="content">
      <div>
        <p class="subtitle">PLAYER ID: {{ player.username }}</p>
        <p class="title">My Witty Creature</p>
      </div>
      <WittyCreature
        v-if="player.creaturePreview"
        :creature-preview="player.creaturePreview"
      />
      <div
        class="mint-status"
        v-if="player.mintInfo && player.mintInfo.transactionHash"
      >
        <p class="label">TRANSACTION HASH</p>
        <div class="address">
          <a
            :href="`${etherscanBaseUrl}/${player.mintInfo.transactionHash}`"
            target="_blank"
            >{{ player.mintInfo.transactionHash }}
          </a>
          <img class="external-link-icon" src="@/assets/external.svg" alt="" />
        </div>
      </div>
      <div
        class="mint-status"
        v-if="
          player.creatureData &&
            player.creatureData.tokenId &&
            parseInt(player.creatureData.tokenId) !== 0
        "
      >
        <div class="opensea">
          <a
            :href="`${openseaBaseUrl}/${player.creatureData.tokenId}`"
            target="_blank"
            >See on OpenSea
          </a>
          <img
            class="external-link-icon"
            src="@/assets/external-black.svg"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="buttons">
      <Button
        v-if="player.hasBorn && !player.creaturePreview"
        @click="openModal('preview')"
        color="black"
        class="center-item"
      >
        Open my player
      </Button>
      <Button
        v-else-if="player.hasBorn && player.creaturePreview"
        @click="mint"
        :type="type"
        color="black"
        class="center-item"
      >
        Mint NFT
      </Button>

      <Button @click="openModal('export')" color="grey" class="center-item">
        Eggxport &trade;
      </Button>
      <p class="footer">
        powered by
        <a class="link" href="https://witnet.io" target="_blank">Witnet</a>
      </p>
    </div>
  </Layout>

  <ModalDialog :show="modal.visible.value" v-on:close="closeModal">
    <ModalExport v-if="modals.export" />
    <GameOverModal v-if="modals.gameOver" />
    <ModalMint v-if="modals.mint" />
    <ModalPreview v-if="modals.preview" />
  </ModalDialog>
</template>

<script>
import { useStore } from '@/stores/player'
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'
import imageUrl from '@/assets/egg-example.png'
import { useModal } from '@/composables/useModal'
import { useWeb3Witmon } from '../composables/useWeb3Witmon'
import { ETHERSCAN_BASE_URL, OPENSEA_BASE_URL } from '../constants'

export default {
  setup () {
    const modal = useModal()
    const player = useStore()
    const web3Witmon = useWeb3Witmon()
    const modals = reactive({
      mint: false,
      export: false,
      preview: false,
      gameOver: false
    })
    const hasBorn = player.hasBorn
    let timeout

    onBeforeMount(async () => {
      await player.getInfo()
      await player.getMintInfo()
      await player.getPreview()
      if (player.hasBorn) {
        const data = await web3Witmon.getCreatureData()
        player.setCreatureData(data)
      }

      if (!player.hasBorn) {
        timeout = setTimeout(() => {
          player.timeToBirth -= 1
        }, player.timeToBirth - Date.now())
      }
    })

    onBeforeUnmount(() => {
      clearTimeout(timeout)
    })

    const type = computed(() =>
      player.incubating ||
      (player.creatureData && parseInt(player.creatureData.tokenId) !== 0)
        ? 'disable'
        : 'default'
    )
    const mintStatus = computed(() =>
      player.mintInfo.blockHash ? 'minted' : 'pending'
    )

    function openModal (name) {
      const needProvider = name === 'mint' || name === 'preview'
      if (!web3Witmon.isProviderConnected.value && needProvider) {
        modals['gameOver'] = true
      } else {
        modals[name] = true
      }
      modal.showModal()
    }

    function closeModal () {
      modals.mint = false
      modals.export = false
      modals.preview = false
      modals.gameOver = false
      modal.hideModal()
    }

    function mint () {
      if (type.value !== 'disable') {
        openModal('mint')
      }
    }

    return {
      etherscanBaseUrl: ETHERSCAN_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      mint,
      hasBorn,
      player,
      type,
      closeModal,
      openModal,
      imageUrl,
      modal,
      modals,
      mintStatus,
      enableProvider: web3Witmon.enableProvider,
      preview: web3Witmon.preview,
      isProviderConnected: web3Witmon.isProviderConnected,
      getCreatureData: web3Witmon.getCreatureData
    }
  }
}
</script>
