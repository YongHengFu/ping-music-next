<template>
  <div style="width: var(--page-width)">
    <ListHead
      v-if="Object.keys(albumInfo).length>0"
      :info="albumInfo"
      :type="1"
      @playAll="playAll"
    />
    <div>
      <AlbumItem
        v-for="(item,index) of musicList"
        :key="item.id"
        :music="item"
        :index="index"
        :list-id="listId"
        @playSelect="playSelect(item)"
        @dblclick="playSelect(item)"
        @contextmenu="(e)=>showMenu(e,index)"
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
import AlbumItem from '@/components/AlbumItem.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { getAlbumById, getMusicDetail } from '@/api/music'
import { playAble } from '@/utils/musicList'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'Album',
  components: {
    ListHead,
    AlbumItem,
    ContextMenu
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)
    const albumInfo = ref(<any>{})
    const musicList = ref(<any>[])
    const showAll = ref(false)
    const isShowMenu = ref(false)
    const pointX = ref(0)
    const pointY = ref(0)
    const menuInfo = ref({})
    let playMusicList:any = []
    let isPlayAll = false
    const listId = 'album' + route.params.id

    const getAlbumData = async(id:string) => {
      const param = { 'id': id }
      await getAlbumById(param).then(async(res:any) => {
        if (res.code === 200) {
          getAlbumInfo(res.album)
          getMusicList(res.songs)
          loading.value = true
        }
      })
    }

    const getAlbumInfo = (album:any) => {
      const info = {
        name: album.name,
        image: album.picUrl,
        description: album.description,
        creatorName: album.artist.name,
        creatorImg: album.artist.picUrl,
        time: album.publishTime,
        company: album.company,
        length: album.size,
        artists: album.artists
      }
      albumInfo.value = info
    }

    const getMusicList = async(songs:any) => {
      playMusicList = []
      let playIndex = 0
      let ids = ''
      for (const item of songs) {
        ids += item.id + ','
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
              listId: 'album' + route.params.id
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
          if (isPlayAll) {
            isPlayAll = false
            store.commit('setMusicList', playMusicList)
          }
        }
      })
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

    const showMenu = (e: { preventDefault: () => void; x: number; y: number }, index: number) => {
      e.preventDefault()
      isShowMenu.value = true
      pointX.value = e.x
      pointY.value = e.y
      const info = {
        name: musicList.value[index].name,
        image: albumInfo.value.image,
        artists: albumInfo.value.artists
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
      store.commit('setLoading', true)
      await getAlbumData(<string>route.params.id)
      store.commit('setLoading', false)
    }
    init()

    return {
      listId,
      loading,
      showAll,
      albumInfo,
      musicList,
      isShowMenu,
      pointX,
      pointY,
      menuInfo,
      showMenu,
      playAll,
      playSelect
    }
  }
})

</script>

<style scoped>

</style>
