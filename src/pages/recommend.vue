<template>
  <div style="padding: 10px 30px;user-select: none;">
    <Personalized />
  </div>
</template>
<script lang="ts">
import Personalized from '@/components/Personalized.vue'
import { getQRCodeKey } from '../api/user'

export default {
  components: {
    Personalized,
  },
  created() {
    // this.test()
  },
  methods: {
    test() {
      getQRCodeKey().then((res) => {
        console.log(res)
      })
    },
  },
}
</script>

<style scoped>

</style>
