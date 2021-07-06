<template>
  <div style="user-select: none;padding: 20px 30px">
    <span class="h1">最近播放</span>
    <Tabs :tab-list="tabList" style="margin-bottom: 20px" />
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'HistoryPlay',
  components: {
    Tabs
  },
  setup(props, ctx) {
    const route = useRoute()
    const tabList = [
      { title: '歌曲', name: 'MusicRecords' },
      { title: '视频', name: 'VideoRecords' }
    ]
    const currentTabComponent = ref('MusicRecords')

    const changeTab = (tabName:string) => {
      currentTabComponent.value = tabName
    }

    return {
      route,
      tabList,
      currentTabComponent,
      changeTab
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
