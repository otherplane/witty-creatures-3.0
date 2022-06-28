import {
  authenticatePlayer,
  server,
  serverInject,
  initialPlayers,
} from '../../setup'

const VALID_ETH_ADDRESS = '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71'
const VALID_ETH_ADDRESS_2 = '0x784cc5908e1a3d29b4d31df67d99622c4baa7b71'
// Keccak256 digest for mint with VALID_ETH_ADDRESS and

const MESSAGE_DIGEST =
  'df4eea1da897bfd3d163b324a1a14c5b0a54e0467e9e503e87c746e0e7941863'
const MESSAGE_DIGEST_2 =
  '72192c7b10025f02332cf60f5e922981e644a14f4d27902676950e8677ff50c3'

const INVALID_ETH_ADDRESS_1 = '0x00'
const INVALID_ETH_ADDRESS_2 = 'foo'

describe('mint.ts', () => {
  it('should mint a claimed egg', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
        expect(responseJson.data.address).toStrictEqual(VALID_ETH_ADDRESS)
      }
    )
  })

  it.skip('should NOT mint an egg with invalid address', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: INVALID_ETH_ADDRESS_1 },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: INVALID_ETH_ADDRESS_2 },
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

  it.skip('should NOT mint an egg with an invalid token', async () => {
    const token = 'foo'

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().message).toBe('Forbidden: invalid token')
      }
    )
  })

  it.skip('should NOT mint an egg before the mint timestamp', async () => {
    // TODO: This test will fail because the timestamp validation is disabled (otherwise the other tests break)
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
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

  it.skip('should cache mint result when called a second time', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
      }
    )

    // Claim again
    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
      }
    )
  })

  it.skip('should allow to change address when called a second time', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
      }
    )

    // Claim again
    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS_2 },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        // The message hash must change because the address is part of the signed message
        expect(responseJson.envelopedSignature.messageHash).toBe(
          MESSAGE_DIGEST_2
        )
        expect(responseJson.data.address).toBe(VALID_ETH_ADDRESS_2)
      }
    )
  })
})
