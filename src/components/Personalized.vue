<template>
  <div>
    <h1 style="font-size: 22px;font-weight: bold;margin-bottom: 20px">Hi 椰子🌴~ 今日为你打造</h1>
    <div class="personalized">
      <FMBlcok class="block myFM" />
      <DailyBlock class="block daily" />
      <NewBlock class="block new" />
    </div>
  </div>
</template>

<script lang="ts">
import NewBlock from './NewBlock.vue'
import DailyBlock from './DailyBlock.vue'
import FMBlcok from './FM-block.vue'

export default {
  components: {
    NewBlock,
    DailyBlock,
    FMBlcok
  },
  mounted() {
    // console.log(this.colorfulImg(document.getElementById('img')))
    // this.colorfulImg()
  },
  methods: {
    colorfulImg() {
      // let img = document.getElementById('test');
      const image = new Image()
      image.src = 'http://localhost:3000/src/assets/logo.png'
      const { width } = image
      const { height } = image
      console.log(`${width},${height}`)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      const { data } = ctx.getImageData(0, 0, width, height)
      const rgb = { r: 0, g: 0, b: 0 }
      let count = 0
      for (let i = 0; i < data.length; i += 4) {
        count++
        rgb.r += data[i]
        rgb.g += data[i + 1]
        rgb.b += data[i + 2]
      }
      rgb.r = (rgb.r / count) >> 0
      rgb.g = (rgb.g / count) >> 0
      rgb.b = (rgb.b / count) >> 0
      console.log(rgb)
      return rgb
    }
  }
}
</script>

<style scoped>
.personalized {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc( var(--block-size) *4 + 60px);
  height: var(--block-size);
}
.block {
  margin-right: 20px;
  transition: transform 0.2s;
}
.block:hover {
  transition: transform 0.5s;
  transform: translateY(-10px);
}
.myFM {
  align-self: center;
  flex: 2;
  height: 100%;
  border-radius: 8px;
  position: relative;
}

.daily {
  align-self: center;
  flex: 1;
  height: 100%;
}
.new {
  align-self: center;
  flex: 1;
  height: 100%;
}

</style>
