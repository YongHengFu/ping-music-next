<template>
  <div>
    <div>
      <span class="h2">
        最近发布<span style="color: #00C3FF;font-weight: 800;font-size: 16px;letter-spacing: -1px">NEW</span>
      </span>
    </div>
    <div>
      <span class="h2" style="margin-bottom: 15px">
        <!--      <FireFilled style="color: red;font-size: 22px" />-->
        <svg-icon name="fire-fill" style="color: red;font-size: 22px" />
        TOP 50 <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
      </span>
      <div v-for="m of 5" :key="m" class="MusicBlock">
        <MusicBlock
          v-for="n of 4"
          :key="n"
          :music="musicList[(n-1)+(m-1)*3]"
          :index="(n-1)+(m-1)*3"
          @play="playSelect(musicList[(n-1)+(m-1)*3].id)"
        />
      </div>
    </div>
    <div>
      <span class="h2">热门专辑</span>
      <span class="discolour" style="float: right;cursor: pointer">更多</span>
      <div v-for="n of Math.ceil(albumList.length/blockNum)" :key="n">
        <MaxCover
          v-for="m of blockNum"
          :key="m"
          style="display: inline-block;margin: 15px 5px"
          :image="albumList[(m-1)+(blockNum*(n-1))]?.picUrl"
          :text="albumList[(m-1)+(blockNum*(n-1))]?.name"
          @open="openAlbum(albumList[(m-1)+(blockNum*(n-1))]?.id)"
          @play="playAlbum(albumList[(m-1)+(blockNum*(n-1))]?.id)"
        />
      </div>
    </div>
    <div>
      <span class="h2">热门MV</span>
      <span class="discolour" style="float: right;cursor: pointer">更多</span>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MusicBlock from '@/components/MusicBlock.vue'
import { getArtistAlbum, getArtistHotMusic, getArtistMv } from '@/api/music'
import { FireFilled } from '@ant-design/icons-vue'
import { playAble } from '@/utils/musicList'
import MaxCover from '@/components/MaxCover.vue'

export default defineComponent({
  name: 'Hot',
  components: {
    MaxCover,
    FireFilled,
    MusicBlock
  },
  props: {
    artistId: String
  },
  setup(props, ctx) {
    const router = useRouter()
    const store = useStore()
    const blockNum = computed(():number => store.state.blockNum)
    const musicList = ref(<any>[])
    const albumList = ref(<any>[])
    const mvList = ref(<any>[])

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

    const getAlbumList = () => {
      const param = {
        id: props?.artistId,
        limit: 12,
        offset: 0
      }
      getArtistAlbum(param).then((res:any) => {
        if (res.code === 200) {
          albumList.value = res.hotAlbums
        }
      })
    }

    const getMvList = () => {
      const param = {
        id: props?.artistId,
        limit: 12,
        offset: 0
      }
      getArtistMv(param).then((res:any) => {
        if (res.code === 200) {
          mvList.value = res.mvs
        }
      })
    }

    const openAlbum = (id:string) => {
      router.push('/album/' + id)
    }

    onMounted(() => {
      getMusicList()
      getAlbumList()
      getMvList()
    })
    return {
      blockNum,
      musicList,
      albumList,
      mvList,
      openAlbum
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
.play-all:hover{
}
.MusicBlock{
  width: calc((var(--block-size) + 20px) * var(--block-num));
  display: flex;
  justify-content: space-between;
}
</style>
