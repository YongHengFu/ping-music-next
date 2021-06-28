<template>
  <div v-if="topList.length>0">
    <div class="container">
      <span class="h2">超级榜</span>
      <div v-for="n of 2" :key="n" class="super">
        <BoardBlock
          v-for="item of superList.slice(n*2,(n+1)*2)"
          :key="item.id"
          :data="item"
          class="block"
          @open="open(item?.id)"
          @play="play(item?.id)"
          @click="open(item?.id)"
        />
      </div>
      <div class="cloud">
        <span class="h2">云听榜</span>
        <BlockList :list="cloudList" />
      </div>
      <div class="global">
        <span class="h2">全球榜</span>
        <BlockList :list="globalList" />
      </div>
      <div class="pattern">
        <span class="h2">花样榜</span>
        <BlockList :list="patternList" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BoardBlock from '@/components/BoardBlock.vue'
import BlockList from '@/components/BlockList.vue'
import { getTopList } from '@/api/music'
import { playList } from '@/utils/musicList'
export default defineComponent({
  name: 'Leaderboard',
  components: {
    BoardBlock,
    BlockList
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const topList = ref(<any>[])
    const superList = ref(<any>[])
    const cloudList = ref(<any>[])
    const globalList = ref(<any>[])
    const patternList = ref(<any>[])

    const open = (id:string) => {
      router.push('/playList/' + id)
    }

    const play = (id:string) => {
      playList(id)
    }

    const getTopListData = async() => {
      await getTopList().then((res:any) => {
        if (res.code === 200) {
          topList.value = res.list
          classify(res.list)
        }
      })
    }
    const classify = (list:any) => {
      for (const [index, item] of list.entries()) {
        if (index < 4) {
          superList.value.push(item)
        } else if (item.name.indexOf('云音乐') !== -1) {
          cloudList.value.push(item)
        } else {
          switch (item.name) {
            case '黑胶VIP爱听榜':
            case 'KTV唛榜':
            case '中国新乡村音乐排行榜':
            case '潜力爆款榜':
            case '听歌识曲榜':
              patternList.value.push(item)
              break
            default:
              globalList.value.push(item)
              break
          }
        }
      }
    }

    const init = async() => {
      store.commit('setLoading', true)
      await getTopListData()
      store.commit('setLoading', false)
    }
    init()

    return {
      topList,
      superList,
      cloudList,
      globalList,
      patternList,
      open,
      play
    }
  }
})
</script>

<style scoped>
.container{

}
.super{
  display: flex;
  justify-content: space-between;
}
.block{
  margin-top: 20px;
  width: calc((var(--page-width) - 10) / 2);
}
</style>
