<template>
  <div class="artist-page">
    <Head />
    <Tabs :tab-list="tabList" @changeTab="changeTab" class="tabs"/>
    <component :is="currentTabComponent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Head from '@/pages/artist/components/Head.vue'
import Hot from '@/pages/artist/components/Hot.vue'
import MusicList from '@/pages/artist/components/Hot.vue'
import AlbumList from '@/pages/artist/components/Hot.vue'
import MvList from '@/pages/artist/components/Hot.vue'

export default defineComponent({
  name: 'Artist',
  components: {
    Tabs,
    Head,
    Hot,
    MusicList,
    AlbumList,
    MvList
  },
  setup(props, ctx) {
    const tabList = [
      { title: '热门', name: 'Hot' },
      { title: '歌曲', name: 'MusicList' },
      { title: '专辑', name: 'AlbumList' },
      { title: 'MV', name: 'MvList' }
    ]
    const currentTabComponent = ref('Hot')
    const info = ref({})

    const changeTab = (tabName:string) => {
      currentTabComponent.value = tabName
    }

    return {
      tabList,
      currentTabComponent,
      changeTab
    }
  }
})
</script>

<style scoped>
.tabs{
  margin: 50px 0 30px 0;
}
.artist-page{
  width: calc((var(--block-size) + 20px) * var(--block-num))!important;
}
</style>
