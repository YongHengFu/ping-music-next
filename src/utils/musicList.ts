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
  const song = await getMusicData(ids)
  if (song) {
    const musicList = JSON.parse(<string>localStorage.getItem('musicList'))
    const currIndex = store.state.currMusic?.index
    musicList.splice(currIndex + 1, 0, song[0])
    for (let i = 0; i < musicList.length; i++) {
      musicList[i].index = i
    }
    store.commit('setMusicList', musicList)
    localStorage.setItem('musicList', JSON.stringify(musicList))
    return true
  } else {
    return false
  }
}

export const getMusicData = (ids:string[]) => {
  const param = { ids: ids.join(',') }
  return getMusicDetail(param).then((res:any) => {
    if (res.code === 200) {
      const songs = res.songs
      const details = []
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
          noCopyrightRcmd: item.noCopyrightRcmd,
          canPlay: null
        }
        song.canPlay = playAble(song)
        details.push(song)
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
  if (ids) {
    const list = await getMusicData(ids)
    if (list) {
      localStorage.setItem('musicList', JSON.stringify(list))
      store.commit('setMusicList', list)
      store.commit('setCurrMusic', list[0])
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
  if (ids) {
    let list:any = []
    for (let i = 0; i < ids.length; i += 50) {
      if (i + 50 < ids.length) {
        list = list.concat(await getMusicData(ids.slice(i, i + 50)))
      } else {
        list = list.concat(await getMusicData(ids.slice(i, ids.length)))
      }
      if (i % 100 === 0) {
        if (list) {
          localStorage.setItem('musicList', JSON.stringify(list))
          store.commit('setMusicList', list)
          if (i === 0) {
            store.commit('setCurrMusic', list[0])
          }
        }
      }
    }
    if (list) {
      localStorage.setItem('musicList', JSON.stringify(list))
      store.commit('setMusicList', list)
    }
  }
}

export const playAble = (item:any) => {
  // debugger
  const loginState = store.state.loginState
  const user:any = {}
  const result = {
    able: true,
    msg: ''
  }
  if (loginState && item?.privileges?.cs) {
    return result
  }
  if (item.fee === 1 || item.privileges?.fee === 1) {
    if (loginState && user?.vipType === 11) {
      return result
    } else {
      result.able = false
      result.msg = '会员歌曲'
      return result
    }
  } else if (item.fee === 4 || item.privileges?.fee === 4) {
    result.able = false
    result.msg = '付费歌曲'
    return result
  } else if (item.noCopyrightRcmd) {
    result.able = false
    result.msg = '因合作方要求，该资源暂时下载'
    return result
  } else if (item.privileges?.st < 0 && loginState) {
    result.able = false
    result.msg = '因合作方要求，该资源暂时下载'
    return result
  } else {
    return result
  }
}
