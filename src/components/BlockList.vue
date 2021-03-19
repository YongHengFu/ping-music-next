<template>
  <div>
    <div>
      <sapn>精选专辑</sapn>
      <RightOutlined />
    </div>
    <div v-for="n of 2" :key="n">
      <Block v-for="m of 5" :key="m" style="display: inline-block;margin: 10px"/>
    </div>mo
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import Block from './block.vue'
export default defineComponent({
  name: 'BlockList',
  components: {
    RightOutlined,
    Block,
  },
})
</script>

<style scoped>

</style>
