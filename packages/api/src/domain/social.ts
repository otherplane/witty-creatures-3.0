import { DbSocialVTO } from '../types'

export class Social {
  public ownerKey: string
  public twitter?: string
  public discord?: string
  public telegram?: string
  public name?: string
  public company?: string

  constructor(vto: DbSocialVTO) {
    this.ownerKey = vto.ownerKey
    this.twitter = vto.twitter
    this.discord = vto.discord
    this.telegram = vto.telegram
    this.name = vto.name
    this.company = vto.company
  }

  toVTO(): DbSocialVTO {
    return {
      ownerKey: this.ownerKey,
      twitter: this.twitter,
      discord: this.discord,
      telegram: this.telegram,
      name: this.name,
      company: this.company,
    }
  }
}
