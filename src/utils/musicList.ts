import store from '@/store'
import { getAlbumById, getListById, getMusicDetail } from '@/api/music'

// 选择歌曲进行播放
export const playSingle = async(id:string) => {
  if (await pushSingle(id)) {
    store.commit('setCurrMusic', store.state.musicList[store.state.currMusic?.index + 1])
  }
}

// 选择歌曲下一首播放
export const pushSingle = async(id:string) => {
  const ids = [id]
  const song = await getMusicData(ids, '')
  if (song) {
    const musicList = JSON.parse(<string>localStorage.getItem('musicList'))
    const currIndex = store.state.currMusic?.index
    musicList.splice(currIndex + 1, 0, song[0])
    for (let i = 0; i < musicList.length; i++) {
      musicList[i].index = i
    }
    store.commit('setMusicList', musicList)
    return true
  } else {
    return false
  }
}

export const getMusicData = (ids:string[], listId:string) => {
  const param = { ids: ids.join(',') }
  return getMusicDetail(param).then((res:any) => {
    if (res.code === 200) {
      const songs = res.songs
      const details = []
      let index2 = 0
      for (const [index, item] of songs.entries()) {
        const song:any = {
          index: index,
          id: item.id,
          name: item.name,
          artist: item.ar,
          album: item.al,
          mvId: item.mv,
          duration: item.dt / 1000,
          publishTime: item.publishTime,
          privileges: res.privileges[index],
          fee: item.fee,
          noCopyrightRcmd: item.noCopyrightRcmd,
          canPlay: null
        }
        song.canPlay = playAble(song)
        if (song.canPlay.able) {
          if (listId && listId !== '') {
            song.listId = listId
          }
          song.index = index2
          index2++
          details.push(song)
        }
      }
      return details
    } else {
      return null
    }
  })
}

// 播放整张专辑
export const playAblume = async(id:string) => {
  const param = { 'id': id }
  const ids = await getAlbumById(param).then((res:any) => {
    if (res.code === 200) {
      const ids = []
      for (const item of res.songs) {
        ids.push(item.id)
      }
      return ids
    } else {
      return null
    }
  })
  if (ids && ids.length > 0) {
    const list = await getMusicData(ids, 'album' + id)
    if (list && list.length > 0) {
      store.commit('setCurrMusic', list[0])
      store.commit('setMusicList', list)
    }
  }
}

// 播放整个歌单
export const playList = async(id:string) => {
  const param = { id }
  const ids = await getListById(param).then((res:any) => {
    if (res.code === 200) {
      const ids = []
      for (const item of res.playlist.trackIds) {
        ids.push(item.id)
      }
      return ids
    } else {
      return null
    }
  })
  if (ids && ids.length > 0) {
    let list:any = []
    for (let i = 0; i < ids.length; i += 50) {
      if (i + 50 < ids.length) {
        list = list.concat(await getMusicData(ids.slice(i, i + 50), 'playList' + id))
      } else {
        list = list.concat(await getMusicData(ids.slice(i, ids.length), 'playList' + id))
      }
      if (i % 100 === 0) {
        if (list && list.length > 0) {
          store.commit('setMusicList', list)
          if (i === 0) {
            store.commit('setCurrMusic', list[0])
          }
        }
      }
    }
    if (list && list.length > 0) {
      store.commit('setMusicList', list)
    }
  }
}

// 播放其他列表歌曲
export const playOrderList = async(ids:string[], listId:string) => {
  if (ids && ids.length > 0) {
    let list:any = []
    for (let i = 0; i < ids.length; i += 30) {
      if (i + 30 < ids.length) {
        list = list.concat(await getMusicData(ids.slice(i, i + 30), listId))
      } else {
        list = list.concat(await getMusicData(ids.slice(i, ids.length), listId))
      }
      if (i % 40 === 0) {
        if (list && list.length > 0) {
          store.commit('setMusicList', list)
          if (i === 0) {
            store.commit('setCurrMusic', list[0])
          }
        }
      }
    }
    if (list && list.length > 0) {
      store.commit('setMusicList', list)
    }
  }
}

// 判断音乐是否可播放
export const playAble = (item:any) => {
  const result = {
    able: true,
    type: 0,
    msg: ''
  }
  if (item?.privileges?.pl === 0) {
    if (item.fee === 1 || item.privileges?.fee === 1) {
      result.able = false
      result.type = 1
      result.msg = '会员歌曲'
    } else if (item.fee === 4 || item.privileges?.fee === 4) {
      result.able = false
      result.type = 2
      result.msg = '付费歌曲'
    } else {
      result.able = false
      result.type = 3
      result.msg = '因合作方要求，该资源暂时下架'
    }
  }
  return result
}
