<template>
  <div>
      <span class="h2" style="margin-bottom: 15px">
        <svg-icon name="fire-fill" style="color: red;font-size: 22px" />
        TOP 50 <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
      </span>
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
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import { getArtistAllMusic, getArtistHotMusic } from '@/api/music'
import { playAble } from '@/utils/musicList'
export default defineComponent({
  name: 'MusicList',
  components: {
    PlayItem
  },
  props: {
    artistId: String
  },
  setup(props, ctx) {
    const musicList = ref(<any>[])
    const listId = ref('allMusic' + props.artistId)

    const getMusicList = () => {
      const param = { id: props?.artistId }
      getArtistHotMusic(param).then((res:any) => {
        if (res.code === 200) {
          setMusicList(res.songs)
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
          artist: item.ar,
          album: item.al,
          mvId: item.mv,
          duration: item.dt / 1000,
          publishTime: item.publishTime,
          privileges: item.privileges,
          fee: item.fee,
          noCopyrightRcmd: item.noCopyrightRcmd,
          canPlay: null,
          listId: 'hotMusic' + props.artistId
        }
        song.canPlay = playAble(song)
        songList.push(song)
      }
      musicList.value = songList
    }

    onMounted(() => {
      getMusicList()
    })

    return {
      musicList,
      listId
    }
  }
})
</script>

<style scoped>
.play-all{
  font-size: 24px;
  color: var(--primary-color);
  cursor: pointer;
}
</style>
