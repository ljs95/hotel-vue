import request from './request'

const baseUrl = ''

export const getRequest = (url, params) => {
  return request.get(`${baseUrl}${url}`, { params: params })
}

export const postRequest = (url, params) => {
  return request({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: params
  })
}

export const putRequest = (url, params) => {
  return request({
    method: 'put',
    url: `${baseUrl}${url}`,
    data: params
  })
}

export const deleteRequest = (url, params) => {
  return request({
    method: 'delete',
    url: `${baseUrl}${url}`,
    data: params
  })
}

export const customRequest = (url, args) => {
  args['url'] = `${baseUrl}${url}`
  return request(args)
}
