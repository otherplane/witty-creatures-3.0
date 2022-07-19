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

    this.sanitize()
  }

  sanitize() {
    this.twitter = this.twitter
      ?.trim()
      .replace(/[^a-z0-9_]/gi, '')
      .slice(0, 20)
    this.discord = this.discord
      ?.trim()
      .replace(/[^a-zA-Z0-9#]/gi, '')
      .slice(0, 36)
    this.name = this.name?.trim().slice(0, 20)
    this.telegram = this.telegram
      ?.trim()
      .replace(/[^[a-zA-Z0-9_]$/, '')
      .slice(0, 40)
    this.company = this.company?.trim().slice(0, 20)
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
