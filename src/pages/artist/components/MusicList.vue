<template>
  <div>
    <span class="h2" style="margin-bottom: 15px">
      <svg-icon name="fire-fill" style="color: red;font-size: 22px" />
      TOP 50 <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
    </span>
    <div>
      <PlayItem
        v-for="(item,index) of musicList"
        :id="listId+index"
        :key="item.id"
        :list-item="item"
        :list-id="listId"
        @playSelect="playSelect(item)"
        @dblclick="playSelect(item)"
        @contextmenu="(e)=>showMenu(e,item)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import { getArtistHotMusic } from '@/api/music'
import { playAble } from '@/utils/musicList'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'MusicList',
  components: {
    PlayItem
  },
  props: {
    artistId: String
  },
  setup(props, ctx) {
    const store = useStore()
    const musicList = ref(<any>[])
    const playMusicList:any = []
    const listId = 'artistHot' + props?.artistId
    // const offset = 0
    let playIndex = 0
    // let isPlayAll = false

    const getMusicList = () => {
      const param = { id: props?.artistId }
      getArtistHotMusic(param).then((res:any) => {
        if (res.code === 200) {
          setMusicList(res.songs)
        }
      })
    }

    const setMusicList = (list:any) => {
      const songList = []
      for (const [index, item] of list.entries()) {
        const song:any = {
          index: index,
          id: item.id,
          name: item.name,
          artist: item.ar,
          album: item.al,
          mvId: item.mv,
          duration: item.dt / 1000,
          publishTime: item.publishTime,
          privileges: item.privilege,
          fee: item.fee,
          noCopyrightRcmd: item.noCopyrightRcmd,
          canPlay: null,
          listId: 'artistHot' + props.artistId
        }
        song.canPlay = playAble(song)
        songList.push(song)
        if (song.canPlay.able) {
          song.index = playIndex
          playIndex++
          playMusicList.push(song)
        }
      }
      musicList.value = songList
    }

    // const getMusicList = () => {
    //   const param = {
    //     id: props?.artistId,
    //     order: 'hot',
    //     limit: 30,
    //     offset: offset
    //   }
    //   getArtistAllMusic(param).then((res:any) => {
    //     if (res.code === 200) {
    //       setMusicList(res.songs)
    //       if (res.more) {
    //         offset = (offset + 1) * 30
    //         getMusicList()
    //       } else {
    //         if (isPlayAll) {
    //           isPlayAll = false
    //           store.commit('setMusicList', playMusicList)
    //         }
    //       }
    //     }
    //   })
    // }
    //
    // const setMusicList = (list:any) => {
    //   const songList = []
    //   for (const [index, item] of list.entries()) {
    //     const song:any = {
    //       index: index,
    //       id: item.id,
    //       name: item.name,
    //       artist: item.ar,
    //       album: item.al,
    //       mvId: item.mv,
    //       duration: item.dt / 1000,
    //       publishTime: item.publishTime,
    //       privileges: item.privileges,
    //       fee: item.fee,
    //       noCopyrightRcmd: item.noCopyrightRcmd,
    //       canPlay: null,
    //       listId: listId
    //     }
    //     song.canPlay = playAble(song)
    //     songList.push(song)
    //     if (song.canPlay.able) {
    //       song.index = playIndex
    //       playIndex++
    //       playMusicList.push(song)
    //     }
    //   }
    //   musicList.value = musicList.value.concat(songList)
    // }

    const playAll = () => {
      if (playMusicList.length > 0) {
        // isPlayAll = true
        store.commit('setCurrMusic', playMusicList[0])
        store.commit('setMusicList', playMusicList)
      }
    }

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
        // isPlayAll = true
        for (const item of playMusicList) {
          if (item.id === music.id) {
            store.commit('setCurrMusic', item)
            store.commit('setMusicList', playMusicList)
            return
          }
        }
      } else {
        message.error(music.canPlay.msg)
      }
    }

    onMounted(() => {
      getMusicList()
    })

    return {
      musicList,
      listId,
      playAll,
      playSelect
    }
  }
})
</script>

<style scoped>
.play-all{
  font-size: 24px;
  color: var(--primary-color);
  cursor: pointer;
}
</style>
