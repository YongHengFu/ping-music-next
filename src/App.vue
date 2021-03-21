<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

document.body.style.setProperty('--main-color', '#1DCF9F')
// import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    // HelloWorld
  },
})
</script>

<style>
:root{
  --primary-color: #1DCF9F;
  --block-size: 160px;
  --block-num: 5;
}
</style>
