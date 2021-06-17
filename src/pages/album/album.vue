<template>
  <div style="width: calc((var(--block-size) + 20px) * var(--block-num))">
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
        @dblclick="playSelect(index)"
        @contextmenu="(e)=>showMenu(e,index)"
      />
    </div>
    <ContextMenu v-if="Object.keys(menuInfo).length>0" v-show="isShowMenu" :point-x="pointX" :point-y="pointY" :info="menuInfo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ListHead from '@/components/ListHead.vue'
import AlbumItem from '@/components/AlbumItem.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { getAlbumById, getMusicDetail } from '@/api/music'
import { playAble, playAblume } from '@/utils/musicList'
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

    /*    watch(loading, () => {
      nextTick(() => {
        const description = document.getElementById('description')
        if (description !== null && description.scrollWidth > description.clientWidth) {
          isOverflow.value = true
        }
      })
    })*/
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
              noCopyrightRcmd: item.noCopyrightRcmd,
              canPlay: null
            }
            song.canPlay = playAble(song)
            details.push(song)
          }
          musicList.value = musicList.value.concat(details)
        }
      })
    }

    const playAll = (index:number) => {
      playAblume(<string>route.params.id)
    }

    const playSelect = (index:number) => {
      store.commit('setCurrMusic', store.state.musicList[index])
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
      // console.log(e.x, e.y)
    }

    const init = async() => {
      store.commit('setLoading', true)
      await getAlbumData(<string>route.params.id)
      store.commit('setLoading', false)
    }
    init()

    return {
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
