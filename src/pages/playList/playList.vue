<template>
  <div
    v-if="loading"
    :id="'playList'+listId"
    style="width: var(--page-width)"
  >
    <ListHead
      v-if="Object.keys(playListInfo).length>0"
      :info="playListInfo"
      :type="2"
      @playAll="playAll"
    />
    <div>
      <PlayItem
        v-for="(item,index) of musicList"
        :id="listId+index"
        :key="item.id"
        :list-item="item"
        :list-id="listId"
        @playSelect="playSelect(item)"
        @dblclick="playSelect(item)"
        @contextmenu="(e)=>showMenu(e,item)"
        @isCurr="(isCurr)=>showPosition(index,isCurr)"
      />
    </div>
    <div class="control">
      <div v-show="isShowPosition>-1" class="control-item" @click="toPosition">
        <svg-icon name="position" />
      </div>
      <div v-show="isShowTop" class="control-item" @click="toTop">
        <svg-icon name="top" />
      </div>
    </div>
    <ContextMenu
      v-if="Object.keys(menuInfo).length>0&&isShowMenu"
      :point-x="pointX"
      :point-y="pointY"
      :info="menuInfo"
      @close="isShowMenu=false"
      @playNow="playNow"
      @playWait="playWait"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated, onActivated, onDeactivated } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ListHead from '@/components/ListHead.vue'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { getListById, getMusicDetail } from '@/api/music'
import { playAble } from '@/utils/musicList'
import { message } from 'ant-design-vue'
import { debounce } from '@/utils/frequency'

export default defineComponent({
  name: 'PlayList',
  components: {
    ListHead,
    PlayItem,
    ContextMenu
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)
    const playListInfo = ref(<any>{})
    const musicList = ref(<any>[])
    const showAll = ref(false)
    const isShowMenu = ref(false)
    const pointX = ref(0)
    const pointY = ref(0)
    const menuInfo = ref({})
    const isShowPosition = ref(-1)
    const isShowTop = ref(false)
    let playMusicList:any = []
    let isPlayAll = false
    let currIndexs:boolean[] = []
    const listId = 'playList' + route.params.id
    let selectItem:any = null

    const getListData = async(id:string) => {
      const param = { 'id': id }
      await getListById(param).then(async(res:any) => {
        if (res.code === 200) {
          getPlayListInfo(res.playlist)
          loading.value = true
          await getMusicList(res.playlist.trackIds)
        }
      })
    }

    const getPlayListInfo = (playList:any) => {
      const info = {
        name: playList.name,
        image: playList.coverImgUrl,
        description: playList.description,
        creatorName: playList.creator.nickname,
        creatorImg: playList.creator.avatarUrl,
        time: playList.updateTime,
        length: playList.trackCount,
        type: 2
      }
      playListInfo.value = info
    }

    const getMusicList = async(list:any) => {
      playMusicList = []
      let playIndex = 0
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
            const details = []
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
                canPlay: null,
                listId: 'playList' + route.params.id
              }
              song.canPlay = playAble(song)
              details.push(song)
              if (song.canPlay.able) {
                song.index = playIndex
                playIndex++
                playMusicList.push(song)
              }
            }
            musicList.value = musicList.value.concat(details)
          }
        })
      }
      if (isPlayAll) {
        isPlayAll = false
        store.commit('setMusicList', playMusicList)
      }
    }

    const DateFormat = (date:string) => {
      const time = new Date(date)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      return y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日'
    }

    const playAll = () => {
      if (playMusicList.length > 0) {
        isPlayAll = true
        store.commit('setCurrMusic', playMusicList[0])
        store.commit('setMusicList', playMusicList)
      }
    }

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
        isPlayAll = true
        for (const item of playMusicList) {
          if (item.id === music.id) {
            store.commit('setCurrMusic', item)
            store.commit('setMusicList', playMusicList)
            return
          }
        }
      } else {
        message.error(music.canPlay.msg)
      }
    }

    const showMenu = (e: { preventDefault: () => void; x: number; y: number }, item: any) => {
      selectItem = item
      e.preventDefault()
      isShowMenu.value = true
      pointX.value = e.x
      pointY.value = e.y
      const info = {
        name: item.name,
        image: item.album.picUrl,
        artists: item.artist
      }
      menuInfo.value = info
    }

    const playNow = () => {
      isShowMenu.value = false
      if (selectItem) {
        playSelect(selectItem)
      }
    }

    const playWait = () => {
      isShowMenu.value = false
      if (selectItem) {
        if (selectItem.canPlay.able) {
          addPlayItem(selectItem)
          store.commit('setWaitNum', store.state.waitNum + 1)
        } else {
          message.error(selectItem.canPlay.msg)
        }
      }
    }

    const addPlayItem = (playItem:any) => {
      const currIndex = store.state.currMusic?.index
      const list = store.state.musicList
      list.splice(currIndex + 1, 0, playItem)
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === playItem.id && i !== currIndex + 1) {
          list.splice(i, 1)
          i--
          break
        }
        list[i].index = i
      }
      store.commit('setMusicList', list)
    }

    const computeTopPosition = () => {
      const playList = document.getElementById('playList' + listId)?.parentElement
      if (playList) {
        if (playList.scrollTop > 300) {
          isShowTop.value = true
        } else {
          isShowTop.value = false
        }
        let currIndex = -1
        for (let i = 0; i < currIndexs.length; i++) {
          if (currIndexs[i]) {
            currIndex = i
            break
          }
        }
        if (currIndex !== -1) {
          const item = document.getElementById(listId + currIndex + '')
          if ((item.offsetTop < playList.scrollTop) || (item.offsetTop > (playList.scrollTop + playList.clientHeight))) {
            isShowPosition.value = currIndex
          } else {
            isShowPosition.value = -1
          }
        }
      }
    }

    const toTop = () => {
      const playList = document.getElementById('playList' + listId)?.parentElement
      if (playList) {
        playList.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
        isShowTop.value = false
      }
    }

    const toPosition = () => {
      if (isShowPosition.value > -1) {
        const playList = document.getElementById('playList' + listId)?.parentElement
        const item = document.getElementById(listId + isShowPosition.value + '')
        if (playList) {
          playList.scrollTo({ left: 0, top: item.offsetTop - 200, behavior: 'smooth' })
          isShowPosition.value = -1
        }
      }
    }

    const showPosition = (index: number, isCurr: boolean) => {
      if (index === 0) {
        currIndexs = []
      }
      currIndexs.push(isCurr)
      if (isCurr) {
        getTopPosition()
      }
    }

    const getTopPosition = debounce(computeTopPosition, 300)

    onMounted(async() => {
      // store.commit('setLoading', true)
      await getListData(<string>route.params.id)
      // store.commit('setLoading', false)
    })

    onUpdated(() => {
      let playList = document.getElementById('playList' + listId)
      playList = playList?.parentElement
      if (playList) {
        playList.onscroll = () => {
          getTopPosition()
        }
      }
    })

    onActivated(() => {
      const playList = document.getElementById('playList' + listId)?.parentElement
      if (playList) {
        playList.onscroll = () => {
          getTopPosition()
        }
      }
    })

    onDeactivated(() => {
      const playList = document.getElementById('playList' + listId)?.parentElement
      if (playList) {
        playList.onscroll = null
      }
    })
    return {
      listId,
      loading,
      showAll,
      playListInfo,
      musicList,
      isShowMenu,
      pointX,
      pointY,
      menuInfo,
      isShowPosition,
      isShowTop,
      DateFormat,
      playAll,
      playSelect,
      showMenu,
      playNow,
      playWait,
      toTop,
      showPosition,
      toPosition
    }
  }
})
</script>

<style scoped>
.control{
  position: fixed;
  right: 30px;
  bottom: 80px;
  z-index: 2;
}
.control-item{
  background: rgba(232, 232, 232, 0.75);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;
}
.control-item:hover{
  border:1px var(--primary-color) solid;
  background: #FFFFFF;
  color: var(--primary-color);
}
</style>
