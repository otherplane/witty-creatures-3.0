const { merge } = require("lodash")

module.exports = {
  common: {
    baseURI: "https://api-ethcc22.wittycreatures.com/",
    expirationBlocks: 0,
    percentiles: [ 10, 30, 60 ],
    // signator: "",
    totalEggs: 1250
  },
  specs: {
    default: {
      guild: "Ethereum",
      currencySymbol: "ETH",
      mintGasLimit: 250000,
    },
    polygon: {
      guild: "Polygon",
      currencySymbol: "MATIC",
    },
  },
  compilers: {
    default: {
      solc: {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
        outputSelection: {
          "*": {
            "*": ["evm.bytecode"],
          },
        },
      },
    },
  },
  networks: merge(
    require("witnet-solidity-bridge/migrations/witnet.settings").networks, {
      default: {
        "ethereum.mainnet": {
          skipDryRun: true,
          confirmations: 2,
        }
      },
    }
  )
}
