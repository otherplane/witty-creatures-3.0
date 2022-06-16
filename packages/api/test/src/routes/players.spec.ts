import { authenticatePlayer, serverInject, initialPlayers } from '../../setup'
import {
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
} from '../../../src/constants'

import { sleep } from '../../setup'

describe('player.ts', () => {
  it('should NOT get PLAYER #1 - no authorization header', async () => {
    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
      },
      (err, response) => {
        expect(response?.json().message).toBe(
          `headers should have required property 'authorization'`
        )
      }
    )
  })

  it('should NOT get PLAYER #1 - invalid jwt token', async () => {
    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: 'foo',
        },
      },
      (err, response) => {
        expect(response?.json().message).toBe('Forbidden: invalid token')
      }
    )
  })

  it('should NOT get PLAYER#1 - valid token for PLAYER #2', async () => {
    const [, token] = await Promise.all([
      authenticatePlayer(initialPlayers[0].key),
      authenticatePlayer(initialPlayers[1].key),
    ])

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
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  test('should NOT get PLAYER #12345 - valid token but non-existent player', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'GET',
        url: '/players/12345',
        headers: {
          Authorization: token,
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

  it('should get PLAYER #1 - get after claimed', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        const { key, username, score, nft } = response.json().player

        const { lastInteractionIn, lastInteractionOut } = response.json()

        expect(key).toBeTruthy()
        expect(username).toBeTruthy()
        expect(score).toBe(0)
        expect(lastInteractionIn).toBe(null)
        expect(lastInteractionOut).toBe(null)
        expect(nft).toStrictEqual([])
      }
    )
  })
})

describe('Route /contacts', () => {
  it('should get the listed contacts', async () => {
    const [token0, token1] = await Promise.all([
      authenticatePlayer(initialPlayers[0].key),
      authenticatePlayer(initialPlayers[1].key),
    ])

    const socials = {
      ownerKey: initialPlayers[0].key,
      twitter: '@twitter',
    }
    const mintConfig = 'boba'
    const shareConfig = true

    await serverInject(
      {
        method: 'POST',
        url: '/configuration',
        payload: {
          socials,
          shareConfig,
          mintConfig,
        },
        headers: {
          Authorization: token0,
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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: '/contacts',
        headers: {
          Authorization: token1,
        },
      },
      (err, response) => {
        const contacts = response.json()
        expect(err).toBeFalsy()
        expect(contacts.contacts.contacts[0].ownerKey).toBe(socials.ownerKey)
        expect(contacts.contacts.contacts[0].twitter).toBe(socials.twitter)
        expect(contacts.contacts.total).toBe(1)
      }
    )
  })
  it(
    'should avoid adding repeated contacts',
    async () => {
      const [token0, token1] = await Promise.all([
        authenticatePlayer(initialPlayers[0].key),
        authenticatePlayer(initialPlayers[1].key),
      ])

      const socials = {
        ownerKey: initialPlayers[0].key,
        twitter: '@twitter',
      }
      const mintConfig = 'boba'
      const shareConfig = true

      await serverInject(
        {
          method: 'POST',
          url: '/configuration',
          payload: {
            socials,
            shareConfig,
            mintConfig,
          },
          headers: {
            Authorization: token0,
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
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
        }
      )

      await sleep(INTERACTION_DURATION_MILLIS + INTERACTION_DURATION_MILLIS)

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
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
        }
      )

      await serverInject(
        {
          method: 'GET',
          url: '/contacts',
          headers: {
            Authorization: token1,
          },
        },
        (err, response) => {
          const contacts = response.json()
          expect(err).toBeFalsy()
          expect(contacts.contacts.contacts[0].ownerKey).toBe(socials.ownerKey)
          expect(contacts.contacts.contacts[0].twitter).toBe(socials.twitter)
          expect(contacts.contacts.total).toBe(1)
        }
      )
    },
    (INTERACTION_COOLDOWN_MILLIS + INTERACTION_DURATION_MILLIS) * 1.2
  )
})
