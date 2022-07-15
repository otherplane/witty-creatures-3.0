/**
 * Constants. These can be customized through environment variables.
 */
import { Colors } from './types'

// Byte length of players keys. This can be adjusted for usability vs. security trade-offs.
let playerKeyLengthBytes: number = process.env.PLAYER_KEY_LENGTH_BYTES
  ? parseInt(process.env.PLAYER_KEY_LENGTH_BYTES)
  : 8
// Ensure that player keys byte length is 8 <= x < 30
if (playerKeyLengthBytes < 8 || playerKeyLengthBytes > 30) {
  playerKeyLengthBytes = 8
}
export const PLAYER_KEY_LENGTH_BYTES = playerKeyLengthBytes

// Base string to use for salting the deterministic player key derivation.
export const PLAYER_KEY_SALT: string = process.env.PLAYER_KEY_SALT || ''

// JWT secret to derive tokens
export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret'

// Player interaction duration in millis
export const INTERACTION_DURATION_MILLIS = process.env
  .INTERACTION_DURATION_MILLIS
  ? parseInt(process.env.INTERACTION_DURATION_MILLIS)
  : 2 * 60 * 1000

// Player interaction cooldown in millis
export const INTERACTION_COOLDOWN_MILLIS = process.env
  .INTERACTION_COOLDOWN_MILLIS
  ? Math.max(
      parseInt(process.env.INTERACTION_COOLDOWN_MILLIS),
      INTERACTION_DURATION_MILLIS
    )
  : Math.max(2 * 60 * 60 * 1000, INTERACTION_DURATION_MILLIS)

// Number of different theme colors
export const COLORS_COUNT = process.env.COLORS_COUNT
  ? parseInt(process.env.COLORS_COUNT)
  : 5

// Self interaction points
export const SELF_INTERACTION_POINTS = process.env.SELF_INTERACTION_POINTS
  ? parseInt(process.env.SELF_INTERACTION_POINTS)
  : 30

// Interaction base points
export const INTERACTION_POINTS = process.env.INTERACTION_POINTS
  ? parseInt(process.env.INTERACTION_POINTS)
  : 800

// Minimum amount of points that can be rewarded after a interaction
export const INTERACTION_POINTS_MIN = process.env.INTERACTION_POINTS_MIN
  ? parseInt(process.env.INTERACTION_POINTS_MIN)
  : 50

// Interaction point divisor to be applied every time the same incubation happens
export const INTERACTION_POINTS_DIVISOR = process.env.INTERACTION_POINTS_DIVISOR
  ? parseInt(process.env.INTERACTION_POINTS_DIVISOR)
  : 2

// Secp256k1 private key used for signing in the `mint` endpoint
export const MINT_PRIVATE_KEY = process.env.MINT_PRIVATE_KEY || '0x00'
// '0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7'

// Tell how many players to generate
export const PLAYERS_COUNT: number = process.env.PLAYERS_COUNT
  ? parseInt(process.env.PLAYERS_COUNT)
  : 10

// Tell how many bufficorns to generate for each ranch
export const BUFFICORNS_PER_RANCH: number = process.env.BUFFICORNS_PER_RANCH
  ? parseInt(process.env.BUFFICORNS_PER_RANCH)
  : 4

// Awards date in millis
// If `PLAYER_MINT_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const PLAYER_MINT_TIMESTAMP = process.env.PLAYER_MINT_TIMESTAMP
  ? parseInt(process.env.PLAYER_MINT_TIMESTAMP)
  : 1658419200 // Sunday, February 20, 2022 18:00:00 PM (UTC)

// Web3 provider URL
export const WEB3_PROVIDER =
  process.env.WEB3_PROVIDER || 'https://rpc-mumbai.maticvigil.com'

// WittyCreaturesERC721 contract address
export const WITTY_CREATURES_ERC721_ADDRESS =
  process.env.WITTY_CREATURES_ERC721_ADDRESS ||
  '0xC7F98D8b8b2e0C83D87baC9ACCC8bFFc8fDbF3b8'

export const MONGO_URI: string =
  process.env.MONGO_URI ||
  'mongodb://your_username:your_password@localhost:27017/database'

export const NETWORKS = {
  1030: {
    name: 'Conflux Mainnet',
    id: 1030,
    contractAddress:
      process.env.CONFLUX_ESPACE_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://evm.confluxrpc.com'],
  },
  25: {
    name: 'Cronos Mainnet',
    id: 25,
    contractAddress: process.env.CRONOS_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://cronosrpc-1.xstaking.sg'],
  },
  321: {
    name: 'KCC Mainnet',
    id: 321,
    contractAddress: process.env.KCC_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc-mainnet.kcc.network'],
  },
  1: {
    name: 'Ethereum Mainnet',
    id: 1,
    contractAddress: process.env.ETHEREUM_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
  },
  82: {
    name: 'Meter Mainnet',
    id: 82,
    contractAddress: process.env.METER_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc.meter.io'],
  },
  1088: {
    name: 'Metis Mainnet',
    id: 1088,
    contractAddress: process.env.METIS_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
  },
  66: {
    name: 'OKX Chain Mainnet',
    id: 66,
    contractAddress: process.env.OKXCHAIN_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://exchainrpc.okex.org'],
  },
  137: {
    name: 'Polygon Mainnet',
    id: 137,
    contractAddress: process.env.POLYGON_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://polygon-rpc.com/'],
  },
  28: {
    name: 'Boba Network Rinkeby',
    id: 28,
    contractAddress: process.env.BOBA_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rinkeby.boba.network/'],
  },
  71: {
    name: 'Conflux eSpace Testnet',
    id: 71,
    contractAddress:
      process.env.CONFLUX_ESPACE_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://evmtestnet.confluxrpc.com'],
    blockExplorerUrls: ['https://testnet.confluxscan.io/'],
  },
  338: {
    name: 'Cronos Testnet',
    id: 338,
    contractAddress: process.env.CRONOS_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://evm-t3.cronos.org'],
  },
  322: {
    name: 'KCC Testnet',
    id: 322,
    contractAddress: process.env.KCC_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc-testnet.kcc.network'],
  },
  4: {
    name: 'Ethereum Rinkeby',
    id: 4,
    contractAddress: process.env.ETHEREUM_RINKEBY_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc.ankr.com/eth_rinkeby'],
  },
  83: {
    name: 'Meter Testnet',
    id: 83,
    contractAddress: process.env.METER_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpctest.meter.io'],
  },
  588: {
    name: 'Metis Stardust Testnet',
    id: 588,
    contractAddress: process.env.METIS_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://stardust.metis.io/?owner=588'],
  },
  65: {
    name: 'OKXChain Testnet',
    id: 65,
    contractAddress: process.env.OKXCHAIN_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['exchaintestrpc.okex.org'],
  },
  80001: {
    name: 'Polygon Mumbai',
    id: 80001,
    contractAddress: process.env.POLYGON_MUMBAI_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
  },
}

export const THEME_COLORS: Colors = {
  emerald: '#488B62',
  obsidian: '#292929',
  ruby: '#BE3737',
  gold: '#F18944',
  sapphire: '#0F2664',
}

export default {
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_MINT_TIMESTAMP,
  PLAYERS_COUNT,
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  INTERACTION_POINTS,
  INTERACTION_POINTS_DIVISOR,
  INTERACTION_POINTS_MIN,
  MONGO_URI,
  WITTY_CREATURES_ERC721_ADDRESS,
  THEME_COLORS,
}
