<template>
  <div>
    <span class="h2" style="margin-bottom: 15px">MV</span>
    <div class="mv-list">
      <VideoCover
        v-for="item of mvList"
        :key="item?.id"
        :image="item?.imgurl16v9"
        :video-id="item?.id"
        :text="item?.name"
        type="mv"
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
.mv-list{
  display: grid;
  grid-template-columns: repeat(4, calc((var(--page-width) - 60px) / 4));
  grid-template-rows: repeat(1, calc(((var(--page-width) - 60px) / 4) * (9 / 16) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
</style>
