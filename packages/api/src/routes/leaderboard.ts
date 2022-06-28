import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { LeaderboardParams, LeaderboardResponse } from '../types'
import { Player } from '../domain/player'

const leaderboard: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel } = fastify

  //GET /leaderboard?resource=RESOURCE&limit=LIMIT&offset=OFFSET
  fastify.get<{
    Querystring: LeaderboardParams
    Reply: LeaderboardResponse | Error
  }>('/leaderboard', {
    schema: {
      querystring: LeaderboardParams,
      response: {
        200: LeaderboardResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Querystring: LeaderboardParams }>,
      reply
    ) => {
      const players: Array<Player> = await playerModel.getMany({
        limit: request.query.limit || 10,
        offset: request.query.offset || 0,
      })

      const totalPlayers = await playerModel.countActive()
      const sortedPlayers: Array<Player> | null =
        await playerModel.getPlayersByNetwork(request.query.filter, {
          limit: request.query.limit || 10,
          offset: request.query.offset || 0,
        })

      const sortedPlayersTotal = await playerModel.countActiveByNetwork(
        request.query.filter
      )
      const paginatedPlayers = Player.getLeaderboard(
        players,
        totalPlayers,
        request.query.offset
      )

      const sortedPaginatedPlayers = Player.getLeaderboard(
        sortedPlayers ? sortedPlayers : [],
        sortedPlayersTotal,
        request.query.offset
      )

      return reply.status(200).send({
        global: paginatedPlayers,
        network: sortedPaginatedPlayers,
      })
    },
  })
}

export default leaderboard
