import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { checkEmptySocials, normalizedAttributes } from '../utils'
import { Social } from '../domain/social'

import Web3 from 'web3'
import { NETWORKS } from '../constants'
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
  NetworkConfig,
  PlayerMetadataReponse,
  MetadataParams,
} from '../types'
import { SvgService } from '../svgService'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WITTY_CREATURES_ERC721_ABI = require('../assets/WittyCreaturesAPI.abi.json')

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
          guildRanking: await playerModel.getNetworkPosition({
            key: player.key,
            network: player.mintConfig,
          }),
          globalRanking: await playerModel.getGlobalPosition(player.key),
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
    Params: MetadataParams
    Reply: PlayerMetadataReponse | Error
  }>('/players/metadata/:chainId/:token', {
    schema: {
      params: MetadataParams,
      response: {
        200: PlayerMetadataReponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: MetadataParams }>,
      reply
    ) => {
      let callResult
      const networkConfig: NetworkConfig = NETWORKS
      //TODO: add provider
      const { token, chainId } = request.params
      const provider = networkConfig[chainId].rpcUrls[0]
      const web3 = new Web3(new Web3.providers.HttpProvider(provider))
      const contract = new web3.eth.Contract(WITTY_CREATURES_ERC721_ABI)
      try {
        callResult = await contract.methods.metadata(token).call()
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply.status(404).send(new Error(`Metadata`))
      }
      return reply.status(200).send(JSON.parse(callResult))
    },
  })

  fastify.get<{
    Params: MetadataParams
    Reply: string | Error
  }>('/players/image/:chainId/:token', {
    schema: {
      params: MetadataParams,
      response: {
        200: String,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: MetadataParams }>,
      reply
    ) => {
      let callResult
      const networkConfig: NetworkConfig = NETWORKS
      //TODO: add provider
      const { token, chainId } = request.params
      const provider = networkConfig[chainId].rpcUrls[0]
      const web3 = new Web3(new Web3.providers.HttpProvider(provider))
      const contract = new web3.eth.Contract(WITTY_CREATURES_ERC721_ABI)
      try {
        callResult = await contract.methods.metadata(token).call()
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply.status(404).send(new Error(`Metadata`))
      }
      const svg = SvgService.getSVG(
        normalizedAttributes(JSON.parse(callResult).attributes)
      )
      // return extended player
      return reply.status(200).send(svg.replace(/\n/g, ''))
    },
  })

  fastify.get<{
    Reply: PlayerImagesReponse | Error
  }>('/players/preview', {
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
      const networkConfig: NetworkConfig = NETWORKS
      const provider = networkConfig[player.mintConfig].rpcUrls[0]
      const contractAddress = networkConfig[player.mintConfig].contractAddress
      const web3 = new Web3(new Web3.providers.HttpProvider(provider))
      const contract = new web3.eth.Contract(
        WITTY_CREATURES_ERC721_ABI,
        contractAddress
      )
      const name = player.username
      const globalRanking = await playerModel.getGlobalPosition(player.key)
      const guildId = Number(player.mintConfig)
      const guildPlayers = await playerModel.countActiveByNetwork(
        player.mintConfig
      )
      const guildRanking = await playerModel.getNetworkPosition({
        key: player.key,
        network: player.mintConfig,
      })
      const index = player.creationIndex
      const score = player.score
      try {
        callResult = await contract.methods
          .preview(
            name,
            globalRanking,
            guildId,
            guildPlayers,
            guildRanking,
            index,
            score
          )
          .call()
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply.status(404).send(new Error(`Metadata`))
      }
      console.log('metadata----', JSON.parse(callResult))
      const svg = SvgService.getSVG(
        normalizedAttributes(JSON.parse(callResult).attributes)
      )

      result.push({
        svg: svg.replace(/\n/g, ''),
      })

      // return extended player
      return reply.status(200).send(result)
    },
  })
}

export default players
