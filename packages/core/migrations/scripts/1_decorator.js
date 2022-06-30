const fs = require('fs')
const { merge } = require("lodash")

const addresses = require('../addresses')
const package = require('../../package')
const settings = require('../settings')
const utils = require("../../scripts/utils")

const Wc3Decorator = artifacts.require("Wc3Decorator");

module.exports = async function (deployer, network) {
  network = network.split("-")[0]
  const realm = utils.getRealmNetworkFromArgs()[0]

  // If network was specified...
  if (network !== "test" && network !== "develop") {
    if (!addresses[network]) {
      // add network entry to addresses file, if not found:
      addresses[network] = {}
    }
    if (!addresses[network].Wc3Decorator) {
      // add decorator entry to addresses file, if not found:
      addresses[network].Wc3Decorator = ""
    }
    if (addresses[network].Wc3Decorator === "") {
      // deploy new instance if no address was found in addresses file:
      await deployer.deploy(
        Wc3Decorator,
        package.version,
        settings.common.baseURI,
        merge(settings.specs.default, settings.specs[realm]).guild
      )
      // add new address to file:
      addresses[network].Wc3Decorator = Wc3Decorator.address
      fs.writeFileSync(
        "./migrations/addresses.json",
        JSON.stringify(addresses, null, 4),
        { flag: 'w+' }
      )
    } else {
      // set decorator artifact to address found in file;
      Wc3Decorator.address = addresses[network].Wc3Decorator
      console.info("\n   > Skipped: presumably deployed at", Wc3Decorator.address)
    }
  }
  // If network was not specified...
  else {
    // always deploy a new instance:
    await deployer.deploy(
      Wc3Decorator,
      package.version,
      settings.common.baseURI,
      merge(settings.specs.default, settings.specs[realm]).guild
    );
  }
};
