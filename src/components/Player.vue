<template>
  <audio v-if="source!==''" id="audio" :src="source" autoplay="autoplay" />
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Player',
  data() {
    return {
      // source: '',
    }
  },
  computed: {
    source: function() {
      if (document.getElementById('audio')) {
        console.log(document.getElementById('audio').duration)
      }
      return this.$store.state.source
    },
  },
  created() {
    console.log(document.getElementById('audio'))
  },
})
</script>

<style scoped>

</style>
