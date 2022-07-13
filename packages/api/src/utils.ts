import {
  PLAYER_MINT_TIMESTAMP,
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  COLORS_COUNT,
} from './constants'
import { Incubation, Social, Award } from './types'
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator'

export function calculateRemainingCooldown(
  interactionEnds: number,
  currentTimestamp = Date.now(),
  interactionDuration: number = INTERACTION_DURATION_MILLIS,
  interactionCooldown: number = INTERACTION_COOLDOWN_MILLIS
) {
  const remainingMillis =
    interactionEnds -
    interactionDuration +
    interactionCooldown -
    currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function checkEmptySocials(socials: Social | null) {
  const valuesToCheck = { ...socials }
  delete valuesToCheck?.ownerKey
  // Socials with invalid or empty values
  if (valuesToCheck && Object.values(valuesToCheck).every(value => !value)) {
    return null
  }
  // Socials with share value to false
  return socials
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

export function getColorFromIndex(index: number) {
  return index % COLORS_COUNT
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

export function generateUsernameList(count: number): Array<string> {
  const usernames = new Set<string>()
  // The seed must start at 1 because 0 means "use Math.random"
  let counter = 1

  while (usernames.size < count) {
    const username = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      seed: counter,
      separator: '-',
      style: 'lowerCase',
    })
    usernames.add(username)
    counter += 1
  }

  // Convert set into array to allow indexing by index
  return Array.from(usernames)
}

export function toCamelCase(value: string): string {
  return value
    .replace(/\s(.)/g, $1 => {
      return $1.toUpperCase()
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, $1 => {
      return $1.toLowerCase()
    })
    .replace(/([()])/g, '')
}

export function toKebabCase(value: string | number) {
  if (typeof value === 'string') {
    return value.toLowerCase().split(' ').join('-')
  } else {
    return value
  }
}

export function normalizedAttributes(
  list: Array<{ trait_type: string; value: string | number }>
): Award {
  return list.reduce((acc, trait) => {
    return {
      ...acc,
      [toCamelCase(trait.trait_type)]: toKebabCase(trait.value),
    }
  }, {} as Award)
}
