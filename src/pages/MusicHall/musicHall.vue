<template>
  <div style="user-select: none;width: var(--page-width)">
    <span class="h1">音乐馆</span>
    <Tabs :tab-list="tabList" @changeTab="changeTab" :tabName="goToName"/>
    <component :is="currentTabComponent" @change="change" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Featured from '@/pages/MusicHall/components/featured.vue'
import Leaderboard from '@/pages/MusicHall/components/leaderboard.vue'
import PrivateContent from '@/pages/MusicHall/components/privateContent.vue'
import PlayList from '@/pages/MusicHall/components/playList.vue'
import Artist from '@/pages/MusicHall/components/artist.vue'
import NewSong from '@/pages/MusicHall/components/newSong.vue'
import '@lottiefiles/lottie-player'

export default defineComponent({
  name: 'MusicHall',
  components: {
    Tabs,
    Featured,
    Leaderboard,
    PrivateContent,
    PlayList,
    Artist,
    NewSong
  },
  setup() {
    const goToName = ref('Featured')
    const tabList = [
      { title: '精选推荐', name: 'Featured' },
      { title: '歌单', name: 'PlayList' },
      { title: '独家放送', name: 'PrivateContent' },
      { title: '排行榜', name: 'Leaderboard' },
      { title: '歌手', name: 'Artist' },
      { title: '新歌速递', name: 'NewSong' }
    ]
    const currentTabComponent = ref('Featured')

    const changeTab = (tabName:string) => {
      currentTabComponent.value = tabName
      goToName.value = ''
    }
    const change = (tabName:string) => {
      goToName.value = tabName
    }
    return {
      tabList,
      currentTabComponent,
      goToName,
      changeTab,
      change
    }
  }
})
</script>

<style scoped>

</style>
