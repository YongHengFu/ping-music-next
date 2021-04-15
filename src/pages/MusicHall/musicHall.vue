<template>
  <div style="user-select: none;width: calc((var(--block-size) + 20px) * var(--block-num))">
    <p class="h1">音乐馆</p>
    <Tabs @changeTab="changeTab" />
    <component :is="currentTabComponent" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
  data() {
    return {
      currentTabComponent: 'Featured'
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    changeTab(tabName) {
      this.currentTabComponent = tabName
    }
  }
})
</script>

<style scoped>
/*.banner{*/
/*  position: absolute;*/
/*  left: 50%;*/
/*  transform: translateX(-50%);*/
/*}*/
/*.play-all{*/
/*  font-size: 24px;*/
/*  color: #000c17;*/
/*  cursor: pointer;*/
/*}*/
</style>
