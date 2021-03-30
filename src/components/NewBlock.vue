<template>
  <div class="daily">
    <svg-icon name="tag" class="tag-icon" />
    <h1 class="tag-title-line1">New</h1>
    <!--    <h1 class="tag-title-line2">30</h1>-->
    <Block />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Block from './block.vue'

export default defineComponent({
  components: {
    Block
  }
})
</script>

<style scoped>
.daily {
  width: var(--block-size);
  height: var(--block-size);
  border-radius: 8px;
  position: relative;
}

.tag-icon {
  pointer-events:none;
  color: var(--primary-color);
  font-size: 60px;
  border-top-left-radius: 8px;
  position: absolute;
  left: 100%;
  z-index: 1;
  transform: translateX(-100%) rotateY(180deg);
}
.tag-title-line1 {
  pointer-events:none;
  position: absolute;
  left: 90%;
  top: -2px;
  transform: translateX(-100%);
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
