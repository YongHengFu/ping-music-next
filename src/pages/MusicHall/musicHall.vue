<template>
  <div style="user-select: none;width: calc((var(--block-size) + 20px) * var(--block-num))">
    <span class="h1">音乐馆</span>
    <Tabs @changeTab="changeTab" />
    <component :is="currentTabComponent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Featured from '@/pages/MusicHall/components/featured.vue'
import Leaderboard from '@/pages/MusicHall/components/leaderboard.vue'
import '@lottiefiles/lottie-player'

// import { homepage, getNewSong, getMusicById } from '../../api/music'
export default defineComponent({
  name: 'MusicHall',
  components: {
    Tabs,
    Featured,
    Leaderboard
  },
  setup() {
    const currentTabComponent = ref('Featured')

    const changeTab = (tabName:string) => {
      currentTabComponent.value = tabName
    }
    return {
      currentTabComponent,
      changeTab
    }
  }
})
</script>

<style scoped>

</style>
