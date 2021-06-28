<template>
  <div>
    <span class="h2" style="margin-bottom: 15px">专辑</span>
    <div v-for="n of Math.floor(albumList.length/blockNum)" :key="n" style="display: flex;justify-content: space-between">
      <MaxCover
        v-for="m of blockNum"
        :key="m"
        :image="albumList[(m-1)+(blockNum*(n-1))]?.picUrl"
        :text="albumList[(m-1)+(blockNum*(n-1))]?.name"
        @open="openAlbum(albumList[(m-1)+(blockNum*(n-1))]?.id)"
        @play="playAlbum(albumList[(m-1)+(blockNum*(n-1))]?.id)"
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

    onMounted(() => {
      getAlbumList()
    })

    return {
      blockNum,
      albumList,
      openAlbum
    }
  }
})
</script>

<style scoped>

</style>
