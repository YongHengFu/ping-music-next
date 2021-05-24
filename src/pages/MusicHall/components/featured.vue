<template>
  <div>
    <div style="position: relative;height: 250px">
      <Banner class="banner" />
    </div>
    <div>
      <span class="h2">精选专辑<RightOutlined style="font-size: 22px;text-align: center" /></span>
      <BlockList v-if="quaList.length>0" :list="quaList" />
    </div>
    <div>
      <span class="h2" style="margin-right: 10px">最新先听 <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
      </span>
      <div v-if="newSong.length>0">
        <div v-for="m of 3" :key="m" class="MusicBlock">
          <MusicBlock
            v-for="n of 3"
            :key="n"
            :song="newSong[(n-1)+(m-1)*3]"
            :index="(n-1)+(m-1)*3"
            @play="playSingle(newSong[(n-1)+(m-1)*3])"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { RightOutlined } from '@ant-design/icons-vue'
import Banner from '@/components/Banner.vue'
import BlockList from '@/components/BlockList.vue'
import MusicBlock from '@/components/MusicBlock.vue'

import { getNewSong, getPlayList_Qua } from '@/api/music'
import '@lottiefiles/lottie-player'
export default defineComponent({
  name: 'Featured',
  components: {
    RightOutlined,
    Banner,
    BlockList,
    MusicBlock
  },
  setup() {
    const store = useStore()
    const quaList = ref(<any>[])
    const newSong = ref(<any>[])
    const newSongIdList = ref(<string[]>[])

    const getQuaList = async() => {
      const param = { before: '', limit: 12 }
      await getPlayList_Qua(param).then((res:any) => {
        if (res.code === 200) {
          quaList.value = res.playlists
        }
      })
    }
    const getNewSongData = async() => {
      const param = { limit: 50 }
      await getNewSong(param).then((res:any) => {
        if (res.code === 200) {
          newSong.value = res.result
          for (const item of newSong.value) {
            newSongIdList.value.push(item.id)
          }
          // this.$store.state.commit('setMusicList', this.newSongIdList)
        }
      })
    }

    const init = async() => {
      store.commit('setLoading', true)
      await getQuaList()
      await getNewSongData()
      store.commit('setLoading', false)
    }
    init()

    const playSingle = (item:any) => {
      const songItem = {
        id: item.id,
        name: item.name,
        artist: item.song.artists,
        album: item.song.album,
        mvId: item.song.mvid,
        duration: item.song.duration / 1000,
        publishTime: item.song.album.publishTime
      }
      store.commit('insertMusicList', songItem.id)
      store.commit('insertDetailList', songItem)
      store.commit('setCurrIndex', store.state.currIndex + 1)
    }

    const playAll = () => {
      if (newSongIdList.value.length > 0) {
        store.commit('setMusicList', newSongIdList.value)
      } else {
        getNewSongData()
      }
    }

    return {
      quaList,
      newSong,
      newSongIdList,
      playSingle,
      playAll
    }
  }
})
</script>

<style scoped>
.banner{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.play-all{
  font-size: 24px;
  color: #000c17;
  cursor: pointer;
}
.MusicBlock{
  width: calc((var(--block-size) + 20px) * var(--block-num));
  display: flex;
  justify-content: space-between;
}
</style>
