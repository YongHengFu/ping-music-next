<template>
  <div>
    <span class="h2" style="margin-bottom: 15px">MV</span>
    <div v-for="n of Math.floor(mvList.length/blockNum)" :key="n" style="display: flex;justify-content: space-between">
      <VideoCover
        v-for="m of blockNum"
        :key="m"
        :image="mvList[(m-1)+(blockNum*(n-1))]?.imgurl16v9"
        :text="mvList[(m-1)+(blockNum*(n-1))]?.name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import VideoCover from '@/components/VideoCover.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getArtistMv } from '@/api/music'
export default defineComponent({
  name: 'MvList',
  components: {
    VideoCover
  },
  props: {
    artistId: String
  },
  setup(props, ctx) {
    const router = useRouter()
    const store = useStore()
    const mvList = ref(<any>[])
    const blockNum = computed(():number => store.state.blockNum)
    let offset = 0

    const getMvList = () => {
      const param = {
        id: props?.artistId,
        limit: 30,
        offset: offset
      }
      getArtistMv(param).then((res:any) => {
        if (res.code === 200) {
          mvList.value = mvList.value.concat(res.mvs)
          if (res.hasMore) {
            offset = (offset + 1) * 30
            getMvList()
          }
        }
      })
    }

    onMounted(() => {
      getMvList()
    })

    return {
      blockNum,
      mvList
    }
  }
})
</script>

<style scoped>

</style>
