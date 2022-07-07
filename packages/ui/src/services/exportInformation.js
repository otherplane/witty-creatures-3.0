import { BASE_URL } from '../constants'

export function createImportLink() {
  const { key, username, token } = JSON.parse(localStorage.getItem('tokenInfo'))
  const mintInfo = JSON.parse(localStorage.getItem('mintInfo'))
  if (mintInfo?.mintConfirmation) {
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}&txHash=${mintInfo.txHash}&from=${mintInfo.from}&mintConfirmation=${mintInfo.mintConfirmation}`
  } else if (mintInfo?.txHash) {
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}&txHash=${mintInfo.txHash}&from=${mintInfo.from}`
  } else {
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}`
  }
}
