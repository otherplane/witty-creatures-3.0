import { DbSocialVTO } from '../types'

export class Social {
  public key: string
  public twitter?: string
  public discord?: string
  public telegram?: string
  public name?: string
  public company?: string

  constructor(vto: DbSocialVTO) {
    this.key = vto.key
    this.twitter = vto.twitter
    this.discord = vto.discord
    this.telegram = vto.telegram
    this.name = vto.name
    this.company = vto.company
  }

  toVTO(): DbSocialVTO {
    return {
      key: this.key,
      twitter: this.twitter,
      discord: this.discord,
      telegram: this.telegram,
      name: this.name,
      company: this.company,
    }
  }
}
