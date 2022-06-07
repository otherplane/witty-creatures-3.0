import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  ConfigParams,
  ConfigResult,
} from '../types'

import { validateSocials } from '../utils'

const configuration: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel } = fastify

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

        try {
          // Update player configuration
          await playerModel.addConfig(
            fromPlayer.toDbVTO().key,
            validateSocials(request.body.socials),
            request.body.mintConfig
          )
        } catch (error) {
          console.log(error)
          return reply.status(403).send(error as Error)
        }
        return reply.status(200).send({
          socials: validateSocials(request.body.socials),
          mintConfig: request.body.mintConfig,
        })
      },
    }
  )
}

export default configuration
