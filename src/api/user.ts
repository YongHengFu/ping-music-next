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

// 获取用户歌单
export function getUserPlayList(params:object) {
  return request({
    url: '/user/playlist',
    method: 'get',
    params
  })
}

/** 获取收藏的歌手列表
 @param limit: 每页数量 , 默认为 50
 @param offset: 偏移数量 , 用于分页 , (页数-1)*50, 其中 50 为 limit 的值
 **/
export function getCollectArtist(params:object) {
  return request({
    url: '/artist/sublist',
    method: 'get',
    params
  })
}

/** 收藏/取消收藏歌手
 @param id: 歌手id
 @param t:操作,1 为收藏,其他为取消收藏
 **/
export function collectArtist(params:object) {
  return request({
    url: '/artist/sub',
    method: 'get',
    params
  })
}
