<template>
  <div style="user-select: none;padding: 20px 30px">
    <span class="h1">最近播放</span>
    <Tabs :tab-list="tabList" style="margin-bottom: 20px"/>
    <div>
      <button class="playAll"><svg-icon name="listPlay" /> 播放全部</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Tabs from '@/components/Tabs.vue'
export default defineComponent({
  name: 'HistoryPlay',
  components: {
    Tabs
  },
  data() {
    return {
      tabList: [
        { title: '歌曲12', name: 'Featured' },
        { title: '视频', name: 'Leaderboard' }
      ]
    }
  },
  computed: {
    detailList() {
      return this.$store.state.detailList
    }
  }
})
</script>

<style scoped>
.playAll{
  cursor: pointer;
  border: none;
  outline: none;
  font-size: 16px;
  background: var(--primary-color);
  color: #FFFFFF;
  border-radius: 30px;
  padding: 5px 15px;
  margin-bottom: 20px;
}
</style>
