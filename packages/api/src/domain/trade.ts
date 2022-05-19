import { DbTradeVTO } from '../types'

export class Trade {
  public from: string
  public to: string
  public points: number
  public timestamp: number
  public ends: number

  constructor(vto: DbTradeVTO) {
    this.from = vto.from
    this.to = vto.to
    this.points = vto.points
    this.timestamp = vto.timestamp
    this.ends = vto.ends
  }

  toVTO(): DbTradeVTO {
    return {
      from: this.from,
      to: this.to,
      points: this.points,
      timestamp: this.timestamp,
      ends: this.ends,
    }
  }
}
