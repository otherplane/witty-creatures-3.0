import { onMounted, ref, computed } from 'vue'
import Web3 from 'web3/dist/web3.min.js'

import { useStore } from '@/stores/player'
import jsonInterface from '../WittyCreaturesUI.json'
import { CONTRACT_ADDRESS, NETWORKS } from '../constants'

async function requestAccounts(web3) {
  return await web3.givenProvider.request({ method: 'eth_requestAccounts' })
}

function createErrorMessage(message) {
  return {
    response: {
      data: {
        message,
      },
    },
  }
}

export function useWeb3() {
  let web3
  const isProviderConnected = ref(false)
  const mintedAddress = ref('')
  const player = useStore()
  const network = computed(() => NETWORKS[player.mintConfig])
  const errorNetworkMessage = computed(
    () =>
      `Your web3 provider should be connected to the ${network.value.name} network`
  )
  const errorSwitchingNetworks = computed(
    () => `There was an error adding ${network.value.name} network`
  )
  const errorDataMessage = `There was an error getting the NFT data`
  const errorMintMessage = `There was an error minting your NFT.`

  onMounted(async () => {
    await player.getPlayerInfo()
    if (window.ethereum) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')
      if (player.gameOver) {
        enableProvider()
      }
    }
  })

  async function enableProvider() {
    const accounts = await requestAccounts(web3)
    if (accounts[0]) {
      isProviderConnected.value = true
      if ((await web3.eth.net.getId()) !== network.value?.id) {
        return player.setError(
          'network',
          createErrorMessage(errorNetworkMessage.value)
        )
      }
    }
  }

  async function addNetwork() {
    await window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(network.value.id) }],
      })
      .catch(async error => {
        if (error.code === 4902) {
          await window.ethereum
            .request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: web3.utils.toHex(network.value.id),
                  chainName: network.value.name,
                  rpcUrls: network.value.rpcUrls,
                  blockExplorerUrls: network.value.blockExplorerUrls,
                },
              ],
            })
            .catch(error => {
              console.log(error)
              player.setError(
                'addNetwork',
                createErrorMessage(errorSwitchingNetworks)
              )
            })
        }
      })
  }

  async function getTokenId() {
    if ((await web3.eth.net.getId()) !== network.value.id) {
      return player.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      try {
        const contract = new web3.eth.Contract(jsonInterface, CONTRACT_ADDRESS)
        const result = await contract.methods
          .getPlayerTokens(player.playerId)
          .call()
        player.setTokenId(result)
        return result
      } catch (err) {
        console.error(err)
        player.setError('contractData', createErrorMessage(errorDataMessage))
      }
    }
  }

  async function mint() {
    if ((await web3.eth.net.getId()) !== network.value.id) {
      return player.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      const contract = new web3.eth.Contract(
        jsonInterface,
        network.value.contractAddress
      )
      const from = (await requestAccounts(web3))[0]
      const mintArgs = await player.getContractArgs(from)
      const farmerAwards = mintArgs.data.farmerAwards.map(medal =>
        Object.values(medal)
      )

      contract.methods
        .mintFarmerAwards(
          mintArgs.data.address,
          mintArgs.data.ranchId,
          mintArgs.data.farmerId,
          mintArgs.data.farmerScore,
          mintArgs.data.farmerName,
          farmerAwards,
          `0x${mintArgs.envelopedSignature.signature}`
        )
        .send({ from })
        .on('error', error => {
          player.setError('mint', createErrorMessage(errorMintMessage))
          console.error(error)
        })
        .on('transactionHash', function (transactionHash) {
          player.saveMintInfo({ transactionHash })
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          player.saveMintInfo(receipt)
          player.getNFTImage()
        })
        .then(newContractInstance => {
          console.log('newContractInstance', newContractInstance)
          console.log('Witmon minted: ', newContractInstance.transactionHash)
        })
    }
  }

  return {
    mint,
    mintedAddress,
    isProviderConnected,
    enableProvider,
    addNetwork,
    getTokenId,
  }
}
