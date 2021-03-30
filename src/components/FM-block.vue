<template>
  <div class="myFM">
    <svg-icon name="tag" class="tag-icon" />
    <h1 class="tag-title-line1">For</h1>
    <h1 class="tag-title-line2">You</h1>
    <div class="myFM-cover">
      <Block style="width: 100px;height: 100px;" />
    </div>

    <div class="myFM-control">
      <span
        style="
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
      >父亲写的散文诗</span>
      <br>
      <span style="font-size: 14px">许飞</span>
      <div style="margin-top: 10px">
        <svg-icon name="next" class="discolour" />
        <svg-icon name="love" class="discolour" style="margin-left: 10px" />
      </div>
    </div>
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
.myFM {
  background: rgba(221, 219, 218, 0.368);
  width: 300px;
  height: var(--block-size);
  border-radius: 8px;
  position: relative;
}

.tag-icon {
  pointer-events:none;
  color: rgba(92, 91, 91, 0.6);
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
.myFM-control {
  position: absolute;
  left: 75%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}
.discolour {
  color: rgb(102, 102, 102);
}

.discolour:hover {
  color: var(--primary-color);
}

</style>
