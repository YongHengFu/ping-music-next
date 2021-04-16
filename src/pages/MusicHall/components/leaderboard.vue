<template>
  <div v-if="topList.length>0">
    <div class="container">
      <div class="super">
        <span class="h2">超级榜</span>
        <BoardBlock
          v-for="item of superList"
          :key="item.id"
          :data="item"
          class="block"
        />
      </div>
      <div class="cloud">
        <span class="h2">云听榜</span>
        <BlockList :list="cloudList" />
      </div>
      <div class="area">
        <span class="h2">地区榜</span>
        <BlockList :list="areaList" />
      </div>
      <div class="pattern">
        <span class="h2">花样榜</span>
        <BlockList :list="patternList" />
      </div>
    </div>
    -
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BoardBlock from '@/components/BoardBlock.vue'
import BlockList from '@/components/BlockList.vue'
import { getTopList } from '@/api/music'
export default defineComponent({
  name: 'Leaderboard',
  components: {
    BoardBlock,
    BlockList
  },
  data() {
    return {
      topList: [],
      superList: [],
      cloudList: [],
      areaList: [],
      patternList: []
    }
  },
  created() {
    this.getTopListData()
  },
  methods: {
    getTopListData() {
      getTopList().then((res) => {
        if (res.code === 200) {
          this.topList = res.list
          this.classify(res.list)
        }
      })
    },
    classify(list) {
      for (const [index, item] of list.entries()) {
        if (index < 4) {
          this.superList.push(item)
        } else if (item.name.indexOf('云音乐') !== -1) {
          this.cloudList.push(item)
        } else {
          switch (item.name) {
            case '黑胶VIP爱听榜':
            case 'KTV唛榜':
            case '中国新乡村音乐排行榜':
            case '潜力爆款榜':
            case '听歌识曲榜':
              this.patternList.push(item)
              break
            default:
              this.areaList.push(item)
              break
          }
        }
      }
    }
  }
})
</script>

<style scoped>
.container{

}
.super{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.block{
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
