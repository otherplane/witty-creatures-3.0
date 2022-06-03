import { DbInteractionVTO, SocialsResult } from '../types'

export class Interaction {
  public from: string
  public to: string
  public points: number
  public timestamp: number
  public ends: number
  public socialsTo: SocialsResult | null
  public socialsFrom: SocialsResult | null

  constructor(vto: DbInteractionVTO) {
    this.from = vto.from
    this.to = vto.to
    this.points = vto.points
    this.timestamp = vto.timestamp
    this.ends = vto.ends
    this.socialsFrom = vto.socialsFrom
    this.socialsTo = vto.socialsTo
  }

  toVTO(): DbInteractionVTO {
    return {
      from: this.from,
      to: this.to,
      points: this.points,
      timestamp: this.timestamp,
      ends: this.ends,
      socialsFrom: this.socialsFrom,
      socialsTo: this.socialsTo,
    }
  }

  isActive(): boolean {
    return this.ends > Date.now()
  }
}
