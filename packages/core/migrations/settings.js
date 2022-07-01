const { merge } = require("lodash")

module.exports = {
  common: {
    baseURI: "https://api-ethcc22.wittycreatures.com/",
    colors: [ "Green", "Black", "Red", "Gold", "Blue", ],
    expirationBlocks: 0,
    percentiles: [ 10, 30, 60 ],
    // signator: "",
    totalEggs: 1250
  },
  specs: {
    default: {
      guild: "Ethereum",
      mintGasLimit: 250000,
      usdPriceCaption: "Price-ETH/USD-6",
      traitTags: {
        backgrounds: [
          "Tron",
          "Outer space",
          "Eiffel tower",
          "Hell fire",
          "Blue sky",
          "Heavy storm",
        ],
        eyes: [
          "Pixel glasses",
          "Laser eyes",
          "Winking eyes",
          "Angry eyes",
          "Happy eyes",
          "Harpo eyes",
          "Smirking eyes",
          "Monocle eyes",
          "Pirate patch",
        ],
        heads: [
          "Combed back",
          "Top hat",
          "Deadlocks",
          "Punk hair",
          "Curly hair",
          "Up-only cap",
          "Down-bad cap",
        ],
        mouths: [
          "Smiling",
          "Angry mouth",
          "Smoking",
          "Fire puke",
          "Bored mouth",
          "Rainbow puke",
          "Dali moustache"
        ],
        objects: [
          "Flames",
          "Laptop",
          "Dice",
          "Wine cup",
          "Beer pint",
          "Moscow-mule mug",
          "Croissant",
        ],
        outfits: [
          "Tuxedo",
          "Tie-dye shirt",
          "Wizard robe",
          "Egyptian",
          "Santa suit",
          "Hallowen",
          "Faralaes",
        ]
      },
    },
    },
    polygon: {
      guild: "Polygon",
      usdPriceCaption: "Price-MATIC/USD-6",
      traitTags: {
        backgrounds: [ "Polygon" ],
      },
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
      polygon: {
        "polygon.goerli": {
          gasPrice: 50 * 10 ** 9,
          confirmations: 2,
        }
      }
    }
  )
}
