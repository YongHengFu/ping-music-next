<template>
  <div v-if="loading" class="loading">
    <lottie-player
      autoplay
      loop
      mode="bounce"
      :src="LoadingAnimatiom"
      style="width: 150px;height: 150px"
    />
    <span style="font-size: 20px;text-align: center;margin-top: 15px;color: #8d8d8d">loading...</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import '@lottiefiles/lottie-player'
import LoadingAnimatiom from '@/assets/lottie/loading.json'
export default defineComponent({
  name: 'Loading',
  data() {
    return {
      LoadingAnimatiom: LoadingAnimatiom
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    }
  }
})
</script>

<style scoped>
.loading{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
  z-index: 5;
}
</style>
