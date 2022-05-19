import {
  PLAYER_MINT_TIMESTAMP,
  RANCHES_COUNT,
  TRADE_COOLDOWN_MILLIS,
  TRADE_DURATION_MILLIS,
} from './constants'
import { Incubation, indexToRanch, RanchName } from './types'

export function calculateRemainingCooldown(
  tradeEnds: number,
  currentTimestamp = Date.now(),
  tradeDuration: number = TRADE_DURATION_MILLIS,
  tradeCooldown: number = TRADE_COOLDOWN_MILLIS
) {
  const remainingMillis =
    tradeEnds - tradeDuration + tradeCooldown - currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function calculateRemainingDuration(
  incubationEnds: number,
  currentTimestamp = Date.now()
) {
  const remainingMillis = incubationEnds - currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function getIncubationExtendedFromBase(incubation: Incubation) {
  return (
    incubation && {
      ...incubation,
      remainingCooldown: calculateRemainingCooldown(incubation.ends),
      remainingDuration: calculateRemainingDuration(incubation.ends),
    }
  )
}

export function getRanchFromIndex(index: number): RanchName {
  const ranchIndex = index % RANCHES_COUNT

  return indexToRanch[ranchIndex]
}

export function fromHexToUint8Array(hex: string) {
  return Uint8Array.from(Buffer.from(hex.substring(2).padStart(64, '0'), 'hex'))
}

export function isTimeToMint() {
  return Date.now() >= PLAYER_MINT_TIMESTAMP * 1000
}

export function printRemainingMillis(millis: number) {
  const seconds = Math.ceil(millis / 1000)
  if (seconds < 60) {
    return `${seconds} sec`
  } else {
    return `${Math.ceil(seconds / 60)} min`
  }
}
