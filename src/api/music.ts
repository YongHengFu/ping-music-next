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

/** 获取新歌速递
 @param area 取值:0:全部,7华语,96欧美,8:日本,16韩国
 **/
export function getNewSongList(params:object) {
  return request({
    url: '/top/song',
    method: 'get',
    params
  })
}

/** ------推荐----- **/

/** 推荐新音乐
 @param limit:取出数量,默认为10
 **/
export function getRcmdNewSong(params:object) {
  return request({
    url: '/personalized/newsong',
    method: 'get',
    params
  })
}

/** 推荐歌单
 @param limit:取出数量,默认为30
 **/
export function getRcmdPlayList(params:object) {
  return request({
    url: '/personalized',
    method: 'get',
    params
  })
}

/** 推荐mv  **/
export function getRcmdMv() {
  return request({
    url: '/personalized/mv',
    method: 'get'
  })
}

/** 独家放送  **/
export function getPrivateContent() {
  return request({
    url: '/personalized/privatecontent',
    method: 'get'
  })
}
/** 独家放送全部
 @param limit: 每页数量 , 默认为 50
 @param offset: 偏移数量 , 用于分页 , ( 页数 -1)*50, 其中 50 为 limit 的值
 **/
export function getPrivateContentAll(params:object) {
  return request({
    url: '/personalized/privatecontent/list',
    method: 'get',
    params
  })
}

//
// /** 获取推荐新音乐
//  @param limit:取出数量,默认为10
//  **/
// export function getNewSong(params:object) {
//   return request({
//     url: '/personalized/newsong',
//     method: 'get',
//     params
//   })
// }

/** ------歌单----- **/

/** 热门歌单标签  **/
export function getHotTagsPlayList() {
  return request({
    url: '/playlist/hot',
    method: 'get'
  })
}

/** 获取歌单(网友精选碟)
 @param order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 @param cat: tag, 比如 " 华语 "、" 古风 " ... , 默认为 "全部"
 @param limit: 取出歌单数量 , 默认为 50
 @param offset: 偏移数量 , 用于分页 , ( 页数 -1)*50, 其中 50 为 limit 的值
 **/
export function getTopPlayList(params:object) {
  return request({
    url: '/top/playlist',
    method: 'get',
    params
  })
}
/** 获取歌单(精品歌单)
 @param cat: tag, 比如 " 华语 "、" 古风 " ... , 默认为 "全部"
 @param limit: 取出歌单数量 , 默认为 20
 @param before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 **/
export function getHqPlayList(params:object) {
  return request({
    url: '/top/playlist/highquality',
    method: 'get',
    params
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

/** 获取歌手列表
 @param limit: 每页数量 , 默认为 30
 @param offset: 偏移数量 , 用于分页 , ( 页数 -1)*50, 其中 50 为 limit 的值
 @param type 取值:-1:全部,1:男歌手,2:女歌手,3:乐队
 @param area 取值:-1:全部,7华语,96欧美,8:日本,16韩国,0:其他
**/
export function getArtistList(params:object) {
  return request({
    url: '/artist/list',
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

/** 获取相关mv
 @param mvid:mv的id
 **/
export function getSimiMv(params:object) {
  return request({
    url: '/simi/mv',
    method: 'get',
    params
  })
}

/** 获取视频数据
 @param id:视频的id
 **/
export function getVideoDetail(params:object) {
  return request({
    url: '/video/detail',
    method: 'get',
    params
  })
}

/** 获取视频的url
 @param id:视频的id
 **/
export function getVideoUrl(params:object) {
  return request({
    url: '/video/url',
    method: 'get',
    params
  })
}

/** 获取相关视频
 @param id:视频的id
 **/
export function getSimiVideo(params:object) {
  return request({
    url: '/related/allvideo',
    method: 'get',
    params
  })
}
/** 获取全部 MV
 @param limit: 每页数量 , 默认为 30
 @param offset: 偏移数量 , 用于分页 , ( 页数 -1)*50, 其中 50 为 limit 的值
 @param type： 类型,可选值为全部,官方版,原生,现场版,网易出品,默认全部
 @param area: 可选值为全部,内地,港台,欧美,日本,韩国,默认全部
 @param order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
 **/
export function getAllMv(params:object) {
  return request({
    url: '/mv/all',
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

/** 获取热搜列表 **/
export function getHotSearch() {
  return request({
    url: '/search/hot/detail',
    method: 'get'
  })
}

/** 获取搜索建议
 @param keywords : 关键词
 **/
export function getSearchSuggest(params:object) {
  return request({
    url: '/search/suggest',
    method: 'get',
    params
  })
}
