import request from '@/utils/request'

export function homepage() {
  return request({
    url: '/homepage/block/page',
    method: 'get',
  })
}

export function getBanner() {
  return request({
    url: '/banner',
    method: 'get',
  })
}

export function getQRCode(params:object) {
  return request({
    url: '/login/qr/key',
    method: 'get',
    params,
  })
}
