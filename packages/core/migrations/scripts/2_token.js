const fs = require("fs")
const { merge } = require("lodash")

const addresses = require("../addresses")
const package = require("../../package")
const settings = require("../settings")
const utils = require("../../scripts/utils")

const Wc3Token = artifacts.require("Wc3Token");
const Wc3Decorator = artifacts.require("Wc3Decorator");
const WitnetPriceRouter = artifacts.require("IWitnetPriceRouter")
const WitnetRandomness = artifacts.require("IWitnetRandomness")

module.exports = async function (deployer, network, accounts) {  
  network = network.split("-")[0]
  const realm = utils.getRealmNetworkFromArgs()[0]

  // If a network name is specified...
  if (network !== "test" && network !== "develop" && network !== "development") {
    // read Witnet addresses from imported file
    if (!addresses[network]) {
      addresses[network] = {}
    }
    if (!addresses[network].Wc3Token) {
      addresses[network].Wc3Token = ""
    }
    const witnet = require("witnet-solidity-bridge/migrations/witnet.addresses")
    WitnetPriceRouter.address = witnet[realm][network].WitnetPriceRouter
    WitnetRandomness.address = witnet[realm][network].WitnetRandomness
    console.info("\n   > Using WitnetPriceRouter at", WitnetPriceRouter.address)
    console.info("   > Using WitnetRandomness at", WitnetRandomness.address)
  }
  // If no network name is specified...
  else {
    // deploy randomizer mock:
    const WitnetRandomnessMock = artifacts.require("WitnetRandomnessMock")
    if (!WitnetRandomnessMock.isDeployed()) {
      await deployer.deploy(
        WitnetRandomnessMock,
        /* _mockRandomizeLatencyBlocks */ 2,
        /* _mockRandomizeFee */ 10 ** 10,
      )
    }
    
    // deploy router mock:
    const WitnetPriceRouterMock = artifacts.require("WitnetPriceRouterMock")
    if (!WitnetPriceRouterMock.isDeployed()) {
      await deployer.deploy(
        WitnetPriceRouterMock,
        /* _caption */ `Price-${settings.specs.default.currencySymbol}/USD-6`,
        /* _price   */ 123456789, // $ 123,456789
      )
    }

    // set artifacts addresses:
    WitnetPriceRouter.address = WitnetPriceRouterMock.address;
    WitnetRandomness.address = WitnetRandomnessMock.address;    
    console.info("\n   > Using WitnetPriceRouter mock at", WitnetPriceRouter.address)
    console.info("   > Using WitnetRandomness mock at", WitnetRandomness.address)
  }
  console.info("   > Using Wc3Decorator at", Wc3Decorator.address)
  
  // If no specs network is set, or no token address is found...
  if (network === "test" || network === "develop" || network === "development" || addresses[network].Wc3Token === "") {
    // deploy the non-fungible token contract:
    const specs = merge(settings.specs.default, settings.specs[realm])
    await deployer.deploy(
      Wc3Token,
      package.version,
      WitnetRandomness.address,
      WitnetPriceRouter.address,
      Wc3Decorator.address,
      settings.common.signator || accounts[0],
      settings.common.percentiles,
      settings.common.expirationBlocks,
      settings.common.totalEggs,      
      specs.currencySymbol,
      specs.mintGasLimit,
    )
    if (network !== "test" && network !== "develop") {
      addresses[network].Wc3Token = Wc3Token.address
      fs.writeFileSync(
        "./migrations/addresses.json",
        JSON.stringify(addresses, null, 4), { flag: 'w+' }
      )
    }
    console.info("   >> Deployed at", Wc3Token.address)
  } else {
    console.info("\n   > Skipped: presumably deployed at", addresses[network].Wc3Token)
  }

  // Check if token's decorator needs to be upgraded:
  const token = await Wc3Token.at(addresses[network]?.Wc3Token || Wc3Token.address)
  const decoratorAddr = await token.decorator()
  if (decoratorAddr !== Wc3Decorator.address) {
    await token.setDecorator(Wc3Decorator.address)
    console.info(`   > Upgraded token's decorator to ${Wc3Decorator.address}`)
  }
};
