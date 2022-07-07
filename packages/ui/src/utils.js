import { PLAYER_MAINNET_TIMESTAMP } from '@/constants.js'

export function formatNumber(num) {
  num += ''
  const splitedNumber = num.split('.')
  const decimals = splitedNumber.length > 1 ? '.' + splitedNumber[1] : ''
  const rgx = /(\d)(?=(\d{3})+(?!\d))/g
  const unit = splitedNumber[0].replace(rgx, '$1,')
  return unit + decimals
}

export function isMainnetTime() {
  return Date.now() >= PLAYER_MAINNET_TIMESTAMP * 1000
}

export function truncate(str) {
  return str.length > 25
    ? `${str.substring(0, 14)}...${str.substring(str.length - 14, str.length)}`
    : str
}

export function checkEmptySocials(socials) {
  const valuesToCheck = { ...socials }
  delete valuesToCheck?.ownerKey
  // Socials with invalid or empty values
  if (valuesToCheck && Object.values(valuesToCheck).every(value => !value)) {
    return null
  }
  // Socials with share value to false
  return socials
}
