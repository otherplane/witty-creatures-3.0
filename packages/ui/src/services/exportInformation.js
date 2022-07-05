import { BASE_URL } from '../constants'

export function createImportLink() {
  const { key, username, token } = JSON.parse(localStorage.getItem('tokenInfo'))
  const { txHash } = JSON.parse(localStorage.getItem('mintInfo'))
  if (txHash) {
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}&txHash=${txHash}`
  } else {
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}`
  }
}
