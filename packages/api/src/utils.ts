import {
  PLAYER_MINT_TIMESTAMP,
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  PLAYER_MAINNET_TIMESTAMP,
} from './constants'
import { Incubation } from './types'

export function calculateRemainingCooldown(
  interactionEnds: number,
  currentTimestamp = Date.now(),
  interactionDuration: number = INTERACTION_DURATION_MILLIS,
  interactionCooldown: number = INTERACTION_COOLDOWN_MILLIS
) {
  const remainingMillis =
    interactionEnds - interactionDuration + interactionCooldown - currentTimestamp

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

export function isMainnetTime() {
  return Date.now() >= PLAYER_MAINNET_TIMESTAMP * 1000
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
