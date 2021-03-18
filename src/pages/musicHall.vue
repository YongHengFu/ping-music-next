<template>
  <div style="user-select: none;position: relative">
    <h1>音乐馆</h1>
    <Tabs />
<!--    <div style="position: relative">-->
<!--      <span class="tabs">精选</span>-->
<!--    </div>-->
    <!--    <Banner class="banner"/>-->
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue'
import Tabs from '@/components/Tabs.vue'
export default {
  name: 'MusicHall',
  components: {
    Banner,
    Tabs,
  },
}
</script>

<style scoped>
.banner{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
