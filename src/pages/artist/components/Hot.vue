<template>
  <div>
    <div>
      <span class="h2">
        最近发布<span style="color: #00C3FF;font-weight: 800;font-size: 16px;letter-spacing: -1px">NEW</span>
      </span>
    </div>
    <div>
      <span class="h2" style="margin-bottom: 15px">
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
      <span class="h2">推荐专辑</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="album-list">
        <MaxCover
          v-for="n of albumList.length>(blockNum*2)?blockNum*2:albumList.length"
          :key="n"
          :image="albumList[n-1]?.picUrl"
          :text="albumList[n-1]?.name"
          @open="openAlbum(albumList[n-1]?.id)"
          @play="playAll(albumList[n-1]?.id)"
        />
      </div>
    </div>
    <div>
      <span class="h2">热门视频</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="mv-list">
        <VideoCover
          v-for="n of mvList.length>(blockNum*2)?blockNum*2:mvList.length"
          :key="n"
          :image="mvList[n-1]?.imgurl16v9"
          :text="mvList[n-1]?.name"
          :video-id="mvList[n-1]?.id"
          type="mv"
        />
      </div>
    </div>
    <div>
      <span class="h2">相似歌手</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="simi-list">
        <ArtistCover
          v-for="n of simiList.length>(blockNum*2)?blockNum*2:simiList.length"
          :key="n"
          :image="simiList[n-1]?.picUrl"
          :text="simiList[n-1]?.name"
          :artist-id="simiList[n-1]?.id"
        />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MusicBlock from '@/components/MusicBlock.vue'
import MaxCover from '@/components/MaxCover.vue'
import VideoCover from '@/components/VideoCover.vue'
import ArtistCover from '@/components/ArtistCover.vue'
import { getArtistAlbum, getArtistHotMusic, getArtistMv, getSimilarArtist } from '@/api/music'
import { playAble, playAblume } from '@/utils/musicList'

export default defineComponent({
  name: 'Hot',
  components: {
    MusicBlock,
    MaxCover,
    VideoCover,
    ArtistCover
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
    const simiList = ref(<any>[])

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

    const getSimiList = () => {
      const param = { id: props?.artistId }
      getSimilarArtist(param).then((res:any) => {
        if (res.code === 200) {
          simiList.value = res.artists
        }
      })
    }

    const openAlbum = (id:string) => {
      router.push('/album/' + id)
    }

    const playAll = (id:string) => {
      playAblume(id)
    }

    onMounted(() => {
      getMusicList()
      getAlbumList()
      getMvList()
      getSimiList()
    })
    return {
      blockNum,
      musicList,
      albumList,
      mvList,
      simiList,
      openAlbum,
      playAll
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
.MusicBlock{
  display: flex;
  justify-content: space-between;
}
.album-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.mv-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) * (9 / 16) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.simi-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
</style>
