import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
  AuthorizationHeader,
  GetByStringKeyParams,
  JwtVerifyPayload,
  ExtendedPlayerVTO,
  ContactListParams,
  ContactListResponse,
} from '../types'

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
      const contactPromises = player.contacts
        .sort((contactA, contactB) => contactB.timestamp - contactA.timestamp)
        .slice(request.query.offset, request.query.limit)
        .map(async contact => {
          return {
            ...(await socialModel.get(contact.key)),
            timestamp: contact.timestamp,
          }
        })

      const allPromise = Promise.all(contactPromises)
      let contacts
      try {
        contacts = await allPromise
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
}

export default players
