<template>
  <div style="user-select: none;position: relative">
    <h1>音乐馆</h1>
    <Tabs />
    <Banner class="banner" />
    <BlockList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Banner from '@/components/Banner.vue'
import Tabs from '@/components/Tabs.vue'
import BlockList from '@/components/BlockList.vue'

import { homepage } from '@/api/music.ts'
export default defineComponent({
  name: 'MusicHall',
  components: {
    Banner,
    Tabs,
    BlockList,
  },
  data() {
    return {
      homePageData: {},
    }
  },
  created() {
    // this.getHomePageData()
  },
  methods: {
    getHomePageData() {
      homepage().then((res) => {
        this.homePageData = res.data
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
