import crypto from 'crypto'
import { Collection, Db } from 'mongodb'
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator'

import {
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_KEY_SALT,
  TRADE_POINTS,
  TRADE_POINTS_DIVISOR,
  TRADE_POINTS_MIN,
} from '../constants'
import { DbPlayerVTO, DbTradeVTO } from '../types'
import { Repository } from '../repository'
import { Player } from '../domain/player'

export class PlayerModel {
  private collection: Collection<DbPlayerVTO>
  private repository: Repository<DbPlayerVTO>

  constructor(db: Db) {
    this.collection = db.collection('players')
    this.repository = new Repository(this.collection, 'username')
  }

  public createPlayer(index: number): Player {
    // Generate the player data.
    // First we derive a deterministic 32-bytes sequence of bytes from a fixed salt plus the player nonce.
    const seed = crypto
      .createHash('sha256')
      .update(`${PLAYER_KEY_SALT}|${index}`)
      .digest()
    // We will be using the hexadecimal representation of the first `PLAYER_ID_LENGTH_BYTES` of the seed as the player key.
    const key: string = seed.slice(0, PLAYER_KEY_LENGTH_BYTES).toString('hex')
    // FIXME: avoid repeated usernames
    // The rest of the bytes of the seed will be used for seeding the unique names generator.
    const username: string = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      seed: seed.slice(PLAYER_KEY_LENGTH_BYTES).readUInt32BE(),
      separator: '-',
      style: 'lowerCase',
    })
    const medals: Array<string> = []
    const score: number = 0

    return new Player({ key, username, medals, score })
  }

  /**
   * Generate as many players as specified in the `count` argument.
   * @param count How many players to generate
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    count: number,
    force: boolean = false
  ): Promise<Array<Player> | null> {
    const vtos = await this.repository.bootstrap(
      (_: null, index: number) => this.createPlayer(index),
      count,
      force
    )

    return vtos?.map((vto) => new Player(vto)) || null
  }

  public async create(player: DbPlayerVTO): Promise<Player> {
    const { username } = player
    const bufficornExists = await this.repository.getOne({ username })

    if (bufficornExists) {
      throw new Error(`Player with name ${username} already exists`)
    }

    return new Player(await this.repository.create(player))
  }

  public async update(player: DbPlayerVTO): Promise<Player> {
    const { username } = player

    return new Player(await this.repository.updateOne({ username }, player))
  }

  public async get(key: string): Promise<Player | null> {
    const vto = await this.repository.getOne({ key })

    return vto ? new Player(vto) : null
  }

  public async addPoints(key: string, points: number): Promise<Player | null> {
    await this.collection.updateOne({ key }, { $inc: { score: points } })

    return await this.get(key)
  }

  public computePoints(lastTrade: DbTradeVTO | null) {
    // Compute points
    let points
    if (!lastTrade) {
      points = TRADE_POINTS
    } else {
      points = Math.max(
        Math.ceil(lastTrade.points / TRADE_POINTS_DIVISOR),
        TRADE_POINTS_MIN
      )
    }

    return points
  }

  public async getOne(id: string): Promise<Player | null> {
    const vto = await this.repository.getById(id)

    return vto ? new Player(vto) : null
  }
}
