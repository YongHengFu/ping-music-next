<template>
  <div v-if="list.length>0">
    <div v-for="n of Math.ceil(list.length/blockNum)" :key="n">
      <Block
        v-for="m of blockNum"
        :key="m"
        style="display: inline-block;margin: 15px 10px"
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
    const open = (id:string) => {
      router.push({ name: 'playList', params: { id: id }})
    }
    const play = (id:string) => {

    }
    const blockNum = computed(():number => store.state.blockNum)
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
