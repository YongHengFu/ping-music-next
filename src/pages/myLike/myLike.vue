<template>
  <div style="user-select: none;width: var(--page-width)">
    <span class="h1">我的喜欢</span>
    <div class="selections">
      <div v-for="item of tabs" :key="item.index" style="cursor: pointer;margin-right: 30px" @click="changeTab(item.index)">
        <span :style="{color: item.index===tabIndex?'var(--primary-color)':'#000000'}">{{ item.title }}</span>
        <div v-if="item.index===tabIndex" class="line" />
      </div>
    </div>
    <div>
      <button class="playAll" @click="playAll"> <svg-icon name="listPlay" /> 播放 </button>
      <!--      <button class="bt-play discolour" @click="playAll"><svg-icon name="play-fill" /> 播放</button>-->
    </div>
    <div>
      <PlayItem
        v-for="item of myLikeMusicList"
        :key="item.id"
        :list-item="item"
        @dblclick="playSelect(item)"
        @contextmenu="(e)=>showMenu(e,item)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, toRef, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import { getListById, getMusicDetail } from '@/api/music'
import { playAble, playList } from '@/utils/musicList'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'MyLike',
  components: {
    PlayItem
  },
  setup() {
    const store = useStore()
    const tabs = [{ index: 0, title: '歌曲' }, { index: 1, title: '专辑' }, { index: 2, title: '歌手' }, { index: 3, title: '视频' }]
    const tabIndex = ref(0)
    const myLikeMusicList = ref([])
    const changeTab = (index:number) => {
      tabIndex.value = index
    }
    const getLikeMusicList = (id:string) => {
      const param = { 'id': id }
      getListById(param).then((res:any) => {
        if (res.code === 200) {
          const list:any = []
          for (const [index, item] of res?.playlist?.tracks.entries()) {
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
              fee: item.fee,
              noCopyrightRcmd: item.noCopyrightRcmd,
              canPlay: null
            }
            song.canPlay = playAble(song)
            list.push(song)
            if (index % 50 === 0) {
              myLikeMusicList.value = list
            }
          }
          myLikeMusicList.value = list
          localStorage.setItem('myLikeMusicList', JSON.stringify(myLikeMusicList.value))
        }
      })
    }

    const getListData = async(id:string) => {
      const param = { 'id': id }
      await getListById(param).then(async(res:any) => {
        if (res.code === 200) {
          await getMusicList(res.playlist.trackIds)
        }
      })
    }

    const getMusicList = async(list:any) => {
      let ids = ''
      for (let i = 0; i < list.length; i += 50) {
        ids = ''
        if (i + 50 < list.length) {
          for (const item of list.slice(i, i + 50)) {
            ids += item.id + ','
          }
        } else {
          for (const item of list.slice(i, list.length)) {
            ids += item.id + ','
          }
        }
        const param = { 'ids': ids.slice(0, ids.length - 1) }
        await getMusicDetail(param).then((res:any) => {
          if (res.code === 200) {
            const songs = res.songs
            const details:any = []
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
                fee: item.fee,
                noCopyrightRcmd: item.noCopyrightRcmd,
                canPlay: null
              }
              song.canPlay = playAble(song)
              details.push(song)
            }
            myLikeMusicList.value = myLikeMusicList.value.concat(details)
          }
        })
      }
    }

    const playAll = () => {
      playList(<string>localStorage.getItem('myLikeMusicId'), '')
    }

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
        for (const item of store.state.musicList) {
          if (item.id === music.id) {
            store.commit('setCurrMusic', item)
            return
          }
        }
        playList(<string>localStorage.getItem('myLikeMusicId'), music.id)
      } else {
        message.error(music.canPlay.msg)
      }
    }
    onMounted(() => {
      const myLikeMusicId = localStorage.getItem('myLikeMusicId')
      if (myLikeMusicId) {
        getListData(myLikeMusicId)
        // myLikeMusicList.value = JSON.parse(<string>localStorage.getItem('myLikeMusicList'))
        // if (!myLikeMusicList.value) {
        // getLikeMusicList(myLikeMusicId)
        // }
      }
    })
    return {
      tabs,
      tabIndex,
      myLikeMusicList,
      changeTab,
      playAll,
      playSelect
    }
  }
})
</script>

<style scoped>
.selections{
  /*width: 120px;*/
  margin: 10px 0 20px 0;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.line{
  height: 4px;
  width: 25px;
  background: var(--primary-color);
  border-radius: 10px;
  margin-top: 3px;
  margin-left: 50%;
  transform: translateX(-50%);
  transition: 1s;
}
.playAll{
  cursor: pointer;
  border: none;
  outline: none;
  font-size: 16px;
  background: var(--primary-color);
  color: #FFFFFF;
  border-radius: 20px;
  padding: 5px 15px;
  margin-bottom: 20px;
}
/*button{
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  margin-right: 20px;
  outline: none;
  font-weight: bolder;
  color: #1a1a1a;
}*/
.bt-play{
  width: 100px;
  font-size: 18px;
}
</style>
