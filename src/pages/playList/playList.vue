<template>
  <div v-if="loading" style="width: calc((var(--block-size) + 20px) * var(--block-num))">
    <div class="head">
      <div class="cover">
        <a-image :preview="false" :src="list.coverImgUrl" />
      </div>
      <div class="content">
        <div class="info">
          <span class="h1" style="margin-bottom: 0px">{{ list.name }}</span>

          <!--          <div style="position: relative; margin-top: 5px;">-->
          <!--            <span id="description" :class="showAll?'description-show':'description'">{{ list.description }}-->
          <!--              <br><a v-if="showAll" style="float: right;font-size: 13px" @click="showAll=false">[收起]</a>-->
          <!--            </span>-->
          <!--            <a v-if="isOverflow&&!showAll" style="position: absolute;right: 0;font-size: 13px" @click="showAll=true">[展开]</a>-->
          <!--          </div>-->
        </div>
        <div class="creator">
          <a-avatar :src="list.creator.avatarUrl+'?param=100y100'" :size="36" style="margin-right: 10px" />
          <div style="display: flex;flex-direction: column">
            <span>{{ list.creator.nickname }}</span>
            <div>
              <span style="color: #929292;">最后更新于 {{ DateFormat(list.updateTime) }} • {{ list.trackCount }}首歌</span>
              <div class="tabs">
                <span v-for="item of list.tags" :key="item" style="margin-right: 10px">#{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span id="description" class="description">{{ list.description }}
          </span>
        </div>
        <div class="handle">
          <button class="bt-play discolour" @click="playAll(0)"><svg-icon name="play-fill" /> 播放</button>
          <button class="discolour"><svg-icon name="love" /></button>
          <button class="discolour">•••</button>
        </div>
      </div>
    </div>
    <div class="playList">
      <PlayItem v-for="(item,index) of listDetail" :key="item.id" :list-item="item" @dblclick="playSelect(index)" @contextmenu="(e)=>showMenu(e,item)" />
    </div>
    <ContextMenu v-show="isShowMenu" :point-x="pointX" :point-y="pointY" :info="menuInfo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { getListById, getMusicDetail } from '@/api/music'

export default defineComponent({
  name: 'PlayList',
  components: {
    PlayItem,
    ContextMenu
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)
    const list = ref(<any>{})
    const listDetail = ref(<any>[])
    const isOverflow = ref(false)
    const showAll = ref(false)
    const isShowMenu = ref(false)
    const pointX = ref(0)
    const pointY = ref(0)
    const menuInfo = ref()

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
          listDetail.value = details
        }
      })
    }

    const DateFormat = (date:string) => {
      const time = new Date(date)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      return y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日'
    }

    const playAll = (index:number) => {
      const ids = []
      for (const item of list.value.trackIds) {
        ids.push(item.id)
      }
      store.commit('setMusicList', ids)
      store.commit('setCurrIndex', index)
    }

    const playSelect = (index:number) => {
      store.commit('setCurrIndex', index)
    }

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
      await getListData(<string>route.params.id)
      store.commit('setLoading', false)
    }
    init()

    return {
      loading,
      isOverflow,
      showAll,
      list,
      listDetail,
      isShowMenu,
      pointX,
      pointY,
      menuInfo,
      DateFormat,
      playAll,
      playSelect,
      showMenu
    }
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  justify-content: space-between;
}
.cover{
  width: 280px;
  border-radius: 15px;
  overflow: hidden;
}
.content{
  width: calc(100% - 350px);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.creator{
  display: flex;
  align-items: center;
}
.tabs{
  display: inline-block;
  margin-left: 20px;
  color: #929292;
}
.description{
  width: 100%;
  font-size: 13px;
  color: #929292;
  padding-right: 40px;
  /*display: inline-block;*/
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*white-space:nowrap;*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
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
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  color: #FFFFFF;
  margin-right: 20px;
  outline: none;
  font-weight: bolder;
  color: #1a1a1a;
}
.bt-play{
  width: 100px;
  font-size: 18px;
}
.playList{
  margin-top: 50px;
}
</style>
