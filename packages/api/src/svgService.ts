import { Award } from './types'

import Mouth1 from './assets/mouth'
import Mouth2 from './assets/mouth'
import Mouth3 from './assets/mouth'
import Mouth4 from './assets/mouth'

import Eyes1 from './assets/eyes'
import Eyes2 from './assets/eyes'
import Eyes3 from './assets/eyes'
import Eyes4 from './assets/eyes'

import Head1 from './assets/head'
import Head2 from './assets/head'
import Head3 from './assets/head'
import Head4 from './assets/head'

import Clothes1 from './assets/clothes'
import Clothes2 from './assets/clothes'
import Clothes3 from './assets/clothes'
import Clothes4 from './assets/clothes'

import Object1 from './assets/object'
import Object2 from './assets/object'
import Object3 from './assets/object'
import Object4 from './assets/object'

import Background1 from './assets/background'
import Background2 from './assets/background'
import Background3 from './assets/background'
import Background4 from './assets/background'

const mouthNameToSvg: Record<string, any> = {
  'bored-mouth': Mouth1,
  'mouth-2': Mouth2,
  'mouth-3': Mouth3,
  'mouth-4': Mouth4,
}
const eyesNameToSvg: Record<string, any> = {
  default: Eyes1,
  'eyes-2': Eyes2,
  'eyes-3': Eyes3,
  'eyes-4': Eyes4,
}
const headNameToSvg: Record<string, any> = {
  default: Head1,
  'head-2': Head2,
  'head-3': Head3,
  'head-4': Head4,
}
const clothesNameToSvg: Record<string, any> = {
  default: Clothes1,
  'clothes-2': Clothes2,
  'clothes-3': Clothes3,
  'clothes-4': Clothes4,
}
const objectNameToSvg: Record<string, any> = {
  default: Object1,
  'object-2': Object2,
  'object-3': Object3,
  'object-4': Object4,
}
const backgroundNameToSvg: Record<string, any> = {
  Plane: Background1,
  'backgound-2': Background2,
  'backgound-3': Background3,
  'backgound-4': Background4,
}

export class SvgService {
  static getSVG(traits: Award): string {
    const svgTraits = {
      mouth: mouthNameToSvg[traits.mouth],
      background: backgroundNameToSvg[traits.background],
      eyes: eyesNameToSvg[traits.eyes],
      object: objectNameToSvg[traits.object],
      outfit: clothesNameToSvg[traits.outfit],
      head: headNameToSvg[traits.head],
    }
    const background = svgTraits.background
      ? svgTraits.background
      : `<linearGradient id="paint0_linear_268_14" x1="266.5" y1="0" x2="266.5" y2="514" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FA0909" stop-opacity="0.36"/>
    <stop offset="0.239583" stop-color="#F0AC45" stop-opacity="0.4"/>
    <stop offset="0.432292" stop-color="#E8EA6D" stop-opacity="0.38"/>
    <stop offset="0.619792" stop-color="#94E493" stop-opacity="0.44"/>
    <stop offset="0.8125" stop-color="#00E0FF" stop-opacity="0.4"/>
    <stop offset="1" stop-color="#0500FF" stop-opacity="0.38"/>
    </linearGradient>`
    const svg1 = `<svg width="533" height="514" viewBox="0 0 533 514" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="533" height="514" fill="url(#paint0_linear_268_14)"/>
    <g id="clothes">
    ${svgTraits.outfit}
    </g>
    <g id="head">
    ${svgTraits.head}
    </g>
    <g id="eyes">
    ${svgTraits.eyes}
    </g>
    <g id="object">
    ${svgTraits.object}
    </g>
    <g id="mouth">
    ${svgTraits.mouth}
    </g>
    <defs>
    <g id="background">
    ${background}
    </g>
    </defs>
    </svg>`
    return svg1
  }
}
