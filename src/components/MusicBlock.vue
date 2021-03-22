<template>
  <div style="position: relative;height: 60px;width: 33%">
    <div class="cover">
      <Block />
    </div>
    <div class="info">
      <span style="font-size:14px;display: block">海阔天空</span>
      <svg-icon name="SQ" style="font-size: 28px;height:16px;color: #1DCF9F" />
      <span style="font-size: 13px;font-weight:300;margin-left: 1px;padding: 0">Beyond</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Block from '@/components/block.vue'
export default defineComponent({
  name: 'MusicBlock',
  components: {
    Block,
  },
})
</script>

<style scoped>
.cover{
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.info{
  height: 60px;
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-40%);
}
</style>
