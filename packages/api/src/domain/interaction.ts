import { DbInteractionVTO } from '../types'

export class Interaction {
  public from: string
  public fromNetwork: string
  public fromColor: number
  public to: string
  public toNetwork: string
  public toColor: number
  public points: number
  public timestamp: number
  public ends: number

  constructor(vto: DbInteractionVTO) {
    this.from = vto.from
    this.fromNetwork = vto.fromNetwork
    this.fromColor = vto.fromColor
    this.to = vto.to
    this.toNetwork = vto.toNetwork
    this.toColor = vto.toColor
    this.points = vto.points
    this.timestamp = vto.timestamp
    this.ends = vto.ends
  }

  toVTO(): DbInteractionVTO {
    return {
      from: this.from,
      fromNetwork: this.fromNetwork,
      fromColor: this.fromColor,
      to: this.to,
      toNetwork: this.toNetwork,
      toColor: this.toColor,
      points: this.points,
      timestamp: this.timestamp,
      ends: this.ends,
    }
  }

  isActive(): boolean {
    return this.ends > Date.now()
  }
}
