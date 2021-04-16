<template>
  <div>
    <div style="position: relative;height: 250px">
      <Banner class="banner" />
    </div>
    <div>
      <span class="h2">精选专辑&nbsp;<RightOutlined style="font-size: 22px;text-align: center"/></span>
      <BlockList :list="quaList" v-if="quaList.length>0"/>
    </div>
    <div>
      <span class="h2" style="margin-right: 10px">最新先听
        <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
      </span>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import Banner from '@/components/Banner.vue'
import BlockList from '@/components/BlockList.vue'
import MusicBlock from '@/components/MusicBlock.vue'

import { homepage, getNewSong, getMusicById, getPlayList_Qua } from '../../../api/music'

export default defineComponent({
  name: 'Featured',
  components: {
    RightOutlined,
    Banner,
    BlockList,
    MusicBlock
  },
  data() {
    return {
      homePageData: {},
      quaList: [],
      newSong: [],
      newSongIdList: []
    }
  },
  created() {
    this.getQuaList()
    this.getNewSongData()
  },
  methods: {
    getHomePageData() {
      homepage().then((res) => {
        this.homePageData = res.data
      })
    },
    getQuaList() {
      this.param = { before: '', limit: 12 }
      getPlayList_Qua(this.param).then((res) => {
        if (res.code === 200) {
          this.quaList = res.playlists
        }
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
      if (type === 0) {
        const param = { id: this.newSong[index].id }
        await getMusicById(param).then((res) => {
          if (res.code === 200) {
            const param = { prop: 'src', value: res.data[0].url }
            this.$store.commit('setAudio', param)
          }
        })
      }
    },
    playAll() {
      if (this.newSongIdList.length > 0) {
        this.$store.commit('setMusicList', this.newSongIdList)
      } else {
        this.getNewSongData()
        // this.playAll()
      }
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
</style>
