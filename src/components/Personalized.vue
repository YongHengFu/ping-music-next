<template>
  <div class="personalized">
    <div class="block myFM" key="myFM">
      <svg-icon name="tag" class="tag-icon"> </svg-icon>
      <h1 class="tag-title-line1">For</h1>
      <h1 class="tag-title-line2">You</h1>
      <a-avatar
        class="myFM-image"
        shape="square"
        :size="100"
        src="src/assets/logo.png"
      ></a-avatar>
      <div class="myFM-control">
        <span
          style="
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
          >父亲写的散文诗</span
        >
        <br />
        <span style="font-size: 14px">许飞</span>
        <div style="margin-top: 10px">
          <svg-icon name="next" class="discolour" />
          <svg-icon name="love" class="discolour" style="margin-left: 10px" />
        </div>
      </div>
    </div>
    <div class="block daily" key="daily">daily</div>
    <div class="block new" key="new" @click="colorfulImg()">new</div>
  </div>
  <Block/>
</template>

<script lang="ts">
import Block from './block.vue'
export default {
  components: {
    Block
  },
  mounted() {
    // console.log(this.colorfulImg(document.getElementById('img')))
    // this.colorfulImg()
  },
  methods: {
    colorfulImg(){
      // let img = document.getElementById('test');
      let image=new Image();
      image.src="http://localhost:3000/src/assets/logo.png";
      let width = image.width;
      let height = image.height;
      console.log(width+","+height)
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      let data = ctx.getImageData(0, 0, width, height).data;
      let rgb = {r:0,g:0,b:0}
      let count=0;
      for (let i = 0; i < data.length; i += 4) {
        count++
        rgb.r += data[i];
        rgb.g += data[i+1];
        rgb.b += data[i+2];
      }
      rgb.r = (rgb.r/count)>>0;
      rgb.g = (rgb.g/count)>>0;
      rgb.b = (rgb.b/count)>>0;
      console.log(rgb)
      return rgb;
    }
  },
};
</script>

<style scoped>
.personalized {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 660px;
  height: 150px;
}
.block {
  margin-right: 20px;
}
.myFM {
  align-self: center;
  flex: 2;
  background: rgba(221, 219, 218, 0.368);
  height: 100%;
  border-radius: 8px;
  position: relative;
}
.tag-icon {
  color: #1dcf9f;
  font-size: 150px;
  border-radius: 8px;
  position: absolute;
  z-index: 1;
}
.tag-title-line1 {
  position: absolute;
  left: 10px;
  top: -2px;
  color: #ffffff;
  font-size: 25pt;
  padding: 0;
  margin: 0;
  font-weight: bolder;
  z-index: 2;
}
.tag-title-line2 {
  position: absolute;
  left: 10px;
  top: 28px;
  color: #ffffff;
  font-size: 25pt;
  padding: 0;
  margin: 0;
  font-weight: bolder;
  z-index: 2;
}
.myFM-image {
  position: absolute;
  left: 30%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  background: aquamarine;
}
.myFM-control {
  position: absolute;
  left: 75%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}
.daily {
  align-self: center;
  flex: 1;
  background: cornflowerblue;
  height: 100%;
}
.new {
  align-self: center;
  flex: 1;
  background: #436e94;
  height: 100%;
}
.discolour {
  color: rgb(102, 102, 102);
}

.discolour:hover {
  color: #1dcf9f;
}

</style>
