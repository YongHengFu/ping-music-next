<template>
  <div v-if="topList.length>0">
    <div class="container">
      <span class="h2">超级榜</span>
      <div class="super-list">
        <BoardBlock
          v-for="item of superList"
          :key="item.id"
          :data="item"
          @open="openList(item?.id)"
          @play="playAll(item?.id)"
          @click="openList(item?.id)"
        />
      </div>
      <div class="cloud">
        <span class="h2">云听榜</span>
        <div class="order-list">
          <MaxCover
            v-for="item of cloudList"
            :key="item?.id"
            :image="item?.coverImgUrl"
            :text="item?.name"
            @open="openList(item?.id)"
            @play="playAll(item?.id)"
          />
        </div>
      </div>
      <div class="global">
        <span class="h2">全球榜</span>
        <div class="order-list">
          <MaxCover
            v-for="item of globalList"
            :key="item?.id"
            :image="item?.coverImgUrl"
            :text="item?.name"
            @open="openList(item?.id)"
            @play="playAll(item?.id)"
          />
        </div>
      </div>
      <div class="pattern">
        <span class="h2">花样榜</span>
        <div class="order-list">
          <MaxCover
            v-for="item of patternList"
            :key="item?.id"
            :image="item?.coverImgUrl"
            :text="item?.name"
            @open="openList(item?.id)"
            @play="playAll(item?.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BoardBlock from '@/components/BoardBlock.vue'
import MaxCover from '@/components/MaxCover.vue'
import { getTopList } from '@/api/music'
import { playList } from '@/utils/musicList'
export default defineComponent({
  name: 'Leaderboard',
  components: {
    BoardBlock,
    MaxCover
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const topList = ref(<any>[])
    const superList = ref(<any>[])
    const cloudList = ref(<any>[])
    const globalList = ref(<any>[])
    const patternList = ref(<any>[])

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
        } else if (item.name.indexOf('云音乐') !== -1 || item.name.indexOf('语榜') !== -1) {
          cloudList.value.push(item)
        } else {
          switch (item.name) {
            case '黑胶VIP爱听榜':
            case 'KTV唛榜':
            case '中国新乡村音乐排行榜':
            case '潜力爆款榜':
            case '听歌识曲榜':
            case '网络热歌榜':
              patternList.value.push(item)
              break
            default:
              globalList.value.push(item)
              break
          }
        }
      }
    }

    const openList = (id:string) => {
      router.push('/playList/' + id)
    }
    const playAll = (id:string) => {
      playList(id)
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
      openList,
      playAll
    }
  }
})
</script>

<style scoped>
.super-list{
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-template-rows: repeat(2, var(--block-size));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.order-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
</style>
