import { CollectionInfo, Db, MongoClient } from 'mongodb'
import Fastify from 'fastify'
import { app } from '../src/app'
import { FastifyInstance } from 'fastify'

let server: FastifyInstance

let client = new MongoClient(process.env.MONGO_URI)
let db: Db

beforeAll(async () => {
  client = await client.connect()
  db = await client.db(process.env.MONGO_INITDB_DATABASE)
})

beforeEach(async () => {
  // Drop mongodb collections
  try {
    const collections = await db.listCollections()
    let info: CollectionInfo | null

    while (await collections.hasNext()) {
      info = await collections.next()
      if (info) {
        await db.dropCollection(info.name)
      }
    }
  } catch (err) {
    console.error('Error dropping mongo', err)
  }

  server = Fastify().register(app)
})

afterAll(async () => {
  await client.close()
})

afterEach(async () => {
  await server.close()
})

async function authenticatePlayer(key: string): Promise<string> {
  return await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: '/auth',
        payload: { key },
      },
      (err, response) => {
        resolve(response.json().token)
      }
    )
  })
}

async function serverInject(
  opts: {},
  cb: (error, result) => Promise<void> | void
): Promise<null> {
  return new Promise((resolve, reject) => {
    server.inject(opts, async (error, result) => {
      await cb(error, result)

      return resolve(null)
    })
  })
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    return setTimeout(() => {
      return resolve(null)
    }, ms)
  })
}

const initialPlayers = [
  {
    key: 'ef12efbd765f9ad3',
    username: 'calm-bison',
  },
  {
    key: 'b75c34545e8cb4d2',
    username: 'particular-newt',
  },
]

export { server, authenticatePlayer, serverInject, sleep, initialPlayers }
