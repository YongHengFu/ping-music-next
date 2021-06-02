import request from '@/utils/request'

export function getQRCodeKey() {
  return request({
    url: '/login/qr/key',
    method: 'get'
  })
}

export function getQRCode(params:object) {
  return request({
    url: '/login/qr/create',
    method: 'get',
    params
  })
}

export function getQRCodeState(params:object) {
  return request({
    url: '/login/qr/check',
    method: 'get',
    params
  })
}
