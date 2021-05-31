<template>
  <div style="width: calc((var(--block-size) + 20px) * var(--block-num))">
    <ListHead v-if="Object.keys(albumInfo).length>0" :info="albumInfo" />
    <div class="music-list">
      <AlbumItem v-for="(item,index) of musicList" :key="item.id" :music="item" :index="index"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ListHead from '@/components/ListHead.vue'
import AlbumItem from '@/components/AlbumItem.vue'
import { getAlbumById } from '@/api/music'
export default defineComponent({
  name: 'Album',
  components: {
    ListHead,
    AlbumItem
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
    const menuInfo = ref()

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
        artist: album.artist,
        publishTime: album.publishTime,
        company: album.company,
        size: album.size
      }
      albumInfo.value = info
    }

    const getMusicList = (songs:any) => {
      const list = []
      for (const item of songs) {
        const song = {
          id: item.id,
          name: item.name,
          duration: item.dt
        }
        list.push(song)
      }
      musicList.value = list
    }

    /*    const playAll = (index:number) => {
      const ids = []
      for (const item of list.value.trackIds) {
        ids.push(item.id)
      }
      store.commit('setMusicList', ids)
      store.commit('setCurrIndex', index)
    }

    const playSelect = (index:number) => {
      store.commit('setCurrIndex', index)
    }*/

    const showMenu = (e: { preventDefault: () => void; x: number; y: number }, item) => {
      e.preventDefault()
      isShowMenu.value = true
      pointX.value = e.x
      pointY.value = e.y
      menuInfo.value = item
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
      showMenu
    }
  }
})

</script>

<style scoped>

</style>
