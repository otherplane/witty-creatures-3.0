import { Collection, Db } from 'mongodb'
import { Interaction } from '../domain/interaction'

import { Repository } from '../repository'
import { DbInteractionVTO, Socials } from '../types'

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

  public async shareSocials({
    username,
    socials,
  }: {
    username: string
    socials: Socials
  }): Promise<DbInteractionVTO> {
    const lastIncomingInteraction = await this.getLast({ to: username })
    const lastOutgoingInteraction = await this.getLast({ from: username })
    if (lastIncomingInteraction?.to === username) {
      await this.repository.updateOne(
        { from: username, timestamp: lastIncomingInteraction?.timestamp },
        { socialsTo: socials }
      )
    }
    if (lastIncomingInteraction?.from === username) {
      await this.repository.updateOne(
        { from: username, timestamp: lastOutgoingInteraction?.timestamp },
        { socialsFrom: socials }
      )
    }
    return await this.repository.updateOne(
      { from: username, timestamp: lastOutgoingInteraction?.timestamp },
      { socialsFrom: socials }
    )
  }

  public async getContactsByUsername(
    username: string,
    paginationParams: { limit: number; offset: number }
  ): Promise<Array<DbInteractionVTO>> {
    return await this.repository.getSortedBy(
      {
        socialsTo: { $ne: null },
        $or: [{ from: username }, { to: username }],
      },
      { timestamp: 'desc' },
      paginationParams
    )
  }

  public async getManyByUsername(
    username: string,
    paginationParams: { limit: number; offset: number }
  ): Promise<Array<DbInteractionVTO>> {
    return await this.repository.getSortedBy(
      {
        $or: [{ from: username }, { to: username }],
      },
      { timestamp: 'desc' },
      paginationParams
    )
  }

  public async count(username: string): Promise<number> {
    return this.repository.count({
      $or: [{ from: username }, { to: username }],
    })
  }
  public async countContacts(username: string): Promise<number> {
    return this.repository.count({
      socialsTo: { $ne: null },
      $or: [{ from: username }, { to: username }],
    })
  }
}
