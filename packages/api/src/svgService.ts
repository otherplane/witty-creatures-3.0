import { Award } from './types'
import { THEME_COLORS } from './constants'

import BackgroundHell from './assets/background-hell'
import BackgroundParis from './assets/background-paris'
import BackgroundSpace from './assets/background-space'
import BackgroundStonks from './assets/background-stonks'
import BackgroundVaporwave from './assets/background-vaporwave'
import EyesDealwithit from './assets/eyes-dealwithit'
import EyesDefault from './assets/eyes-default'
import EyesLaser from './assets/eyes-laser'
import EyesLashes from './assets/eyes-lashes'
import EyesMakeup from './assets/eyes-makeup'
import EyesMonocle from './assets/eyes-monocle'
import EyesPirate from './assets/eyes-pirate'
import EyesShades from './assets/eyes-shades'
import EyesWink from './assets/eyes-wink'
import HeadAfro from './assets/head-afro'
import HeadAnime from './assets/head-anime'
import HeadCap from './assets/head-cap'
import HeadDefault from './assets/head-default'
import HeadFancy from './assets/head-fancy'
import HeadMage from './assets/head-mage'
import HeadMohawk from './assets/head-mohawk'
import HeadPink from './assets/head-pink'
import HeadPonytail from './assets/head-ponytail'
import HeadSanta from './assets/head-santa'
import HeadWig from './assets/head-wig'
import MouthBored from './assets/mouth-bored'
import MouthDefault from './assets/mouth-default'
import MouthJoint from './assets/mouth-joint'
import MouthLips from './assets/mouth-lips'
import MouthMoustache from './assets/mouth-moustache'
import MouthRainbow from './assets/mouth-rainbow'
import MouthSmile from './assets/mouth-smile'
import ObjectBeer from './assets/object-beer'
import ObjectBitcoin from './assets/object-bitcoin'
import ObjectCroissant from './assets/object-croissant'
import ObjectDice from './assets/object-dice'
import ObjectEther from './assets/object-ether'
import ObjectFlame from './assets/object-flame'
import ObjectLipstick from './assets/object-lipstick'
import ObjectMule from './assets/object-mule'
import ObjectPhone from './assets/object-phone'
import ObjectWine from './assets/object-wine'
import OutfitDefault from './assets/outfit-default'
import OutfitGown from './assets/outfit-gown'
import OutfitMage from './assets/outfit-mage'
import OutfitSanta from './assets/outfit-santa'
import OutfitTiedye from './assets/outfit-tiedye'
import OutfitTuxedo from './assets/outfit-tuxedo'

const nameToSvg: Record<string, string> = {
  'background-hell': BackgroundHell,
  'background-paris': BackgroundParis,
  'background-space': BackgroundSpace,
  'background-stonks': BackgroundStonks,
  'background-vaporwave': BackgroundVaporwave,
  'eyes-dealwithit': EyesDealwithit,
  'eyes-default': EyesDefault,
  'eyes-laser': EyesLaser,
  'eyes-lashes': EyesLashes,
  'eyes-makeup': EyesMakeup,
  'eyes-monocle': EyesMonocle,
  'eyes-pirate': EyesPirate,
  'eyes-shades': EyesShades,
  'eyes-wink': EyesWink,
  'head-afro': HeadAfro,
  'head-anime': HeadAnime,
  'head-cap': HeadCap,
  'head-default': HeadDefault,
  'head-fancy': HeadFancy,
  'head-mage': HeadMage,
  'head-mohawk': HeadMohawk,
  'head-pink': HeadPink,
  'head-ponytail': HeadPonytail,
  'head-santa': HeadSanta,
  'head-wig': HeadWig,
  'mouth-bored': MouthBored,
  'mouth-default': MouthDefault,
  'mouth-joint': MouthJoint,
  'mouth-lips': MouthLips,
  'mouth-moustache': MouthMoustache,
  'mouth-rainbow': MouthRainbow,
  'mouth-smile': MouthSmile,
  'object-beer': ObjectBeer,
  'object-bitcoin': ObjectBitcoin,
  'object-croissant': ObjectCroissant,
  'object-dice': ObjectDice,
  'object-ether': ObjectEther,
  'object-flame': ObjectFlame,
  'object-lipstick': ObjectLipstick,
  'object-mule': ObjectMule,
  'object-phone': ObjectPhone,
  'object-wine': ObjectWine,
  'outfit-default': OutfitDefault,
  'outfit-gown': OutfitGown,
  'outfit-mage': OutfitMage,
  'outfit-santa': OutfitSanta,
  'outfit-tiedye': OutfitTiedye,
  'outfit-tuxedo': OutfitTuxedo,
}

export class SvgService {
  static getSVG(traits: Award): string {
    const svgTraits = {
      mouth: nameToSvg['mouth-' + traits.mouth],
      background: nameToSvg['background-' + traits.background],
      eyes: nameToSvg['eyes-' + traits.eyes],
      object: nameToSvg['object-' + traits.object],
      outfit: nameToSvg['outfit-' + traits.outfit],
      head: nameToSvg['head-' + traits.head],
    }

    const background: string =
      svgTraits.background ||
      `<rect width="1000" height="1000" fill="${
          THEME_COLORS[traits.eggColor]
      }"/>`

    return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="1000" viewBox="0 0 1000 1000">${background}${svgTraits.outfit}${svgTraits.head}${svgTraits.mouth}${svgTraits.eyes}${svgTraits.object}</svg>`
  }
}
