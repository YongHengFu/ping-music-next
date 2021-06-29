<template>
  <div class="artist-page">
    <Head :artist-id="route.params?.id" />
    <Tabs :tab-list="tabList" class="tabs" @changeTab="changeTab" />
    <keep-alive>
      <component :is="currentTabComponent" :artist-id="route.params?.id" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import Tabs from '@/components/Tabs.vue'
import Head from '@/pages/artist/components/Head.vue'
import Hot from '@/pages/artist/components/Hot.vue'
import MusicList from '@/pages/artist/components/MusicList.vue'
import AlbumList from '@/pages/artist/components/AlbumList.vue'
import MvList from '@/pages/artist/components/MvList.vue'

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
    const route = useRoute()
    const tabList = [
      { title: '精选', name: 'Hot' },
      { title: '歌曲', name: 'MusicList' },
      { title: '专辑', name: 'AlbumList' },
      { title: 'MV', name: 'MvList' }
    ]
    const currentTabComponent = ref('Hot')

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
.tabs{
  margin: 50px 0 30px 0;
}
.artist-page{
  width: var(--page-width);
}
</style>
