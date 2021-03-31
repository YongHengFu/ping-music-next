<template>
  <div>
    <MusicList :data="detailList" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import MusicList from '@/components/MusicList.vue'
export default defineComponent({
  name: 'HistoryPlay',
  components: {
    MusicList
  },
  data() {
    return {

    }
  },
  computed: {
    detailList() {
      return this.$store.state.detailList
    }
  }
})
</script>

<style scoped>

</style>
