<template>
  <div style="padding: 10px 30px;user-select: none;">
    <Personalized />
    <MiniCover style="width: 500px;height: 500px"/>
  </div>
</template>
<script lang="ts">
import Personalized from '@/components/Personalized.vue'
import { getQRCodeKey } from '../api/user'
import MiniCover from '@/components/MiniCover.vue'

export default {
  components: {
    Personalized,
    MiniCover
  },
  created() {
    // this.test()
  },
  methods: {
    test() {
      getQRCodeKey().then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
