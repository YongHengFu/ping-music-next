<template>
  <div style="user-select: none;width: calc((var(--block-size) + 20px) * var(--block-num))">
    <span class="h1">音乐馆</span>
    <Tabs />
    <div style="position: relative;height: 250px">
      <Banner class="banner" />
    </div>
    <BlockList />
    <span class="h2" style="margin-right: 10px">大家都在听</span>
    <span style="font-size: 12px;border-radius: 20px;background: rgba(227,227,227,0.8);padding: 6px 12px"><svg-icon name="play-line" />播放全部</span>
    <div v-for="m of 3" :key="m" style="margin-bottom: 20px">
      <MusicBlock v-for="n of 3" :key="n" style="display: inline-block"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Banner from '@/components/Banner.vue'
import Tabs from '@/components/Tabs.vue'
import BlockList from '@/components/BlockList.vue'
import MusicBlock from '@/components/MusicBlock.vue'
import { homepage } from '../api/music'
export default defineComponent({
  name: 'MusicHall',
  components: {
    Banner,
    Tabs,
    BlockList,
    MusicBlock,
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
