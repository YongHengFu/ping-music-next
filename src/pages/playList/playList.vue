<template>
  <div v-if="loading" style="width: calc((var(--block-size) + 20px) * var(--block-num))">
    <ListHead
      v-if="Object.keys(playListInfo).length>0"
      :info="playListInfo"
      :type="2"
      @playAll="playAll"
    />
    <div>
      <PlayItem
        v-for="item of musicList"
        :key="item.id"
        :list-item="item"
        :list-id="route.params.id"
        @dblclick="playSelect(item)"
        @contextmenu="(e)=>showMenu(e,item)"
      />
    </div>
    <ContextMenu v-if="Object.keys(menuInfo).length>0" v-show="isShowMenu" :point-x="pointX" :point-y="pointY" :info="menuInfo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ListHead from '@/components/ListHead.vue'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { getListById, getMusicDetail } from '@/api/music'
import { playAble } from '@/utils/musicList'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'PlayList',
  components: {
    ListHead,
    PlayItem,
    ContextMenu
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)
    const playListInfo = ref(<any>{})
    const musicList = ref(<any>[])
    const showAll = ref(false)
    const isShowMenu = ref(false)
    const pointX = ref(0)
    const pointY = ref(0)
    const menuInfo = ref({})
    let playMusicList:any = []
    let isPlayAll = false

    const getListData = async(id:string) => {
      const param = { 'id': id }
      await getListById(param).then(async(res:any) => {
        if (res.code === 200) {
          getPlayListInfo(res.playlist)
          loading.value = true
          await getMusicList(res.playlist.trackIds)
        }
      })
    }

    const getPlayListInfo = (playList:any) => {
      const info = {
        name: playList.name,
        image: playList.coverImgUrl,
        description: playList.description,
        creatorName: playList.creator.nickname,
        creatorImg: playList.creator.avatarUrl,
        time: playList.updateTime,
        length: playList.trackCount,
        type: 2
      }
      playListInfo.value = info
    }

    const getMusicList = async(list:any) => {
      playMusicList = []
      let playIndex = 0
      let ids = ''
      for (let i = 0; i < list.length; i += 50) {
        ids = ''
        if (i + 50 < list.length) {
          for (const item of list.slice(i, i + 50)) {
            ids += item.id + ','
          }
        } else {
          for (const item of list.slice(i, list.length)) {
            ids += item.id + ','
          }
        }
        const param = { 'ids': ids.slice(0, ids.length - 1) }
        await getMusicDetail(param).then((res:any) => {
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
                fee: item.fee,
                noCopyrightRcmd: item.noCopyrightRcmd,
                canPlay: null,
                listId: 'playList' + route.params.id
              }
              song.canPlay = playAble(song)
              details.push(song)
              if (song.canPlay.able) {
                song.index = playIndex
                playIndex++
                playMusicList.push(song)
              }
            }
            musicList.value = musicList.value.concat(details)
          }
        })
      }
      if (isPlayAll) {
        isPlayAll = false
        store.commit('setMusicList', playMusicList)
      }
    }

    const DateFormat = (date:string) => {
      const time = new Date(date)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      return y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日'
    }

    const playAll = () => {
      if (playMusicList.length > 0) {
        isPlayAll = true
        store.commit('setCurrMusic', playMusicList[0])
        store.commit('setMusicList', playMusicList)
      }
    }

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
        if (music.listId === route.params.id) {
          for (const item of store.state.musicList) {
            if (item.id === music.id) {
              store.commit('setCurrMusic', item)
              return
            }
          }
        } else {
          isPlayAll = true
          for (const item of playMusicList) {
            if (item.id === music.id) {
              store.commit('setCurrMusic', item)
              store.commit('setMusicList', playMusicList)
              return
            }
          }
        }
      } else {
        message.error(music.canPlay.msg)
      }
    }

    const showMenu = (e: { preventDefault: () => void; x: number; y: number }, item: any) => {
      e.preventDefault()
      isShowMenu.value = true
      pointX.value = e.x
      pointY.value = e.y
      const info = {
        name: item.name,
        image: item.album.picUrl,
        artists: item.artist
      }
      menuInfo.value = info
      document.onmousedown = () => {
        isShowMenu.value = false
        document.onmousedown = null
      }
      document.onwheel = () => {
        isShowMenu.value = false
        document.onwheel = null
      }
    }

    const init = async() => {
      // store.commit('setLoading', true)
      await getListData(<string>route.params.id)
      // store.commit('setLoading', false)
    }
    init()

    return {
      route,
      loading,
      showAll,
      playListInfo,
      musicList,
      isShowMenu,
      pointX,
      pointY,
      menuInfo,
      DateFormat,
      playAll,
      playSelect,
      showMenu
    }
  }
})
</script>

<style scoped>

</style>
