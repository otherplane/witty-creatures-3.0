import { DbPlayerVTO } from '../types'

export class Player {
  token?: string | undefined
  lastTradeIn?: number | undefined
  lastTradeOut?: number | undefined
  key: string
  username: string
  points: number
  medals: Array<string> = []

  constructor(vto: DbPlayerVTO) {
    this.lastTradeIn = vto.lastTradeIn || undefined
    this.lastTradeOut = vto.lastTradeOut || undefined
    this.key = vto.key
    this.username = vto.username
    this.points = vto.points
    this.medals = vto.medals
    this.token = vto.token
  }

  toDbVTO(shoWToken: boolean = false): DbPlayerVTO {
    const vto = {
      lastTradeIn: this.lastTradeIn,
      lastTradeOut: this.lastTradeOut,
      key: this.key,
      username: this.username,
      points: this.points,
      medals: this.medals,
      token: this.token,
    }

    return shoWToken ? { ...vto, token: this.token } : vto
  }
}
