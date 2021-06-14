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
        details.push({
          index: index,
          id: item.id,
          name: item.name,
          artist: item.ar,
          album: item.al,
          mvId: item.mv,
          duration: item.dt / 1000,
          publishTime: item.publishTime
        })
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
    const list = await getMusicData(ids)
    if (list) {
      localStorage.setItem('musicList', JSON.stringify(list))
      store.commit('setMusicList', list)
      store.commit('setCurrMusic', list[0])
    }
  }
}
