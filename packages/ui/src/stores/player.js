import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import {
  TIME_TO_MINT_MILLISECONDS,
  DEMO_ENDS_TIMESTAMP,
  GAME_ENDS_TIMESTAMP
} from '../constants'

export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      id: null,
      theme: null,
      medals: [],
      username: '',
      ranch: {},
      selectedBufficorn: null,
      bonus: null,
      tradeInfo: null,
      farmerId: null,
      tradeIn: null,
      tradeOut: null,
      //TODO: make gameOverTimeMilli take GAME_ENDS_TIMESTAMP value when gameOver is defined
      gameOverTimeMilli: Date.now() + 7889400000,
      demoOverTimeMilli: DEMO_ENDS_TIMESTAMP,
      timeToMintInMilli: GAME_ENDS_TIMESTAMP + TIME_TO_MINT_MILLISECONDS,
      previews: [],
      mintedAwards: [],
      tradeHistory: null,
      mintInfo: null,
      mintParams: null,
      color: null,
      tokenIds: null,
      playerPoints: null,
      bufficornsGlobalStats: null,
      playersGlobalStats: null,
      ranchesGlobalStats: null,
      errors: {
        showMintedAwards: null,
        preview: null,
        auth: null,
        trade: null,
        info: null,
        tradeHistory: null,
        getLeaderboardInfo: null,
        network: null,
        getContractArgs: null
      }
    }
  },
  getters: {
    gameOver () {
      //FIXME: make it reactive
      return Date.now() + 7889400000 < Date.now()
    },
    mintingAllow () {
      //FIXME: make it reactive
      return Date.now() + 7889400000 < Date.now()
    },
    minted () {
      if (this.mintInfo && this.mintInfo.events && this.mintInfo.events[1]) {
        return true
      } else {
        return false
      }
    },
    demoOver () {
      //FIXME: make it reactive
      return this.demoOverTimeMilli < Date.now()
    },
    isMainnetTime () {
      return isMainnetTime()
    }
  },
  actions: {
    notify (payload) {
      this.app.config.globalProperties.$notify(payload)
    },
    saveClaimInfo (info) {
      localStorage.setItem(
        'tokenInfo',
        JSON.stringify({ ...this.getToken(), ...info })
      )
    },
    // TODO: set NFT preview data
    setPreviewData (preview) {
      console.log(preview)
    },
    savePreview (preview) {
      localStorage.setItem('preview', preview)
      this.preview = preview
    },
    // Color theme
    getTheme () {
      const theme = localStorage.getItem('theme')
      if (theme) {
        this.theme = theme
      }
    },
    saveTheme (theme) {
      localStorage.setItem('theme', theme)
      this.theme = theme
    },
    // Mint info
    getMintInfo () {
      const mintInfo = JSON.parse(localStorage.getItem('mintInfo'))
      if (mintInfo) {
        this.mintInfo = mintInfo
      }
    },
    saveMintInfo (info) {
      localStorage.setItem('mintInfo', JSON.stringify({ ...info }))
      this.mintInfo = info
    },
    // Token Info
    getToken () {
      return JSON.parse(localStorage.getItem('tokenInfo'))
    },
    clearTokenInfo () {
      localStorage.removeItem('tokenInfo')
      localStorage.removeItem('theme')
    },
    // Errors
    clearError (error) {
      this.errors[error] = null
    },
    setError (name, error) {
      this.errors[name] = error.response?.data?.message || error.toString()
      this.notify({ message: this.errors[name] })
    },

    async authorize ({ key }) {
      const request = await this.api.authorize({ key })
      if (request.error) {
        router.push('/init-game')
        this.setError('auth', request.error)
      } else if (request.token) {
        await this.saveClaimInfo(request)
        this.clearError('auth')
        this.getPlayerInfo()
      }
    },
    // Trade
    clearTrade () {
      this.trade = null
    },
    async trade ({ key }) {
      const tokenInfo = this.getToken()
      const request = await this.api.trade({
        token: tokenInfo.token,
        key: key
      })

      if (request.error) {
        this.setError('trade', request.error)
        router.push('/init-game')
      } else {
        this.clearError('trade')
        this.tradeInfo = request
        router.push('/init-game')
        this.getPlayerInfo()
      }
    },
    // Player Info
    async getPlayerInfo () {
      const tokenInfo = this.getToken()
      const request = await this.api.getInfo({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key
      })
      if (request.error) {
        router.push({ name: 'init-game' })
        this.setError('info', request.error)
      } else {
        this.clearError('info')
        const { key, username, points } = request
        this.id = key
        this.username = username
        this.points = points

        // this.saveTheme(ranch.name)
        if (request.lastTradeIn) {
          this.tradeIn = request.lastTradeIn
        }
        if (request.lastTradeOut) {
          this.tradeOut = request.lastTradeOut
        }
      }
    },
    // Web3
    // TODO: get minted nft
    async getMintedAwardsImages () {},
    // TODO: get preview
    async getPreviews () {},
    async getContractArgs (address) {
      const tokenInfo = this.getToken()
      const request = await this.api.getContractArgs({
        address,
        token: tokenInfo.token
      })

      this.mintInformation = request

      return this.mintCreatureParams
    }
  }
})
