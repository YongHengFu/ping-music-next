<template>
  <div v-if="loading" style="width: calc((var(--block-size) + 20px) * var(--block-num))">
    <div class="head">
      <div class="cover">
        <img :preview="false" :src="list.coverImgUrl" style=" border-radius: 5px;" />
      </div>
      <div class="content">
        <div class="info">
          <span class="h2" style="padding-bottom: 10px">{{ list.name }}</span>
          <div class="creator">
            <img :src="list.creator.avatarUrl" style="margin-right: 10px;width: 28px;border-radius: 50%" />
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
import { defineComponent, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MusicList from '@/components/MusicList.vue'

import { getListById, getMusicDetail } from '@/api/music'

export default defineComponent({
  name: 'PlayList',
  components: {
    MusicList
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)
    const list = ref({})
    const listDatail = ref(<any>[])
    const isOverflow = ref(false)
    const showAll = ref(false)

    watch(loading, () => {
      nextTick(() => {
        const description = document.getElementById('description')
        if (description !== null && description.scrollWidth > description.clientWidth) {
          isOverflow.value = true
        }
      })
    })
    const getListData = async(id:string) => {
      const param = { 'id': id }
      await getListById(param).then(async(res:any) => {
        if (res.code === 200) {
          list.value = res.playlist
          loading.value = true
          await getListDetail(res.playlist.trackIds)
        }
      })
    }
    const getListDetail = async(list:any) => {
      let ids = ''
      for (const item of list) {
        ids += item.id + ','
      }
      ids = ids.slice(0, ids.length - 1)
      const param = { 'ids': ids }
      await getMusicDetail(param).then((res:any) => {
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
          listDatail.value = details
        }
      })
    }

    const init = async() => {
      store.commit('setLoading', true)
      await getListData(<string>route.params.id)
      store.commit('setLoading', false)
    }
    init()

    return {
      loading,
      isOverflow,
      showAll,
      list,
      listDatail
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
