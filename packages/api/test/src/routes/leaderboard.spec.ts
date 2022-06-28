import { authenticatePlayer, initialPlayers, serverInject } from '../../setup'

describe('Route /leaderboard', () => {
  describe('should return leaderboard values for each entity', () => {
    it('players.global', async () => {
      const tokens = await Promise.all([
        authenticatePlayer(initialPlayers[0].key),
        authenticatePlayer(initialPlayers[1].key),
        authenticatePlayer(initialPlayers[2].key),
        authenticatePlayer(initialPlayers[3].key),
        authenticatePlayer(initialPlayers[4].key),
        authenticatePlayer(initialPlayers[5].key),
      ])
      const token = tokens[0]

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard?filter=1',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const players = response.json().global
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(players.players.length).toBe(6)
          expect(players.total).toBe(6)

          players.players.forEach((player, index) => {
            expect(player.username).toBeTruthy()
            expect(player.score).toBe(0)
            expect(player.position).toBe(index)
            expect(typeof player.creationIndex).toBe('number')
          })
        }
      )
    })
    it('players.network', async () => {
      const tokens = await Promise.all([
        authenticatePlayer(initialPlayers[0].key),
        authenticatePlayer(initialPlayers[1].key),
        authenticatePlayer(initialPlayers[2].key),
        authenticatePlayer(initialPlayers[3].key),
        authenticatePlayer(initialPlayers[4].key),
        authenticatePlayer(initialPlayers[5].key),
      ])
      const token = tokens[0]
      const socials = {
        twitter: '@twitter',
        ownerKey: initialPlayers[0].key,
      }
      const shareConfig = true
      const mintConfig = 288
      await serverInject(
        {
          method: 'POST',
          url: '/configuration',
          payload: {
            shareConfig,
            socials,
            mintConfig,
          },
          headers: {
            Authorization: tokens[0],
          },
        },
        (err, response) => {
          const configuration = response.json()
          expect(err).toBeFalsy()
          expect(configuration.socials).toStrictEqual(socials)
          expect(configuration.mintConfig).toBe(mintConfig)
        }
      )
      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard?filter=288',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const players = response.json().network
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(players.players.length).toBe(1)
          expect(players.total).toBe(1)

          players.players.forEach((player, index) => {
            expect(player.username).toBeTruthy()
            expect(player.score).toBe(0)
            expect(player.position).toBe(index)
            expect(typeof player.creationIndex).toBe('number')
          })
        }
      )
    })
  })

  describe('should return leaderboard values for each entity AFTER INTERACTION', () => {
    it('players.global', async () => {
      const tokens = await Promise.all([
        authenticatePlayer(initialPlayers[0].key),
        authenticatePlayer(initialPlayers[1].key),
        authenticatePlayer(initialPlayers[2].key),
        authenticatePlayer(initialPlayers[3].key),
        authenticatePlayer(initialPlayers[4].key),
      ])

      const token = tokens[0]
      // Trade with player 1
      await serverInject(
        {
          method: 'POST',
          url: '/interactions',
          payload: {
            to: initialPlayers[1].key,
          },
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
        }
      )

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard?filter=288',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const players = response.json().global
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(players.players.length).toBe(5)
          expect(players.total).toBe(5)

          players.players.forEach(player => {
            expect(player.username).toBeTruthy()
            if (player.username === initialPlayers[1].username) {
              expect(player.score).toBe(800)
            } else {
              expect(player.score).toBe(0)
            }
            // expect(typeof player.position).toBe('number')
            // expect(player.position).toBe(index)
          })
        }
      )
    })
  })
  describe('should return correct values when PAGINATION params are given', () => {
    it('players.global', async () => {
      const tokens = await Promise.all([
        authenticatePlayer(initialPlayers[0].key),
        authenticatePlayer(initialPlayers[1].key),
        authenticatePlayer(initialPlayers[2].key),
        authenticatePlayer(initialPlayers[3].key),
        authenticatePlayer(initialPlayers[4].key),
      ])
      const token = tokens[0]

      let firstPlayer
      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard?filter=1&limit=1&offset=0',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
          expect(response.json().global.players.length).toBe(1)
          expect(response.json().global.total).toBe(5)
          firstPlayer = response.json().global.players[0]
        }
      )

      await authenticatePlayer(initialPlayers[5].key)

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard?filter=1&limit=1&offset=1',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
          expect(response.json().global.players.length).toBe(1)
          expect(response.json().global.total).toBe(6)
          expect(response.json().global.players[0].username).not.toBe(
            firstPlayer.username
          )
        }
      )
    })
  })
})
