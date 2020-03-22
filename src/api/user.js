import { customRequest, getRequest, postRequest } from '@/utils/api'

export function login(data) {
  return customRequest('/doLogin', {
    method: 'post',
    data: data,
    transformRequest: [function(data) {
      let ret = ''
      for (const i in data) {
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getInfo(token) {
  return getRequest('/basic/admin/current')
}

export function logout() {
  return postRequest('/logout')
}
