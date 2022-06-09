import { authenticatePlayer, initialPlayers, serverInject } from '../../setup'

describe.skip('Route /configuration', () => {
  describe('should save configuration given', () => {
    it('returns given socials', async () => {
      const token = await authenticatePlayer(initialPlayers[0].key)
      const socials = {
        twitter: '@twitter',
        share: true,
      }
      const mintConfig = 'boba'
      await serverInject(
        {
          method: 'POST',
          url: '/configuration',
          payload: {
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
          expect(configuration.socials).toBe(socials)
          expect(configuration.mintConfig).toBe(mintConfig)
          console.log(configuration)
        }
      )
    })
  })
})
