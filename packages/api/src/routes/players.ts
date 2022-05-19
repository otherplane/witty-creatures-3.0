import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
  AuthorizationHeader,
  GetByStringKeyParams,
  JwtVerifyPayload,
  PlayerVTO,
} from '../types'

const players: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel } = fastify

  fastify.get<{ Params: GetByStringKeyParams; Reply: PlayerVTO | Error }>(
    '/players/:key',
    {
      schema: {
        params: GetByStringKeyParams,
        headers: AuthorizationHeader,
        response: {
          200: PlayerVTO,
        },
      },
      handler: async (
        request: FastifyRequest<{ Params: { key: string } }>,
        reply
      ) => {
        const { key } = request.params
        let playerKey: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          playerKey = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }
        if (playerKey !== key)
          return reply.status(403).send(new Error(`Forbidden: invalid token`))

        // Unreachable: valid server issued token refers to non-existent player
        const player = await playerModel.get(key)
        if (!player) {
          return reply
            .status(404)
            .send(new Error(`Player does not exist (key: ${key})`))
        }

        // Unreachable: valid server issued token refers to an unclaimed player
        if (!player.token) {
          return reply
            .status(405)
            .send(new Error(`Player has not been claimed yet (key: ${key})`))
        }

        const extendedPlayer: PlayerVTO = {
          ...player.toDbVTO(),
        }

        return reply.status(200).send(extendedPlayer)
      },
    }
  )
}

export default players
