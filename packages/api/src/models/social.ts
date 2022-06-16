import { Collection, Db } from 'mongodb'
import { Social } from '../domain/social'

import { Repository } from '../repository'
import { DbSocialVTO } from '../types'

export class SocialModel {
  private collection: Collection<DbSocialVTO>
  private repository: Repository<DbSocialVTO>

  constructor(db: Db) {
    this.collection = db.collection('social')
    this.repository = new Repository(this.collection, 'ownerKey')
  }

  public async create(vto: DbSocialVTO): Promise<Social> {
    const result = await this.repository.create(vto)
    return new Social(result)
  }

  public async getLast(search: {
    from?: string
    to?: string
  }): Promise<Social | null> {
    const vto = await this.repository.getLast(search)
    return vto ? new Social(vto) : null
  }

  public async update(socials: Social): Promise<Social | null> {
    const { ownerKey } = socials
    const vto = await this.repository.updateOne({ ownerKey }, socials)
    return vto ? new Social(vto) : null
  }

  public async get(key: string): Promise<Social | null> {
    const vto = await this.repository.getOne({ ownerKey: key })
    return vto ? new Social(vto) : null
  }
}
