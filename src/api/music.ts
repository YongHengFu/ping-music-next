import request from '@/utils/request'

export function homepage() {
  return request({
    url: '/homepage/block/page',
    method: 'get'
  })
}

export function getBanner() {
  return request({
    url: '/banner',
    method: 'get'
  })
}

export function getPlayList_Qua(params:object) {
  return request({
    url: '/top/playlist/highquality',
    method: 'get',
    params
  })
}

// 推荐新音乐
export function getNewSong(params:object) {
  return request({
    url: '/personalized/newsong',
    method: 'get',
    params
  })
}

// 根据id获取音乐url
export function getMusicById(params:object) {
  return request({
    url: '/song/url',
    method: 'get',
    params
  })
}

// 根据id获取音乐详情
export function getMusicDetail(params:object) {
  return request({
    url: '/song/detail',
    method: 'get',
    params
  })
}

// 获取排行榜信息
export function getTopList() {
  return request({
    url: '/toplist/detail',
    method: 'get'
  })
}

// 根据id获取歌单详情
export function getListById(params:object) {
  return request({
    url: '/playlist/detail',
    method: 'get',
    params
  })
}

// 根据id获取专辑详情
export function getAlbumById(params:object) {
  return request({
    url: '/album',
    method: 'get',
    params
  })
}

// 根据id获取歌词
export function getLyricById(params:object) {
  return request({
    url: '/lyric',
    method: 'get',
    params
  })
}

// 根据usid获取喜欢音乐列表
export function getLikeList(params:object) {
  return request({
    url: '/likelist',
    method: 'get',
    params
  })
}

// 根据id添加/取消喜欢歌曲
export function likeMusic(params:object) {
  return request({
    url: '/like',
    method: 'get',
    params // 可选参数 : like: 默认为 true 即喜欢 , 若传 false, 则取消喜欢
  })
}
