import { authenticatePlayer, initialPlayers, serverInject } from '../../setup'

describe('Route /configuration', () => {
  describe('should save configuration given', () => {
    it('returns given socials', async () => {
      const token = await authenticatePlayer(initialPlayers[0].key)
      const socials = {
        twitter: '@twitter',
        ownerKey: initialPlayers[0].key,
      }
      const shareConfig = true
      const mintConfig = 'boba'
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
            Authorization: token,
          },
        },
        (err, response) => {
          const configuration = response.json()
          expect(err).toBeFalsy()
          expect(configuration.socials).toStrictEqual(socials)
          expect(configuration.mintConfig).toBe(mintConfig)
        }
      )
    })
  })
})
