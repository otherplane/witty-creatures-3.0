import { Collection, Db } from 'mongodb'
import { Trade } from '../domain/trade'

import { Repository } from '../repository'
import { DbTradeVTO } from '../types'

export class TradeModel {
  private collection: Collection<DbTradeVTO>
  private repository: Repository<DbTradeVTO>

  constructor(db: Db) {
    this.collection = db.collection('trades')
    this.repository = new Repository(this.collection, 'timestamp')
  }

  public async create(vto: DbTradeVTO): Promise<Trade> {
    return new Trade(await this.repository.create(vto))
  }

  public async getLast(search: {
    from?: string
    to?: string
  }): Promise<Trade | null> {
    const vto = await this.repository.getLast(search)

    return vto ? new Trade(vto) : null
  }
}
