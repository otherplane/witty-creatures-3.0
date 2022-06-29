import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import { TIME_TO_MINT_MILLISECONDS, GAME_ENDS_TIMESTAMP } from '../constants'
import { isMainnetTime } from '@/utils'
export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      id: null,
      theme: null,
      username: '',
      network: null,
      interactionInfo: null,
      socialsSharedMessage: false,
      interactionIn: null,
      interactionOut: null,
      tokenStatus: null,
      mintConfirmation: false,
      mintExternalConfirmation: false,
      //TODO: make gameOverTimeMilli take GAME_ENDS_TIMESTAMP value when gameOver is defined
      gameOverTimeMilli: GAME_ENDS_TIMESTAMP,
      gameOver: false,
      timeToMintInMilli: GAME_ENDS_TIMESTAMP + TIME_TO_MINT_MILLISECONDS,
      nft: [],
      history: [],
      mintInfo: null,
      mintParams: null,
      color: null,
      tokenIds: null,
      score: null,
      socials: null,
      contacts: [],
      mintConfig: null,
      globalRanking: null,
      guildRanking: null,
      shareConfig: null,
      playersNetworkStats: [],
      playersGlobalStats: [],
      errors: {
        showNFT: null,
        mint: null,
        preview: null,
        auth: null,
        interaction: null,
        info: null,
        config: null,
        history: null,
        getLeaderboardInfo: null,
        network: null,
        getContractArgs: null,
      },
    }
  },
  getters: {
    mintingAllow() {
      //FIXME: make it reactive
      return this.timeToMintInMilli < Date.now()
    },
    minted() {
      if (this.mintInfo && this.mintInfo.events && this.mintInfo.events[1]) {
        return true
      } else {
        return false
      }
    },
    isMainnetTime() {
      return isMainnetTime()
    },
  },
  actions: {
    notify(payload) {
      this.app.config.globalProperties.$notify(payload)
    },
    saveClaimInfo(info) {
      localStorage.setItem(
        'tokenInfo',
        JSON.stringify({ ...this.getToken(), ...info })
      )
    },
    // Color theme
    getTheme() {
      const theme = localStorage.getItem('theme')
      if (theme) {
        this.theme = theme
      }
    },
    saveTheme(theme) {
      localStorage.setItem('theme', theme)
      this.theme = theme
    },
    // Socials
    async shareSocials() {
      const tokenInfo = this.getToken()
      const request = await this.api.shareSocials({
        token: tokenInfo.token,
        to: this.interactionIn?.from || this.interactionOut?.to,
      })
      if (request.error) {
        this.setError('shareSocials', request.error)
        router.push('/init-game')
      } else {
        this.clearError('shareSocials')
        this.getPlayerInfo()
      }
    },
    async getSocials() {
      const tokenInfo = this.getToken()
      const request = await this.api.getSocials({
        token: tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
      })
      if (request?.error) {
        this.setError('getSocials', request.error)
        router.push('/init-game')
      } else {
        this.socials = request
        this.clearError('getSocials')
        this.getPlayerInfo()
      }
    },
    async saveConfig({ socials, shareConfig, mintConfig }) {
      this.socials = socials
      const tokenInfo = this.getToken()
      const request = await this.api.saveConfig({
        token: tokenInfo.token,
        socials: {
          ownerKey: tokenInfo.key,
          ...socials,
        },
        shareConfig,
        mintConfig,
      })
      if (request.error) {
        this.setError('config', request.error)
        router.push('/init-game')
      } else {
        this.clearError('config')
        this.getPlayerInfo()
      }
    },
    setTokenId(tokenIds) {
      this.tokenIds = tokenIds
    },
    // Socials
    async getContacts(offset = 0, limit = 25) {
      await this.getTheme()
      const tokenInfo = this.getToken()
      const request = await this.api.getContacts({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
        offset,
        limit,
      })
      if (request.error) {
        router.push('/init-game')
        this.setError('history', request.error)
      } else {
        this.clearError('history')
        return {
          result: request.contacts?.contacts,
          total: request.contacts?.total,
        }
      }
    },
    // Mint info
    getMintInfo() {
      const mintInfo = JSON.parse(localStorage.getItem('mintInfo'))
      if (mintInfo) {
        this.mintInfo = mintInfo
      }
    },
    saveMintInfo(info) {
      localStorage.setItem('mintInfo', JSON.stringify({ ...info }))
      this.mintInfo = info
    },
    clearMintInfo() {
      localStorage.removeItem('mintInfo')
      this.mintInfo = null
    },
    clearMintBlockInfo() {
      this.mintInfo = {
        ...this.mintInfo,
        blockNumber: 0,
        blockHash: 0,
      }
      localStorage.setItem('mintInfo', JSON.stringify(this.mintInfo))
    },
    // Token Info
    getToken() {
      return JSON.parse(localStorage.getItem('tokenInfo'))
    },
    clearTokenInfo() {
      localStorage.removeItem('tokenInfo')
      localStorage.removeItem('theme')
    },
    // Errors
    clearError(error) {
      this.errors[error] = null
    },
    setError(name, error) {
      this.errors[name] = error.response?.data?.message || error.toString()
      this.notify({ message: this.errors[name] })
    },

    async authorize({ key }) {
      const request = await this.api.authorize({ key })
      if (request.error) {
        router.push('/init-game')
        this.setError('auth', request.error)
      } else if (request.token) {
        await this.saveClaimInfo(request)
        this.clearError('auth')
        await this.getPlayerInfo()
        await this.getGlobalStats()
        router.push(`/settings/${key}`)
      }
    },
    // Interaction
    clearInteraction() {
      this.interaction = null
    },
    async interact({ key }) {
      const tokenInfo = this.getToken()
      const request = await this.api.interact({
        token: tokenInfo.token,
        to: key,
      })
      if (request.error) {
        this.setError('interaction', request.error)
        router.push('/init-game')
      } else {
        this.clearError('interaction')
        this.interactionInfo = request
        router.push('/init-game')
        this.getPlayerInfo()
      }
    },
    // History
    async getInteractionHistory(offset = 0, limit = 25) {
      const tokenInfo = this.getToken()
      const request = await this.api.getInteractionHistory({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
        offset,
        limit,
      })
      if (request.error) {
        router.push('/init-game')
        this.setError('history', request.error)
      } else {
        this.clearError('history')
        // this.history = request.interactions
        return {
          result: request.interactions?.interactions,
          total: request.interactions?.total,
        }
      }
    },
    // Leaderboard
    async getGlobalStats(offset = 0, limit = 25) {
      await this.getTheme()
      await this.getPlayerInfo()
      const request = await this.api.getLeaderboardInfo({
        filter: this.mintConfig,
        offset,
        limit,
      })
      if (request.error) {
        this.setError('getLeaderboardInfo', request.error)
      } else {
        this.clearError('getLeaderboardInfo')
        return {
          global: {
            result: request.global.players,
            total: request.global.total,
          },
          network: {
            result: request.network.players,
            total: request.network.total,
          },
        }
      }
    },
    // Player Info
    async getPlayerInfo() {
      const tokenInfo = this.getToken()
      const request = await this.api.getInfo({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
      })
      if (request.error) {
        router.push({ name: 'init-game' })
        this.setError('info', request.error)
      } else {
        this.clearError('info')
        const { key, username, score, color, mintConfig, shareConfig } =
          request.player
        this.id = key
        this.shareConfig = shareConfig
        this.mintConfig = mintConfig
        this.username = username
        this.score = score
        this.color = color
        if (request.guildRanking) {
          this.guildRanking = request.guildRanking
        }
        if (request.globalRanking) {
          this.globalRanking = request.globalRanking
        }
        if (request.lastInteractionIn) {
          this.interactionIn = request.lastInteractionIn
        }
        if (request.lastInteractionOut) {
          this.interactionOut = request.lastInteractionOut
        }
      }
    },
    // Web3
    // Minted NFTs
    async getPreview() {
      const tokenInfo = this.getToken()
      const request = await this.api.getNFTImage({
        token: tokenInfo.token,
      })
      if (request.error) {
        this.setError('showNFT', request.error)
        router.push('/init-game')
      } else {
        this.clearError('showNFT')
        this.nft = await request
      }
    },
    async getContractArgs(address) {
      const tokenInfo = this.getToken()
      const request = await this.api.getContractArgs({
        address,
        token: tokenInfo.token,
      })
      this.mintInformation = request

      return request
    },
  },
})
