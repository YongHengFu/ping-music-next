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

/** ------歌手----- **/

/** 获取歌手信息和热门歌曲
 @param id:歌手id
**/
export function getArtist(params:object) {
  return request({
    url: '/artists',
    method: 'get',
    params
  })
}

/** 获取歌手热门歌曲(50首)
 @param id:歌手id
**/
export function getArtistHotMusic(params:object) {
  return request({
    url: '/artist/top/song',
    method: 'get',
    params
  })
}

/** 获取歌手信息
 @param id:歌手id
**/
export function getArtistInfo(params:object) {
  return request({
    url: '/artist/detail',
    method: 'get',
    params
  })
}

/** 获取歌手全部歌曲
 @param id:歌手id
 @param order : hot ,time 按照热门或者时间排序
 @param limit: 每页数量 , 默认为 50
 @param offset: 偏移数量 , 用于分页 , ( 页数 -1)*50, 其中 50 为 limit 的值
**/
export function getArtistAllMusic(params:object) {
  return request({
    url: '/artist/songs',
    method: 'get',
    params
  })
}

/** 获取歌手专辑
 @param id:歌手id
 @param limit: 每页数量 , 默认为 50
 @param offset: 偏移数量 , 用于分页 , (页数-1)*50, 其中 50 为 limit 的值
**/
export function getArtistAlbum(params:object) {
  return request({
    url: '/artist/album',
    method: 'get',
    params
  })
}

/** 获取歌手mv
 @param id:歌手id
 @param limit: 每页数量 , 默认为 50
 @param offset: 偏移数量 , 用于分页 , (页数-1)*50, 其中 50 为 limit 的值
**/
export function getArtistMv(params:object) {
  return request({
    url: '/artist/mv',
    method: 'get',
    params
  })
}

/** 获取相似歌手
 @param id:歌手id
**/
export function getSimilarArtist(params:object) {
  return request({
    url: '/simi/artist',
    method: 'get',
    params
  })
}

/** ------视频----- **/

/** 获取mv数据
 @param mvid:mv的id
 **/
export function getMvDetail(params:object) {
  return request({
    url: '/mv/detail',
    method: 'get',
    params
  })
}

/** 获取mv的url
 @param id:mv的id
 @param r:分辨率
 **/
export function getMvUrl(params:object) {
  return request({
    url: '/mv/url',
    method: 'get',
    params
  })
}

/** 获取相似mv
 @param mvid:mv的id
 **/
export function getSimiMv(params:object) {
  return request({
    url: '/simi/mv',
    method: 'get',
    params
  })
}

/** ------搜索----- **/

/** 根据关键词搜索
 @param keywords： 关键词
 @param limit: 每页数量 , 默认为 50
 @param offset: 偏移数量 , 用于分页 , (页数-1)*50, 其中 50 为 limit 的值
 @param type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 **/
export function searchByKeywords(params:object) {
  return request({
    url: '/search',
    method: 'get',
    params
  })
}

/** 获取最佳匹配
 @param keywords： 关键词
 **/
export function searchBestMatch(params:object) {
  return request({
    url: '/search/multimatch',
    method: 'get',
    params
  })
}
