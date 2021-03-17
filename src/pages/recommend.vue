<template>
  <div style="padding: 10px 30px;user-select: none;">
    <Personalized />
    <div class="test">

    </div>
  </div>
</template>
<script>
import Personalized from '@/components/Personalized.vue'
import { getQRCodeKey } from '@/api/user.ts'

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
.test{
  width: 100px;
  height: 100px;
  background:red;
  animation: myfirst 5s;
}
@keyframes myfirst
{
  from {background:red;}
  to {background:yellow;}
}
</style>
