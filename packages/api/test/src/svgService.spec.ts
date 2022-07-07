import { SvgService } from '../../src/svgService'

describe('svgService', () => {
  const attributes = {
    background: 'plain',
    birthDate: 1643880506,
    eggColor: 'gold',
    eyes: 'default',
    globalRanking: 1,
    guild: 'bobarian',
    guildRanking: 1,
    head: 'default',
    mintCostUsd: 123.45,
    mouth: 'default',
    object: 'none',
    outfit: 'default',
    rarity: 'legendary',
    score: 1234567,
  }
  const expectedSvg = ''
  const svg = SvgService.getSVG(attributes)
  console.log('expected svg', SvgService.getSVG(attributes))
  expect(svg).toStrictEqual(expectedSvg)
})
