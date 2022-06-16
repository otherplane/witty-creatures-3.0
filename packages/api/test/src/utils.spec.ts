import { checkEmptySocials } from '../../src/utils'

describe('checkEmptySocials', () => {
  it('return null if non key values are empty', async () => {
    const socials = {
      twitter: undefined,
      discord: undefined,
      telegram: undefined,
      name: null,
      company: '',
      ownerKey: 'key',
    }
    expect(checkEmptySocials(socials)).toBe(null)
  })
  it('returns value if it exist', async () => {
    const socials = {
      twitter: undefined,
      discord: undefined,
      telegram: undefined,
      name: undefined,
      company: 'company',
      ownerKey: 'key',
    }
    const expectedSocials = {
      twitter: undefined,
      discord: undefined,
      telegram: undefined,
      name: undefined,
      company: 'company',
      ownerKey: 'key',
    }
    expect(checkEmptySocials(socials)).toStrictEqual(expectedSocials)
  })
})
