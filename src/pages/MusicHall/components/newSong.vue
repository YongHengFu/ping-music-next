<template>
  <div>
    <div class="type-list">
      <span
        v-for="(item,index) of typeList"
        :key="item.value"
        class="area-list-item"
        :class="currTypeIndex===index?'type-list-item-active':''"
        @click="changeType(index)"
      >{{ item.tilte }}</span>
    </div>
    <div>
      <PlayItem
        v-for="(item,index) of newSongList"
        :id="listId+index"
        :key="item.id"
        :list-item="item"
        :list-id="listId"
        @playSelect="playSelect(item)"
        @dblclick="playSelect(item)"
        @contextmenu="(e)=>showMenu(e,item)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import { getNewSongList } from '@/api/music'
import { playAble } from '@/utils/musicList'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'NewSong',
  components: {
    PlayItem
  },
  setup(props, ctx) {
    const store = useStore()
    const newSongList = ref(<any>[])
    const currTypeIndex = ref(0)
    const typeList = [
      { tilte: '全部', value: '0' },
      { tilte: '华语', value: '7' },
      { tilte: '欧美', value: '96' },
      { tilte: '日本', value: '8' },
      { tilte: '韩国', value: '16' }
    ]
    const listId = ref('newSong' + currTypeIndex.value)
    const playMusicList:any = []
    let playIndex = 0

    const getNewSongData = () => {
      const param = { type: typeList[currTypeIndex.value].value }
      getNewSongList(param).then((res:any) => {
        if (res.code === 200) {
          playMusicList.value = []
          playIndex = 0
          setMusicList(res.data)
        }
      })
    }

    const setMusicList = (list:any) => {
      const songList = []
      for (const [index, item] of list.entries()) {
        const song:any = {
          index: index,
          id: item.id,
          name: item.name,
          artist: item.artists,
          album: item.album,
          mvId: item.mvid,
          duration: item.duration / 1000,
          publishTime: item.publishTime,
          privileges: item.privilege,
          fee: item.fee,
          noCopyrightRcmd: item.noCopyrightRcmd,
          canPlay: null,
          listId: listId.value
        }
        song.canPlay = playAble(song)
        songList.push(song)
        if (song.canPlay.able) {
          song.index = playIndex
          playIndex++
          playMusicList.push(song)
        }
      }
      newSongList.value = songList
    }

    const playAll = () => {
      if (playMusicList.length > 0) {
        store.commit('setCurrMusic', playMusicList[0])
        store.commit('setMusicList', playMusicList)
      }
    }

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
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

    const changeType = (index:number) => {
      currTypeIndex.value = index
      getNewSongData()
      listId.value = 'newSong' + currTypeIndex.value
    }
    onMounted(() => {
      getNewSongData()
    })

    return {
      typeList,
      currTypeIndex,
      newSongList,
      listId,
      changeType,
      playAll,
      playSelect
    }
  }
})
</script>

<style scoped>
.type-list{
  margin: 20px 0;
}
.type-list .area-list-item{
  padding: 1px 10px;
  margin-right: 10px;
  border-radius: 15px;
  cursor: pointer;
}
.type-list .type-list-item-active{
  background: var(--light-color);
  color: var(--primary-color);
}
</style>
