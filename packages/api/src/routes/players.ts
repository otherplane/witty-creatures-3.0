import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { checkEmptySocials } from '../utils'
import { Social } from '../domain/social'

import Web3 from 'web3'
import { WEB3_PROVIDER, WITTY_CREATURES_ERC721_ADDRESS } from '../constants'
import {
  AuthorizationHeader,
  GetByStringKeyParams,
  JwtVerifyPayload,
  ExtendedPlayerVTO,
  ContactListParams,
  ContactListResponse,
  ContactIndex,
  SocialParams,
  SocialResult,
  ConfigParams,
  ConfigResult,
  PlayerImagesReponse,
} from '../types'
import { SvgService } from '../svgService'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONTRACT_ERCC721_ABI = require('../assets/WittyCreaturesABI.json')

const players: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, socialModel } = fastify

  fastify.get<{
    Params: GetByStringKeyParams
    Reply: ExtendedPlayerVTO | Error
  }>('/players/:key', {
    schema: {
      params: GetByStringKeyParams,
      headers: AuthorizationHeader,
      response: {
        200: ExtendedPlayerVTO,
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

      const extendedPlayer: ExtendedPlayerVTO =
        await player.toExtendedPlayerVTO({
          // get last incoming interaction
          lastInteractionIn: await fastify.interactionModel.getLast({
            to: player.username,
          }),
          // get last outgoing interaction
          lastInteractionOut: await fastify.interactionModel.getLast({
            from: player.username,
          }),
        })

      return reply.status(200).send(extendedPlayer)
    },
  })
  fastify.get<{
    Querystring: ContactListParams
    Reply: ContactListResponse | Error
  }>('/contacts', {
    schema: {
      querystring: ContactListParams,
      headers: AuthorizationHeader,
      response: {
        200: ContactListResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Querystring: ContactListParams }>,
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
      const player = await playerModel.get(fromKey)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${fromKey})`))
      }

      // Check 3 (unreachable): interaction player has been claimed
      if (!player.token) {
        return reply
          .status(409)
          .send(
            new Error(`Player should be claimed before interact with others`)
          )
      }
      const contactPromises: Array<Promise<ContactIndex>> = player.contacts
        .sort(
          (contactA: ContactIndex, contactB: ContactIndex) =>
            contactB.timestamp - contactA.timestamp
        )
        .slice(request.query.offset, request.query.limit)
        .map(async (contact: ContactIndex): Promise<ContactIndex> => {
          // We can assume that the contact exist because it was pushed to the player contacts
          const ownerInfo = await playerModel.get(contact.ownerKey)
          try {
            return {
              ...(await socialModel.get(contact.ownerKey)),
              color: ownerInfo ? ownerInfo.color : null,
              timestamp: contact.timestamp,
            } as ContactIndex
          } catch (err) {
            // Unreachable
            throw new Error(`Error ${err}`)
          }
        })
      let contacts
      try {
        contacts = await Promise.all(contactPromises)
      } catch (error) {
        reply.status(409).send(new Error(`Error fetching contacts`))
      }
      if (contacts) {
        reply.status(200).send({
          contacts: {
            contacts: contacts,
            total: player.contacts.length,
          },
        })
      }
    },
  })
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
  fastify.get<{
    Reply: PlayerImagesReponse | Error
  }>('/players/image', {
    schema: {
      headers: AuthorizationHeader,
      response: {
        200: PlayerImagesReponse,
      },
    },
    handler: async (request: FastifyRequest, reply) => {
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
      const player = await playerModel.get(fromKey)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${fromKey})`))
      }
      const result: Array<{ svg: string }> = []
      let callResult
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      const contract = new web3.eth.Contract(
        CONTRACT_ERCC721_ABI,
        WITTY_CREATURES_ERC721_ADDRESS
      )
      try {
        callResult = await contract.methods.getTokenInfo(1).call()
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply.status(404).send(new Error(`Metadata`))
      }
      console.log('callResult', callResult[0])
      //TODO: Call get svg metadata
      // const [head, eyes, mouth, clothes, background, object]: [string, string, string, string, string, string] = callResult[0]
      const svg = SvgService.getSVG({
        head: 'head-1',
        eyes: 'eyes-1',
        mouth: 'mouth-1',
        clothes: 'clothes-1',
        background: 'background-1',
        object: 'object-1',
      })

      result.push({
        svg: svg.replace(/\n/g, ''),
      })

      // return extended player
      return reply.status(200).send(result)
    },
  })
}

export default players
