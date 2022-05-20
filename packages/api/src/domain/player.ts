import { DbPlayerVTO, ExtendedPlayerVTO } from '../types'
import { Trade } from './trade'

export class Player {
  token?: string | undefined
  lastTradeIn?: number | undefined
  lastTradeOut?: number | undefined
  key: string
  username: string
  score: number
  medals: Array<string> = []

  constructor(vto: DbPlayerVTO) {
    this.key = vto.key
    this.username = vto.username
    this.score = vto.score
    this.medals = vto.medals
    this.token = vto.token
  }

  toExtendedPlayerVTO({
    lastTradeOut,
    lastTradeIn,
  }: {
    lastTradeIn?: Trade | null
    lastTradeOut: Trade | null
  }): ExtendedPlayerVTO {
    // Get all Player attributes except token
    const { token, ...protectedplayerVTO } = this.toDbVTO()
    return {
      player: {
        ...protectedplayerVTO,
      },
      lastTradeIn: lastTradeIn?.isActive() ? lastTradeIn.toVTO() : null,
      lastTradeOut: lastTradeOut?.isActive() ? lastTradeOut.toVTO() : null,
    }
  }

  toDbVTO(shoWToken: boolean = false): DbPlayerVTO {
    const vto = {
      lastTradeIn: this.lastTradeIn,
      lastTradeOut: this.lastTradeOut,
      key: this.key,
      username: this.username,
      score: this.score,
      medals: this.medals,
      token: this.token,
    }

    return shoWToken ? { ...vto, token: this.token } : vto
  }
}
