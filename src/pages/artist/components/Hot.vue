<template>
  <div>
    <div>
      <span class="h2">
        最近发布<span style="color: #00C3FF;font-weight: 800;font-size: 16px;letter-spacing: -1px">NEW</span>
      </span>
    </div>
    <div>
      <span class="h2">
        <!--      <FireFilled style="color: red;font-size: 22px" />-->
        <svg-icon name="fire-fill" style="color: red;font-size: 22px" />
        TOP 50 <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
      </span>
      <div v-for="m of 3" :key="m" class="MusicBlock">
        <MusicBlock
          v-for="n of 3"
          :key="n"
          :song="musicList[(n-1)+(m-1)*3]"
          :index="(n-1)+(m-1)*3"
          @play="playSelect(musicList[(n-1)+(m-1)*3].id)"
        />
      </div>
    </div>
    <div>
      <span class="h2">热门专辑</span>
      <span class="discolour" style="float: right;cursor: pointer">更多</span>
    </div>
    <div>
      <span class="h2">热门MV</span>
      <span class="discolour" style="float: right;cursor: pointer">更多</span>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import MusicBlock from '@/components/MusicBlock.vue'
import { getArtistAlbum, getArtistHotMusic, getArtistMv } from '@/api/music'
import { FireFilled } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Hot',
  components: {
    FireFilled,
    MusicBlock
  },
  setup(props, ctx) {
    const musicList = ref([])
    const albumList = ref([])
    const mvList = ref([])

    const getMusicList = () => {
      const param = { id: props?.id }
      getArtistHotMusic(param).then((res) => {
        if (res.code === 200) {
          musicList.value = res.songs
        }
      })
    }

    const getAlbumList = () => {
      const param = {
        id: props?.id,
        limit: 12,
        offset: 0
      }
      getArtistAlbum(param).then((res) => {
        if (res.code === 200) {
          albumList.value = res.hotAlbums
        }
      })
    }

    const getMvList = () => {
      const param = {
        id: props?.id,
        limit: 12,
        offset: 0
      }
      getArtistMv(param).then((res) => {
        if (res.code === 200) {
          mvList.value = res.mvs
        }
      })
    }

    onMounted(() => {
      getMusicList()
      getAlbumList()
      getMvList()
    })
    return {
      musicList,
      albumList,
      mvList
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
</style>
