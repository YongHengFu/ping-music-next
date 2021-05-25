<template>
  <div style="padding: 10px 30px;user-select: none;">
    <Personalized />
<!--    <ContextMenu />-->
  </div>
</template>
<script lang="ts">
import Personalized from '@/components/Personalized.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { getQRCodeKey } from '../api/user'

export default {
  components: {
    Personalized,
    ContextMenu
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
