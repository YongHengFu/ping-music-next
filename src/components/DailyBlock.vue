<template>
  <div class="daily">
    <svg-icon name="tag" class="tag-icon"> </svg-icon>
    <h1 class="tag-title-line1">Daily</h1>
    <h1 class="tag-title-line2">30</h1>
    <Block></Block>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import Block from './block.vue'
export default defineComponent( {
  components: {
    Block
  }
});
</script>

<style scoped>
.daily {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  position: relative;
}

.tag-icon {
  pointer-events:none;
  color: rgb(35, 92, 254);
  font-size: 60px;
  border-top-left-radius: 8px;
  position: absolute;
  z-index: 1;
}
.tag-title-line1 {
  pointer-events:none;
  position: absolute;
  left: 10px;
  top: -2px;
  color: #ffffff;
  font-size: 25px;
  padding: 0;
  margin: 0;
  font-weight: bolder;
  z-index: 2;
}
.tag-title-line2 {
  pointer-events:none;
  position: absolute;
  left: 10px;
  top: 28px;
  color: #ffffff;
  font-size: 25px;
  padding: 0;
  margin: 0;
  font-weight: bolder;
  z-index: 2;
}
.myFM-cover {
  position: absolute;
  left: 25%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

</style>
