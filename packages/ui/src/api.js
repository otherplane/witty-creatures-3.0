import axios from 'axios'

import { API_BASE_URL } from './constants'

export class WittyCreaturesApi {
  constructor () {
    this.baseUrl = API_BASE_URL
  }

  _handleResponse (response) {
    if (response && response.data) {
      return response.data
    }
  }

  _handleError (error) {
    return { error }
  }

  _get ({ url, params }) {
    return axios
      .get(url, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  _post ({ url, params }) {
    console.log({ url, params })
    return axios
      .post(url, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  authorize (params) {
    return this._post({
      url: `${this.baseUrl}/auth`,
      params: { key: params.key }
    })
  }

  getInfo (params) {
    return {
      error: {
        response: { data: { message: `Error getting user info` } }
      }
    }
  }

  getContractArgs ({ address, token }) {
    return this._post({
      url: `${this.baseUrl}/mint`,
      data: { address },
      params: { headers: { authorization: token } }
    })
  }
}
