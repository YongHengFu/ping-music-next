<template>
  <div style="user-select: none;position: relative">
    <h1>音乐馆</h1>
    <Tabs />
    <Banner v-if="banners.length>0" class="banner" :banners="banners" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Banner from '@/components/Banner.vue'
import Tabs from '@/components/Tabs.vue'

import { homepage } from '@/api/music.ts'
export default defineComponent({
  name: 'MusicHall',
  components: {
    Banner,
    Tabs,
  },
  data() {
    return {
      homePageData: {},
      banners: [],
    }
  },
  created() {
    this.getHomePageData()
  },
  methods: {
    getHomePageData() {
      homepage().then((res) => {
        this.homePageData = res.data
        this.banners = res.data.blocks[0].extInfo.banners
      })
    },
  },
})
</script>

<style scoped>
.banner{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
