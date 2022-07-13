import { onMounted, ref, computed } from 'vue'
import Web3 from 'web3/dist/web3.min.js'

import { useStore } from '@/stores/player'
import jsonInterface from '../WittyCreaturesUI.abi.json'
import { NETWORKS } from '../constants'

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
  let readOnlyWeb3
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
  const errorMintMessage = `There was an error minting your NFT, please try again`

  onMounted(async () => {
    await player.getPlayerInfo()
    if (window.ethereum) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')
      if (player.gameOver && player.nft.length) {
        enableProvider()
      }
    }
  })

  async function enableProvider() {
    player.clearError('network')
    if (web3) {
      player.clearError('network')
      let accounts
      try {
        accounts = await requestAccounts(web3)
      } catch (err) {
        player.setError(
          'network',
          createErrorMessage(errorNetworkMessage.value)
        )
      }
      if (accounts[0]) {
        isProviderConnected.value = true
        if ((await web3.eth.net.getId()) !== Number(network.value?.id)) {
          return player.setError(
            'network',
            createErrorMessage(errorNetworkMessage.value)
          )
        } else {
          player.clearError('network')
        }
      } else {
        player.setError(
          'network',
          createErrorMessage(errorNetworkMessage.value)
        )
      }
    } else {
      player.setError('network', createErrorMessage(errorNetworkMessage.value))
    }
  }

  async function getMintConfirmationStatus() {
    const accounts = await requestAccounts(web3)
    player.clearError('mint')
    if (accounts[0]) {
      isProviderConnected.value = true
      // Connected to selected network
      if ((await web3.eth.net.getId()) === Number(network.value?.id)) {
        if (player.mintInfo?.blockNumber && player.mintInfo?.blockHash) {
          const mintBlockHash = (
            await web3.eth.getBlock(player.mintInfo?.blockNumber)
          ).hash
          if (mintBlockHash === player.mintInfo?.blockHash) {
            const mintConfirmations =
              (await web3.eth.getBlockNumber()) - player.mintInfo?.blockNumber
            if (mintConfirmations < 0) {
              // Chain reorganization. Force getting a new transaction receipt
              player.clearMintBlockInfo()
            } else if (mintConfirmations >= network.value.confirmationCount) {
              // Token minted and confirmed
              player.saveMintInfo({
                ...player.mintInfo,
                mintConfirmation: true,
              })
            }
          } else {
            player.setError(
              'mint',
              createErrorMessage('Chain rollback detected, please try again')
            )
            player.clearMintBlockInfo()
          }
        } else {
          const receipt = await web3.eth.getTransactionReceipt(
            player.mintInfo.txHash
          )
          if (receipt) {
            if (receipt.status) {
              player.saveMintInfo({
                ...player.mintInfo,
                blockNumber: receipt.blockNumber,
                blockHash: receipt.blockHash,
              })
            } else {
              player.setError('mint', createErrorMessage(errorMintMessage))
              player.clearMintInfo()
            }
          } else {
            try {
              const contract = new web3.eth.Contract(
                jsonInterface,
                network.value.contractAddress
              )
              const result = await contract.methods
                .getTokenIntrinsics(player.guildRanking)
                .call()
              if (result.mintBlock.toString() !== '0') {
                const mintBlockHash = await web3.eth.getBlock(result.mintBlock)
                  .hash
                player.saveMintInfo({
                  mintExternalConfirmation: true,
                  blockNumber: result.mintBlock,
                  blockHash: mintBlockHash,
                })
              } else {
                const txCount = await web3.eth.getTransactionCount(
                  player.mintInfo.from
                )
                if (txCount !== player.mintInfo.txCount) {
                  player.setError(
                    'mint',
                    createErrorMessage(
                      'The transaction was cancelled, please try again'
                    )
                  )
                  player.clearMintInfo()
                }
              }
            } catch (err) {
              player.setError(
                'mint',
                createErrorMessage(
                  'Error getting block number from the contract'
                )
              )
            }
          }
        }
      } else {
        player.clearError('network')
      }
    }
  }

  async function addNetwork() {
    player.clearError('addNetwork')
    player.clearError('network')
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

  async function getTokenStatus() {
    try {
      readOnlyWeb3 = new Web3(
        new Web3.providers.HttpProvider(network.value.rpcUrls[0])
      )
      const contract = new readOnlyWeb3.eth.Contract(
        jsonInterface,
        network.value.contractAddress
      )
      const result = await contract.methods
        .getTokenStatus(player.guildRanking)
        .call()
      console.log('Token status is:', result)
      player.tokenStatus = Number(result)
      return result
    } catch (err) {
      console.error(err)
    }
  }

  async function mint() {
    if ((await web3.eth.net.getId()) !== Number(network.value.id)) {
      return player.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      const contract = new web3.eth.Contract(
        jsonInterface,
        network.value.contractAddress
      )
      const from = (await requestAccounts(web3))[0]
      const mintArgs = await player.getContractArgs(from)
      const gasPrice = await web3.eth.getGasPrice()
      const txCount = await web3.eth.getTransactionCount(from)

      const {
        address,
        globalRanking,
        guildId,
        guildPlayers,
        guildRanking,
        index,
        score,
        username,
      } = mintArgs.data
      try {
        contract.methods
          .mint(
            address,
            username,
            globalRanking,
            guildId,
            guildPlayers,
            guildRanking,
            index,
            score,
            `0x${mintArgs.envelopedSignature.signature}`
          )
          .send({ from, gasPrice })
          .on('error', error => {
            console.error(error)
          })
          .on('transactionHash', function (txHash) {
            player.saveMintInfo({ txHash, txCount: txCount, from })
          })
      } catch (error) {
        player.setError('mint', createErrorMessage(errorMintMessage))
      }
    }
  }

  return {
    mint,
    mintedAddress,
    isProviderConnected,
    enableProvider,
    getMintConfirmationStatus,
    getTokenStatus,
    addNetwork,
  }
}
