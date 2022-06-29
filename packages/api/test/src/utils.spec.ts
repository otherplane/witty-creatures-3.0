import { checkEmptySocials, normalizedAttributes } from '../../src/utils'

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

describe('normalizedAttributes', () => {
  const metadata = {
    name: 'Bobarian Calm Bison',
    description: "Witty Creature #{index} at EthCC'5 (Paris), 2022.",
    external_url:
      'https://api-ethcc22.wittycreatures.com/metadata/{guildRanking}',
    image: 'https://api-ethcc22.wittycreatures.com/image/{guildRanking}',
    attributes: [
      {
        display_type: 'date',
        trait_type: 'Birth date',
        value: 1643880506,
      },
      {
        trait_type: 'Egg color',
        value: 'Gold',
      },
      {
        display_type: 'number',
        trait_type: 'Global ranking',
        value: 1,
      },
      {
        trait_type: 'Guild',
        value: 'Bobarian',
      },
      {
        display_type: 'number',
        trait_type: 'Guild ranking',
        value: 1,
      },
      {
        trait_type: 'Mint cost (USD)',
        value: 123.45,
      },

      {
        trait_type: 'Rarity',
        value: 'Legendary',
      },
      {
        trait_type: 'Score',
        value: 1234567,
      },
      {
        trait_type: 'Background',
        value: 'Plain',
      },
      {
        trait_type: 'Eyes',
        value: 'Default',
      },
      {
        trait_type: 'Head',
        value: 'Default',
      },
      {
        trait_type: 'Object',
        value: 'None',
      },
      {
        trait_type: 'Outfit',
        value: 'Default',
      },
      {
        trait_type: 'Mouth',
        value: 'Default',
      },
    ],
  }
  const expectedTraits = {
    background: 'plain',
    birthDate: 1643880506,
    eggColor: 'gold',
    eyes: 'default',
    globalRanking: 1,
    guild: 'bobarian',
    guildRanking: 1,
    head: 'default',
    mintCostUSD: 123.45,
    mouth: 'default',
    object: 'none',
    outfit: 'default',
    rarity: 'legendary',
    score: 1234567,
  }
  expect(normalizedAttributes(metadata.attributes)).toStrictEqual(
    expectedTraits
  )
})
