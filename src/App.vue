<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// document.body.style.setProperty('--main-color', '#1DCF9F')

export default defineComponent({
  name: 'App',
  components: {

  },
})
</script>

<style>
:root{
  --primary-color: #1DCF9F;
  --block-size: 160px;
  --block-num: 5;
}
::-webkit-scrollbar {
  width: 6px; /* 纵向滚动条*/
  height: 6px; /* 横向滚动条 */
  background-color: #fff;
}

/*定义滑块*/
::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 20px;
}
</style>
