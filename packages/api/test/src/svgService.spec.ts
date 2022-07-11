import { SvgService } from '../../src/svgService'

describe('svgService', () => {
  it('return the correct svg string', async () => {
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
    const expectedSvg = `<svg width="533" height="514" viewBox="0 0 533 514" fill="none" xmlns="http://www.w3.org/2000/svg">    <rect width="533" height="514" fill="#F18944"/>    <g id="clothes">    <ellipse cx="266.5" cy="374" rx="88.5" ry="92" fill="#FF0000"></ellipse>    </g>    <g id="head">    <ellipse cx="266.5" cy="165" rx="88.5" ry="92" fill="#FFDD22"></ellipse>    </g>    <g id="eyes">    <circle id="Ellipse 20" cx="240.4" cy="129.4" r="14.4" fill="white"></circle><circle id="Ellipse 21" cx="293.4" cy="129.4" r="14.4" fill="white"></circle><circle id="Ellipse 23" cx="293.1" cy="135.1" r="8.1" fill="#020203"></circle><circle id="Ellipse 22" cx="240" cy="135" r="9" fill="black"></circle>    </g>    <g id="object">    undefined    </g>    <g id="mouth">    undefined    </g>    <defs>    <g id="background">    undefined    </g>    </defs>    </svg>`
    const svg = SvgService.getSVG(attributes).replace(/\n/g, '')
    console.log('expected svg', SvgService.getSVG(attributes))
    expect(svg).toStrictEqual(expectedSvg)
  })
})
