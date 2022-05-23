import {
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  INTERACTION_POINTS,
  INTERACTION_POINTS_DIVISOR,
} from '../../../src/constants'
import {
  authenticatePlayer,
  initialPlayers,
  serverInject,
  sleep,
} from '../../setup'

describe.skip('Route /interaction', () => {
  it('should return the interaction object after interact with itself', async () => {
    // Before test: Claim a player
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[0].key,
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().to).toBe(initialPlayers[0].username)
        expect(response.json().from).toBe(initialPlayers[0].username)
        expect(response.json().timestamp).toBeTruthy()
        expect(response.json().ends).toBe(
          response.json().timestamp + INTERACTION_DURATION_MILLIS
        )
        expect(response.json().resource.amount).toBe(INTERACTION_POINTS)
        expect(response.json().resource.trait).toBe('vigor')
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(
          response
            .json()
            .ranch.bufficorns.find(
              (bufficorn) => bufficorn.name === 'Bufficorn-0'
            ).vigor
        ).toBe(INTERACTION_POINTS)
      }
    )
  })

  it('should sum points bufficorn after feed', async () => {
    const bufficornName = 'Bufficorn-6'

    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: bufficornName,
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().resource.amount).toBe(INTERACTION_POINTS)
        expect(response.json().resource.trait).toBe('speed')
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const bufficorn = response
          .json()
          .ranch.bufficorns.find(
            (bufficorn) => bufficorn.name === bufficornName
          )
        expect(
          response
            .json()
            .ranch.bufficorns.find(
              (bufficorn) => bufficorn.name === bufficornName
            ).speed
        ).toBe(INTERACTION_POINTS)
      }
    )
  })

  it('should sum less points if incubated several times', async () => {
    const bufficornName = 'Bufficorn-0'

    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().to).toBe(initialPlayers[1].username)
        expect(response.json().from).toBe(initialPlayers[0].username)
        expect(response.json().timestamp).toBeTruthy()
        expect(response.json().ends).toBe(
          response.json().timestamp + INTERACTION_DURATION_MILLIS
        )
        expect(response.json().resource.amount).toBe(INTERACTION_POINTS)
        expect(response.json().resource.trait).toBe('speed')
      }
    )

    await sleep(INTERACTION_COOLDOWN_MILLIS)

    const secondIncubationPoints = Math.ceil(
      INTERACTION_POINTS / INTERACTION_POINTS_DIVISOR
    )
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: bufficornName,
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().to).toBe(initialPlayers[1].username)
        expect(response.json().from).toBe(initialPlayers[0].username)
        expect(response.json().timestamp).toBeTruthy()
        expect(response.json().ends).toBe(
          response.json().timestamp + INTERACTION_DURATION_MILLIS
        )
        expect(response.json().resource.amount).toBe(secondIncubationPoints)
        expect(response.json().resource.trait).toBe('speed')
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )

        expect(
          response
            .json()
            .ranch.bufficorns.find(
              (bufficorn) => bufficorn.name === bufficornName
            ).speed
        ).toBe(INTERACTION_POINTS + secondIncubationPoints)
      }
    )
  })

  it('should NOT INTERACT if invalid token (check 1)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[0].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: 'invalid',
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  // TODO: get valid token
  it('should NOT interact resources if valid token but for non existent player (check 2)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: 'inexistent',
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: '',
        },
      },
      (err, response) => {
        expect(err)
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  test('should NOT INTERACT if player has not claimed its own player (check 3)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[1].key,
        },
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2MzI5MzI0NjN9.Koji-yz6dQyYpsGgRKiN_PEM-nvTQqXtP8Mx8icIHYQ',
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT interact if target player does not exist (check 4)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: 'foo-bar',
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(404)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })


  it('should NOT interact if target player does not exist (check 5)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT interact if FROM player is already interacting with other player(check 6)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)

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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT interact if target player is already interacting (check 7)', async () => {
    const token1 = await authenticatePlayer(initialPlayers[0].key)
    const token2 = await authenticatePlayer(initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[0].key,
        },
        headers: {
          Authorization: token1,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[0].key,
        },
        headers: {
          Authorization: token2,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  test('should NOT interact if cooldown has not elapsed (check 8)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)

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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await sleep(INTERACTION_DURATION_MILLIS)

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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await sleep(INTERACTION_COOLDOWN_MILLIS)

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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
      }
    )
  })
})