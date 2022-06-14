import { Collection, Db } from 'mongodb'
import { Social } from '../domain/social'

import { Repository } from '../repository'
import { DbSocialVTO } from '../types'

export class SocialModel {
  private collection: Collection<DbSocialVTO>
  private repository: Repository<DbSocialVTO>

  constructor(db: Db) {
    this.collection = db.collection('socials')
    this.repository = new Repository(this.collection, 'key')
  }

  public async create(vto: DbSocialVTO): Promise<Social> {
    return new Social(await this.repository.create(vto))
  }

  public async getLast(search: {
    from?: string
    to?: string
  }): Promise<Social | null> {
    const vto = await this.repository.getLast(search)
    return vto ? new Social(vto) : null
  }

  public async update(socials: Social): Promise<Social | null> {
    const { key } = socials
    const vto = await this.repository.updateOne({ key }, socials)
    return vto ? new Social(vto) : null
  }

  public async get(key: string): Promise<Social | null> {
    const vto = await this.repository.getOne({ key })

    return vto ? new Social(vto) : null
  }
}
