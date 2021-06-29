<template>
  <div>
    <div style="position: relative;height: 250px">
      <Banner class="banner" />
    </div>
    <div>
      <span class="h2">精选专辑<RightOutlined style="font-size: 22px;text-align: center" /></span>
      <div class="qual-list">
        <MaxCover
          v-for="n of quaList.length>(blockNum*2)?blockNum*2:quaList.length"
          :key="n"
          :image="quaList[n-1]?.picUrl"
          :text="quaList[n-1]?.name"
          @open="quaList([n-1]?.id)"
          @play="quaList([n-1]?.id)"
        />
      </div>
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
            @play="playSelect(newSong[(n-1)+(m-1)*3].id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { RightOutlined } from '@ant-design/icons-vue'
import Banner from '@/components/Banner.vue'
import MusicBlock from '@/components/MusicBlock.vue'

import { getNewSong, getPlayList_Qua } from '@/api/music'
import { playSingle } from '@/utils/musicList'
import '@lottiefiles/lottie-player'

export default defineComponent({
  name: 'Featured',
  components: {
    RightOutlined,
    Banner,
    MusicBlock
  },
  setup() {
    const store = useStore()
    const blockNum = computed(():number => store.state.blockNum)
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

    const playSelect = (id:string) => {
      playSingle(id)
    }

    const playAll = () => {
      /* if (newSongIdList.value.length > 0) {
        store.commit('setMusicList', newSongIdList.value)
      } else {
        getNewSongData()
      }*/
    }

    return {
      blockNum,
      quaList,
      newSong,
      newSongIdList,
      playSelect,
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
.qual-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
}
.MusicBlock{
  width: var(--page-width);
  display: flex;
  justify-content: space-between;
}
</style>
