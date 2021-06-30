<template>
  <div>
    <span class="h2" style="margin-bottom: 15px">专辑</span>
    <div class="album-list">
      <MaxCover
        v-for="item of albumList"
        :key="item?.id"
        :image="item?.picUrl"
        :text="item?.name"
        @open="openAlbum(item?.id)"
        @play="playAll(item?.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MaxCover from '@/components/MaxCover.vue'
import { getArtistAlbum } from '@/api/music'
import { playAblume } from '@/utils/musicList'

export default defineComponent({
  name: 'MusicList',
  components: {
    MaxCover
  },
  props: {
    artistId: String
  },
  setup(props, ctx) {
    const router = useRouter()
    const store = useStore()
    const albumList = ref(<any>[])
    const blockNum = computed(():number => store.state.blockNum)
    let offset = 0

    const getAlbumList = () => {
      const param = {
        id: props?.artistId,
        limit: 30,
        offset: offset
      }
      getArtistAlbum(param).then((res:any) => {
        if (res.code === 200) {
          albumList.value = albumList.value.concat(res.hotAlbums)
          if (res.more) {
            offset = (offset + 1) * 30
            getAlbumList()
          }
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
      getAlbumList()
    })

    return {
      blockNum,
      albumList,
      openAlbum,
      playAll
    }
  }
})
</script>

<style scoped>
.album-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
</style>
