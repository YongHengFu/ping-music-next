<template>
  <div v-if="list.length>0">
    <div v-for="n of Math.floor(list.length/blockNum)" :key="n" style="display: flex;justify-content: space-between">
      <Block
        v-for="m of blockNum"
        :key="m"
        :image="list[(m-1)+(blockNum*(n-1))]?.coverImgUrl"
        :text="list[(m-1)+(blockNum*(n-1))]?.name"
        @open="open(list[(m-1)+(blockNum*(n-1))]?.id)"
        @play="play(list[(m-1)+(blockNum*(n-1))]?.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Block from './MaxCover.vue'
import { playList } from '@/utils/musicList'
export default defineComponent({
  name: 'BlockList',
  components: {
    Block
  },
  props: {
    list: {
      type: Array
    }
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const blockNum = computed(():number => store.state.blockNum)

    const open = (id:string) => {
      router.push('/playList/' + id)
    }
    const play = (id:string) => {
      playList(id)
    }

    return {
      blockNum,
      open,
      play
    }
  }
})
</script>

<style scoped>

</style>
