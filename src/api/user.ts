import request from '@/utils/request'

// 生成二维码的key
export function getQRCodeKey(params:object) {
  return request({
    url: '/login/qr/key',
    method: 'get',
    params
  })
}

// 获取二维码的Base64信息
export function getQRCodeData(params:object) {
  return request({
    url: '/login/qr/create',
    method: 'get',
    params
  })
}

// 获取二维码状态
export function getQRCodeState(params:object) {
  return request({
    url: '/login/qr/check',
    method: 'get',
    params
  })
}

// 手机登录
export function loginByPhone(params:object) {
  return request({
    url: '/login/cellphone',
    method: 'get',
    params
  })
}
// 邮箱登录
export function loginByEmail(params:object) {
  return request({
    url: '/login',
    method: 'get',
    params
  })
}

// 获取账号信息
export function getAccountInfo() {
  return request({
    url: '/user/account',
    method: 'get'
  })
}
// 退出登录
export function logoutAccount() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
