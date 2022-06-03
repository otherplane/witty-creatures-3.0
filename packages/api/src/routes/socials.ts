import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  SocialsParams,
  SocialsResult,
} from '../types'

const socials: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel } = fastify

  fastify.post<{ Body: SocialsParams; Reply: SocialsResult | Error }>(
    '/socials',
    {
      schema: {
        body: SocialsParams,
        headers: AuthorizationHeader,
        response: {
          200: SocialsResult,
        },
      },
      handler: async (
        request: FastifyRequest<{ Body: SocialsParams }>,
        reply
      ) => {
        // Check 1: token is valid
        let fromKey: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          fromKey = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }

        // Check 2 (unreachable): valid server issued token refers to non-existent player
        const fromPlayer = await playerModel.get(fromKey)
        if (!fromPlayer) {
          return reply
            .status(404)
            .send(new Error(`Player does not exist (key: ${fromKey})`))
        }

        // Check 3 (unreachable): trading player has been claimed
        if (!fromPlayer.token) {
          return reply
            .status(409)
            .send(
              new Error(`Player should be claimed before interact with others`)
            )
        }
        try {
          // Add points to player
          await playerModel.addSocials(fromPlayer.toDbVTO().key, {
            twitter: request.body.twitter,
            discord: request.body.discord,
            telegram: request.body.telegram,
            name: request.body.name,
            company: request.body.company,
            share: request.body.share,
          })
        } catch (error) {
          return reply.status(403).send(error as Error)
        }

        return reply.status(200).send({
          twitter: request.body.twitter,
          discord: request.body.discord,
          telegram: request.body.telegram,
          name: request.body.name,
          company: request.body.company,
          share: request.body.share,
        })
      },
    }
  )
}

export default socials
