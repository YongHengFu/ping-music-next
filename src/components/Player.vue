<template>
  <audio v-if="source!==''" :src="source" autoplay="autoplay" />
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
      return this.$store.state.source
    },
  },
})
</script>

<style scoped>

</style>
