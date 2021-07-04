<template>
  <div class="head">
    <div class="cover">
      <Image :src="artist?.cover+'?param=500y500'" :type="0" radius="5px" style="width: 100%" />
    </div>
    <div class="content">
      <div class="info">
        <span class="h1" style="margin-bottom: 0px">{{ artist?.name }}</span>
        <button class="discolour like-button" :class="isCollect?'like-active':''" @click="changeCollect"><svg-icon name="love" /></button>
      </div>
      <div>
        <span class="works">{{ artist?.musicSize }}首歌 • {{ artist?.albumSize }}张专辑 • {{ artist?.mvSize }}支MV</span>
      </div>
      <div>
        <span class="description" :title="artist?.briefDesc">{{ artist?.briefDesc }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, onUpdated } from 'vue'
import { useStore } from 'vuex'
import { getArtistInfo } from '@/api/music'
import { collectArtist } from '@/api/user'

export default defineComponent({
  name: 'Info',
  props: {
    artistId: String
  },
  setup(props, ctx) {
    const store = useStore()
    const artist = ref({})
    const isCollect = ref(false)
    const collectList = computed(() => store.state.collectArtistList)

    const getCollectState = () => {
      if (collectList.value.indexOf(props.artistId) !== -1) {
        isCollect.value = true
      } else {
        isCollect.value = false
      }
    }

    const changeCollect = () => {
      const param = {
        id: props.artistId,
        t: 1
      }
      if (isCollect.value) {
        param.t = 0
      }
      collectArtist(param).then((res:any) => {
        if (res.code === 200) {
          if (isCollect.value) {
            isCollect.value = false
            const index = collectList.value.indexOf(props.artistId)
            store.commit('setCollectArtistList', collectList.value.slice(index, 1))
          } else {
            isCollect.value = true
            const list = collectList.value
            list.push(props.artistId)
            store.commit('setCollectArtistList', list)
          }
        }
      })
    }

    const getArtistIndfoData = () => {
      const param = { id: props?.artistId }
      getArtistInfo(param).then((res:any) => {
        if (res?.code === 200) {
          artist.value = res?.data?.artist
        }
      })
    }

    onMounted(() => {
      getArtistIndfoData()
      getCollectState()
    })

    onUpdated(() => {
      getCollectState()
    })

    return {
      artist,
      isCollect,
      changeCollect
    }
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.cover{
  width: 230px;
  border-radius: 15px;
  overflow: hidden;
}
.content{
  width: calc(100% - 300px);
  height: 200px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.works{
  color: #5a5a5a;
  font-weight: bolder;
  font-size: 14px;
}
.description{
  width: 100%;
  font-size: 13px;
  color: #929292;
  padding-right: 40px;
  user-select: none;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}
.like-button{
  margin-top: 5px;
  width: 35px;
  height: 30px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
  margin-left: 40px;
  outline: none;
  font-weight: bolder;
  color: #1a1a1a;
}
.like-active{
  color: red!important;
}
</style>
