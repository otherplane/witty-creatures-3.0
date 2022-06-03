import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import {
  TIME_TO_MINT_MILLISECONDS,
  DEMO_ENDS_TIMESTAMP,
  GAME_ENDS_TIMESTAMP,
} from '../constants'
import { isMainnetTime } from '@/utils'
export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      id: null,
      theme: null,
      nft: [],
      username: '',
      ranch: {},
      selectedBufficorn: null,
      bonus: null,
      network: null,
      interactionInfo: null,
      interactionIn: null,
      interactionOut: null,
      //TODO: make gameOverTimeMilli take GAME_ENDS_TIMESTAMP value when gameOver is defined
      gameOverTimeMilli: GAME_ENDS_TIMESTAMP,
      demoOverTimeMilli: DEMO_ENDS_TIMESTAMP,
      timeToMintInMilli: GAME_ENDS_TIMESTAMP + TIME_TO_MINT_MILLISECONDS,
      previews: [],
      mintedAwards: [],
      history: null,
      mintInfo: null,
      mintParams: null,
      color: null,
      tokenIds: null,
      score: null,
      socials: null,
      contacts: null,
      bufficornsGlobalStats: null,
      playersGlobalStats: null,
      ranchesGlobalStats: null,
      errors: {
        showMintedAwards: null,
        preview: null,
        auth: null,
        interaction: null,
        info: null,
        history: null,
        getLeaderboardInfo: null,
        network: null,
        getContractArgs: null,
      },
    }
  },
  getters: {
    gameOver() {
      //FIXME: make it reactive
      return this.gameOverTimeMilli < Date.now()
    },
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
    demoOver() {
      //FIXME: make it reactive
      return this.demoOverTimeMilli < Date.now()
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
      console.log(info)
      localStorage.setItem(
        'tokenInfo',
        JSON.stringify({ ...this.getToken(), ...info })
      )
    },
    // TODO: set NFT preview data
    setPreviewData(preview) {
      console.log(preview)
    },
    savePreview(preview) {
      localStorage.setItem('preview', preview)
      this.preview = preview
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
    getSocials() {
      const socials = JSON.parse(localStorage.getItem('socials'))
      if (socials) {
        this.socials = socials
      }
    },
    async saveSocials(info) {
      localStorage.setItem('socials', JSON.stringify({ ...info }))
      this.socials = info
      const tokenInfo = this.getToken()
      const request = await this.api.socials({
        token: tokenInfo.token,
        data: { ...info },
      })
      console.log('-save socials--->>>', request)

      if (request.error) {
        this.setError('socials', request.error)
        router.push('/init-game')
      } else {
        this.clearError('socials')
        this.interactionInfo = request
        this.getPlayerInfo()
      }
    },
    deleteSocials() {
      localStorage.removeItem('socials')
      this.socials = null
    },
    // Socials
    getContacts() {
      const contacts = JSON.parse(localStorage.getItem('contacts'))
      if (contacts) {
        this.contacts = contacts
      }
    },
    async saveContact(info) {
      const rxg = label => new RegExp('(?<=' + label + '=)(.*?)(?=&)')
      const savedContacts = await JSON.parse(localStorage.getItem('contacts'))
      let contacts = {}
      if (savedContacts) {
        contacts = { ...savedContacts }
      }
      contacts[info.match(rxg('username'))[0]] = {
        username: info.match(rxg('username'))[0],
        twitter: info.match(rxg('twitter'))[0],
        telegram: info.match(rxg('telegram'))[0],
        discord: info.match(rxg('discord'))[0],
        timestamp: new Date().getTime(),
      }
      localStorage.setItem('contacts', JSON.stringify({ ...contacts }))
      router.push('/socials')
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
      await this.getTheme()
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
        this.history = request.interactions
      }
    },
    // Leaderboard
    async getGlobalStats(offset = 0, limit = 25) {
      await this.getTheme()
      await this.getPlayerInfo()
      const request = await this.api.getLeaderboardInfo({
        offset,
        limit,
      })
      if (request.error) {
        this.setError('getLeaderboardInfo', request.error)
      } else {
        this.clearError('getLeaderboardInfo')
        this.playersGlobalStats = request.players
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
        console.log('request......', request)
        const { key, username, score, color } = request.player
        this.id = key
        this.username = username
        this.score = score
        this.color = color
        // this.saveTheme(ranch.name)
        if (request.lastInteractionIn) {
          this.interactionIn = request.lastInteractionIn
        }
        if (request.lastInteractionOut) {
          this.interactionOut = request.lastInteractionOut
        }
      }
    },
    // Web3
    // TODO: get minted nft
    async getMintedAwardsImages() {
      // To Be Implemented
    },
    // TODO: get preview
    async getPreviews() {
      // To Be Implemented
    },
    async getContractArgs(address) {
      const tokenInfo = this.getToken()
      const request = await this.api.getContractArgs({
        address,
        token: tokenInfo.token,
      })

      this.mintInformation = request

      return this.mintCreatureParams
    },
  },
})
