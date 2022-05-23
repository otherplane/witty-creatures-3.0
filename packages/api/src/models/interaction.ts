import { Collection, Db } from 'mongodb'
import { Interaction } from '../domain/interaction'

import { Repository } from '../repository'
import { DbInteractionVTO } from '../types'

export class InteractionModel {
  private collection: Collection<DbInteractionVTO>
  private repository: Repository<DbInteractionVTO>

  constructor(db: Db) {
    this.collection = db.collection('interactions')
    this.repository = new Repository(this.collection, 'timestamp')
  }

  public async create(vto: DbInteractionVTO): Promise<Interaction> {
    return new Interaction(await this.repository.create(vto))
  }

  public async getLast(search: {
    from?: string
    to?: string
  }): Promise<Interaction | null> {
    const vto = await this.repository.getLast(search)
    return vto ? new Interaction(vto) : null
  }
}
