import { DbPlayerVTO, ExtendedPlayerVTO } from '../types'
import { Interaction } from './interaction'

export class Player {
  token?: string | undefined
  lastInteractionIn?: number | undefined
  lastInteractionOut?: number | undefined
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
    lastInteractionOut,
    lastInteractionIn,
  }: {
    lastInteractionIn?: Interaction | null
    lastInteractionOut: Interaction | null
  }): ExtendedPlayerVTO {
    // Get all Player attributes except token
    const { token, ...protectedplayerVTO } = this.toDbVTO()
    return {
      player: {
        ...protectedplayerVTO,
      },
      lastInteractionIn: lastInteractionIn?.isActive() ? lastInteractionIn.toVTO() : null,
      lastInteractionOut: lastInteractionOut?.isActive() ? lastInteractionOut.toVTO() : null,
    }
  }

  toDbVTO(shoWToken: boolean = false): DbPlayerVTO {
    const vto = {
      lastInteractionIn: this.lastInteractionIn,
      lastInteractionOut: this.lastInteractionOut,
      key: this.key,
      username: this.username,
      score: this.score,
      medals: this.medals,
      token: this.token,
    }

    return shoWToken ? { ...vto, token: this.token } : vto
  }
}
