const { merge } = require("lodash")

module.exports = {
  common: {
    baseURI: "https://api-ethcc22.wittycreatures.com/",
    colors: [ "Emerald", "Obsidian", "Ruby", "Gold", "Zaphire", ],
    expirationBlocks: 0,
    percentiles: [ 10, 30, 60 ],
    // signator: "",
    totalEggs: 1250
  },
  specs: {
    default: {
      guild: "Ethereum",
      mintGasOverhead: 69320,
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
    boba: {
      guild: "Boba Networks",
      usdPriceCaption: "Price-ETH/USD-6",
    },
    cronos: {
      guild: "Cronos",
      usdPriceCaption: "Price-CRO/USDT-6",
    },
    conflux: {
      guild: "Conflux eSpace",
      usdPriceCaption: "Price-CFX/USDT-6",
    },
    kcc: {
      guild: "KuCoin Community Chain",
      usdPriceCaption: "Price-KCS/USDT-6",
    },
    klaytn: {
      guild: "Klaytn",
      usdPriceCaption: "Price-KLAY/USDT-6",
    },
    meter: {
      guild: "Meter",
      usdPriceCaption: "Price-MTR/USDT-6"
    },
    metis: {
      guild: "Metis",
      usdPriceCaption: "Price-METIS/USDT-6"
    },
    okxchain: {
      guild: "OKXChain",
      usdPriceCaption: "Price-OKT/USDT-6",
    },
    polygon: {
      guild: "Polygon",
      usdPriceCaption: "Price-MATIC/USD-6",
      // traitTags: {
      //   backgrounds: [ "Polygon" ],
      // },
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
