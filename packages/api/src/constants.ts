/**
 * Constants. These can be customized through environment variables.
 */

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

// Player trade duration in millis
export const TRADE_DURATION_MILLIS = process.env.TRADE_DURATION_MILLIS
  ? parseInt(process.env.TRADE_DURATION_MILLIS)
  : 2 * 60 * 1000

// Player trade cooldown in millis
export const TRADE_COOLDOWN_MILLIS = process.env.TRADE_COOLDOWN_MILLIS
  ? Math.max(parseInt(process.env.TRADE_COOLDOWN_MILLIS), TRADE_DURATION_MILLIS)
  : Math.max(2 * 60 * 60 * 1000, TRADE_DURATION_MILLIS)

// Trade base points
export const TRADE_POINTS = process.env.TRADE_POINTS
  ? parseInt(process.env.TRADE_POINTS)
  : 800

// Minimum amount of points that can be rewarded after a trade
export const TRADE_POINTS_MIN = process.env.TRADE_POINTS_MIN
  ? parseInt(process.env.TRADE_POINTS_MIN)
  : 50

// Trade point divisor to be applied every time the same incubation happens
export const TRADE_POINTS_DIVISOR = process.env.TRADE_POINTS_DIVISOR
  ? parseInt(process.env.TRADE_POINTS_DIVISOR)
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
  : 1645351200 // Sunday, February 20, 2022 18:00:00 PM (UTC)

// Web3 provider URL
export const WEB3_PROVIDER =
  process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'

// WitmonERC721 contract address
export const WITMON_ERC721_ADDRESS =
  process.env.WITMON_ERC721_ADDRESS ||
  '0x691908f883E006C0fB42da190A9EA07E6996D6c6'

export const MONGO_URI: string =
  process.env.MONGO_URI ||
  'MONGO_URI=mongodb://your_username:your_password@localhost:27017/database'

// Mainnet date in millis
// If `PLAYER_MAINNET_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const PLAYER_MAINNET_TIMESTAMP = process.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(process.env.PLAYER_MAINNET_TIMESTAMP)
  : 1645131600 // Thursday, February 17, 2022 09:00:00 PM (UTC)

export default {
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_MINT_TIMESTAMP,
  PLAYERS_COUNT,
  TRADE_COOLDOWN_MILLIS,
  TRADE_DURATION_MILLIS,
  TRADE_POINTS,
  TRADE_POINTS_DIVISOR,
  TRADE_POINTS_MIN,
  MONGO_URI,
  WITMON_ERC721_ADDRESS,
  PLAYER_MAINNET_TIMESTAMP,
}
