import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { Social } from '../domain/social'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  ConfigParams,
  ConfigResult,
  SocialParams,
  SocialResult,
} from '../types'

import { checkEmptySocials } from '../utils'

const configuration: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, socialModel } = fastify

  fastify.get<{ Body: SocialParams; Reply: SocialResult | Error }>('/socials', {
    schema: {
      querystring: SocialParams,
      headers: AuthorizationHeader,
      response: {
        200: SocialResult,
      },
    },
    handler: async (request: FastifyRequest<{ Body: SocialParams }>, reply) => {
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

      const playerSocials = await socialModel.get(fromPlayer.toDbVTO().key)

      return reply.status(200).send(playerSocials)
    },
  })

  fastify.post<{ Body: ConfigParams; Reply: ConfigResult | Error }>(
    '/configuration',
    {
      schema: {
        body: ConfigParams,
        headers: AuthorizationHeader,
        response: {
          200: ConfigResult,
        },
      },
      handler: async (
        request: FastifyRequest<{ Body: ConfigParams }>,
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

        const playerSocials = await socialModel.get(fromPlayer.toDbVTO().key)

        try {
          const socialsToUpdate = {
            ownerKey: fromPlayer.toDbVTO().key,
            ...checkEmptySocials(request.body.socials),
          }
          if (playerSocials) {
            await socialModel.update(new Social(socialsToUpdate))
          } else {
            await socialModel.create(socialsToUpdate)
          }
          await playerModel.updateConfig(
            fromPlayer.toDbVTO().key,
            request.body.mintConfig,
            request.body.shareConfig
          )
        } catch (error) {
          return reply.status(403).send(error as Error)
        }
        return reply.status(200).send({
          socials: await socialModel.get(fromPlayer.toDbVTO().key),
          shareConfig: request.body.shareConfig,
          mintConfig: request.body.mintConfig,
        })
      },
    }
  )
}

export default configuration
