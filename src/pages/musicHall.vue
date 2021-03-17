<template>
  <div style="user-select: none">
    <div>
      <a-tabs>
        <a-tab-pane key="1" tab="精选" />
      </a-tabs>
    </div>
    <Banner class="banner"/>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue'
export default {
  name: 'MusicHall',
  components: {
    Banner,
  },
}
</script>

<style scoped>
.banner{
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>
