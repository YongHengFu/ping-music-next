<template>
  <div style="user-select: none;width: calc((var(--block-size) + 20px) * var(--block-num))">
    <span class="h1">音乐馆</span>
    <Tabs />
    <div style="position: relative;height: 250px">
      <Banner class="banner" />
    </div>
    <BlockList />
    <span class="h2" style="margin-right: 10px">最新听
      <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
    </span>
    <!--    <span-->
    <!--      style="font-size: 12px;border-radius: 20px;background: rgba(227,227,227,0.8);padding: 6px 12px"-->
    <!--      @click="playAll"-->
    <!--    ><svg-icon name="play-line" />播放全部</span>-->
    <div v-if="newSong.length>0">
      <div v-for="m of 3" :key="m" style="margin-bottom: 20px">
        <MusicBlock
          v-for="n of 3"
          :key="n"
          style="display: inline-block"
          :song="newSong[(n-1)+(m-1)*3]"
          :index="(n-1)+(m-1)*3"
          @handleMusicBlock="clickMusicBlock"
        />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Banner from '@/components/Banner.vue'
import Tabs from '@/components/Tabs.vue'
import BlockList from '@/components/BlockList.vue'
import MusicBlock from '@/components/MusicBlock.vue'
import { homepage, getNewSong, getMusicById } from '../api/music'
export default defineComponent({
  name: 'MusicHall',
  components: {
    Banner,
    Tabs,
    BlockList,
    MusicBlock,
  },
  data() {
    return {
      homePageData: {},
      newSong: [],
      newSongIdList: [],
    }
  },
  async created() {
    // this.getHomePageData()
    await this.getNewSongData()
  },
  methods: {
    getHomePageData() {
      homepage().then((res) => {
        this.homePageData = res.data
      })
    },
    getNewSongData() {
      const param = { limit: 50 }
      getNewSong(param).then((res) => {
        if (res.code === 200) {
          this.newSong = res.result
          for (const item of this.newSong) {
            this.newSongIdList.push(item.id)
          }
          // this.$store.state.commit('setMusicList', this.newSongIdList)
        }
      })
    },
    async clickMusicBlock(type, index) {
      console.log('asd')
      if (type === 0) {
        const param = { id: this.newSong[index].id }
        await getMusicById(param).then((res) => {
          if (res.code === 200) {
            const param = { prop: 'src', value: res.data[0].url }
            this.$store.commit('setAudio', param)
          }
        })
      } else {

      }
    },
    playAll() {
      console.log('p')
      if (this.newSongIdList.length > 0) {
        this.$store.commit('setMusicList', this.newSongIdList)
      } else {
        this.getNewSongData()
        // this.playAll()
      }
    },
  },
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
</style>
