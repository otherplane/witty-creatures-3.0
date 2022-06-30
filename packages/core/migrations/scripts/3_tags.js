const fs = require("fs")
const { merge } = require("lodash")

const settings = require("../settings")
const utils = require("../../scripts/utils");

const Wc3Decorator = artifacts.require("Wc3Decorator");

module.exports = async function (_deployer) {
  const decorator = await Wc3Decorator.deployed()
  const forged = await decorator.forged()
  if (forged) {
    console.info(`\n   > Forged tags for guild ${await decorator.getGuildName()}:`)
    console.info(  "     >> Backgrounds:", JSON.stringify(await decorator.getBackgrounds()))
    console.info(  "     >> Colors:", JSON.stringify(await decorator.getColors()))
    console.info(  "     >> Eyes:", JSON.stringify(await decorator.getEyes()))
    console.info(  "     >> Heads:", JSON.stringify(await decorator.getHeads()))
    console.info(  "     >> Mouths:", JSON.stringify(await decorator.getMouths()))
    console.info(  "     >> Objects:", JSON.stringify(await decorator.getObjects()))
    console.info(  "     >> Outfits:", JSON.stringify(await decorator.getOutfits()))
  } else {
    console.info(`\n   > Decorating tags for guild ${await decorator.getGuildName()}:`)
    const realm = utils.getRealmNetworkFromArgs()[0]
    const specs = merge(settings.specs.default, settings.specs[realm])
    const ranges = await decorator.ranges()
    if (ranges.totalBackgrounds.toNumber() !== specs.backgrounds.length) {
      console.info(`     >> Setting backgrounds: ${specs.backgrounds}...`)
      await decorator.setBackgrounds(specs.backgrounds)
    } else {
      console.info(  "     >> Backgrounds:", JSON.stringify(await decorator.getBackgrounds()))
    }
    if (ranges.totalColors.toNumber() !== settings.common.colors.length ) {
      console.info(`     >> Setting colors: ${settings.common.colors}...`)
      await decorator.setColors(settings.common.colors)
    } else {
      console.info(  "     >> Colors:", JSON.stringify(await decorator.getColors()))
    }
    if (ranges.totalEyes.toNumber() !== specs.eyes.length) {
      console.info(`     >> Setting eyes: ${specs.eyes}...`)
      await decorator.setEyes(specs.eyes)
    } else {
      console.info(  "     >> Eyes:", JSON.stringify(await decorator.getEyes()))
    }
    if (ranges.totalHeads.toNumber() !== specs.heads.length) {
      console.info(`     >> Setting heads: ${specs.heads}...`)
      await decorator.setHeads(specs.heads)
    } else {
      console.info(  "     >> Heads:", JSON.stringify(await decorator.getHeads()))
    }
    if (ranges.totalMouths.toNumber() !== specs.mouths.length) {
      console.info(`     >> Setting mouths: ${specs.mouths}...`)
      await decorator.setMouths(specs.mouths)
    } else {
      console.info(  "     >> Mouths:", JSON.stringify(await decorator.getMouths()))
    }
    if (ranges.totalObjects.toNumber() !== specs.objects.length) {
      console.info(`     >> Setting objects: ${specs.objects}...`)
      await decorator.setObjects(specs.objects)
    } else {
      console.info(  "     >> Objects:", JSON.stringify(await decorator.getObjects()))
    }
    if (ranges.totalOutfits.toNumber() !== specs.outfits.length) {
      console.info(`     >> Setting outfits: ${specs.outfits}...`)
      await decorator.setOutfits(specs.outfits)
    } else {
      console.info(  "     >> Outfits:", JSON.stringify(await decorator.getOutfits()))
    }
  }
};
