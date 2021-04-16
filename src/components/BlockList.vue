<template>
  <div v-if="list.length>0">
    <div v-for="n of list.length/blockNum" :key="n">
      <Block
        v-for="m of blockNum"
        :key="m"
        style="display: inline-block;margin: 10px"
        :content="list[(m-1)+(blockNum*(n-1))]"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Block from './block.vue'
export default defineComponent({
  name: 'BlockList',
  components: {
    Block
  },
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {

    }
  },
  computed: {
    blockNum: function() {
      return this.$store.state.blockNum
    }
  },
  created() {
  },
  methods: {
  }
})
</script>

<style scoped>

</style>
