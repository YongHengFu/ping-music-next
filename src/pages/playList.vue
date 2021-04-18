<template>
  <div v-if="loading" style="width: calc((var(--block-size) + 20px) * var(--block-num))">
    <div class="head">
      <div class="cover">
        <a-image :preview="false" :src="list.coverImgUrl" style=" border-radius: 5px;" />
      </div>
      <div class="content">
        <div class="info">
          <span class="h2" style="padding-bottom: 10px">{{ list.name }}</span>
          <div class="creator">
            <a-avatar :src="list.creator.avatarUrl" :size="28" style="margin-right: 10px" />
            <span style="font-size: 13px">{{ list.creator.nickname }}</span>
            <div class="tabs">
              <span v-for="item of list.tags" :key="item" style="margin-right: 10px">#{{ item }}</span>
            </div>
          </div>
          <div style="position: relative; margin-top: 5px;">
            <span id="description" :class="showAll?'description-show':'description'">{{ list.description }}
              <br><a v-if="showAll" style="float: right;font-size: 13px" @click="showAll=false">[收起]</a>
            </span>
            <a v-if="isOverflow&&!showAll" style="position: absolute;right: 0;font-size: 13px" @click="showAll=true">[展开]</a>
          </div>
        </div>
        <div class="handle">
          <button>播放全部</button>
          <button>收藏</button>
          <button>下载</button>
          <button>分享</button>
        </div>
      </div>
    </div>
    <MusicList v-if="listDatail.length>0" :data="listDatail" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MusicList from '@/components/MusicList.vue'

import { getListById, getMusicDetail } from '@/api/music'

export default defineComponent({
  name: 'PlayList',
  components: {
    MusicList
  },
  data() {
    return {
      list: {},
      listDatail: [],
      loading: false,
      isOverflow: false,
      showAll: false
    }
  },
  computed: {

  },
  watch: {
    loading() {
      if (this.loading) {
        const this_ = this
        this.$nextTick(function() {
          const description = document.getElementById('description')
          if (description.scrollWidth > description.clientWidth) {
            this_.isOverflow = true
          }
        })
      }
    }
  },
  async created() {
    this.$store.commit('setLoading')
    await this.getListData(this.$route.params.id)
    this.$store.commit('setLoading')
  },
  mounted() {

  },
  methods: {
    async  getListData(id) {
      const param = { 'id': id }
      await getListById(param).then(async(res) => {
        if (res.code === 200) {
          this.list = res.playlist
          this.loading = true
          await this.getListDetail(res.playlist.trackIds)
        }
      })
    },
    async getListDetail(list) {
      let ids = ''
      for (const item of list) {
        ids += item.id + ','
      }
      ids = ids.slice(0, ids.length - 1)
      const param = { 'ids': ids }
      await getMusicDetail(param).then((res) => {
        if (res.code === 200) {
          const songs = res.songs
          const details = []
          for (const item of songs) {
            details.push({
              id: item.id,
              name: item.name,
              artist: item.ar,
              album: item.al,
              mvId: item.mv,
              duration: item.dt / 1000,
              publishTime: item.publishTime
            })
          }
          this.listDatail = details
        }
      })
      // getMusicDetail(param).then((res) => {
      //   if (res.code === 200) {
      //     this.listDatail = res.playlist
      //   }
      // })
    }
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.cover{
  width: 150px;
  min-width: 150px;
  margin-right: 20px;
}
.content{
  width: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tabs{
  display: inline-block;
  margin-left: 30px;
  font-size: 13px;
  color: #929292;
}
.description{
  width: 100%;
  font-size: 13px;
  color: #929292;
  padding-right: 40px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.description-mask{
  width: 100%;
  position: absolute;
  z-index: 3;
  filter: blur(30px);
  overflow: hidden;
  background: #1DCF9F;
}
.description-show{
  width: 100%;
  font-size: 13px;
  position: absolute;
  padding: 10px 20px 5px 20px;
  z-index: 3;
  border-radius: 5px;
  overflow: hidden;
}
.description-show:after{
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: blur(30px);
  background: #eeeeee;
  z-index: -1;
}
button{
  width: 100px;
  padding: 4px 0;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  color: #FFFFFF;
  margin-right: 10px;
  outline: none;
  background: var(--primary-color);
}

</style>
