import { authenticatePlayer, initialPlayers, serverInject } from '../../setup'

describe('Route /leaderboard', () => {
  describe('should return leaderboard values for each entity', () => {

    it('players', async () => {
      jest.setTimeout(15000)
      const token = await authenticatePlayer(initialPlayers[0].key)
      await authenticatePlayer(initialPlayers[1].key)
      await authenticatePlayer(initialPlayers[2].key)
      await authenticatePlayer(initialPlayers[3].key)
      await authenticatePlayer(initialPlayers[4].key)
      await authenticatePlayer(initialPlayers[5].key)

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const players = response.json().players
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
  })

  describe('should return leaderboard values for each entity AFTER INTERACTION', () => {

    it('players', async () => {
      jest.setTimeout(15000)
      const token0 = await authenticatePlayer(initialPlayers[0].key)
      await authenticatePlayer(initialPlayers[1].key)
      await authenticatePlayer(initialPlayers[2].key)
      await authenticatePlayer(initialPlayers[3].key)
      await authenticatePlayer(initialPlayers[4].key)

      // Trade with player 1
      await serverInject(
        {
          method: 'POST',
          url: '/interactions',
          payload: {
            to: initialPlayers[1].key,
          },
          headers: {
            Authorization: token0,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
        }
      )

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token0,
          },
        },
        (err, response) => {
          const players = response.json().players
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(players.players.length).toBe(5)
          expect(players.total).toBe(5)

          players.players.forEach((player, index) => {
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

  it('should return correct values when PAGINATION params are given', async () => {
    jest.setTimeout(15000)
    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)
    await authenticatePlayer(initialPlayers[2].key)
    await authenticatePlayer(initialPlayers[3].key)
    await authenticatePlayer(initialPlayers[4].key)

    let firstPlayer
    await serverInject(
      {
        method: 'GET',
        url: '/leaderboard?limit=1&offset=0',
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(response.statusCode).toBe(200)
        expect(response.json().players.players.length).toBe(1)
        expect(response.json().players.total).toBe(5)
        firstPlayer = response.json().players.players[0]
      }
    )

    await authenticatePlayer(initialPlayers[5].key)

    await serverInject(
      {
        method: 'GET',
        url: '/leaderboard?limit=1&offset=1',
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(response.statusCode).toBe(200)
        expect(response.json().players.players.length).toBe(1)
        expect(response.json().players.total).toBe(6)
        expect(response.json().players.players[0].username).not.toBe(
          firstPlayer.username
        )
      }
    )
  })
})