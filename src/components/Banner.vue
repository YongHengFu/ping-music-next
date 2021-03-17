<template>
  <div>
    <div v-if="show.length>0" class="container" @mouseleave="leave" @mouseenter="enter">
      <LeftOutlined v-if="controlButton" class="prevIcon" @click="prev" />
      <RightOutlined v-if="controlButton" class="nextIcon" @click="next" />
      <div :class="item[0].class"><a-image :src="show[0].imgUrl" style="border-radius: 5px;" /></div>
      <div :class="item[1].class"><a-image :src="show[1].imgUrl" style="border-radius: 5px;" /></div>
      <div :class="item[2].class"><a-image :src="show[2].imgUrl" style="border-radius: 5px;" /></div>
      <div :class="item[3].class"><a-image :src="show[3].imgUrl" style="border-radius: 5px;" /></div>
      <div :class="item[4].class"><a-image :src="show[4].imgUrl" style="border-radius: 5px;" /></div>
      <div class="points">
        <div v-for="(item,ind) of data" :key="item" :class="ind===index?'point-L':'point'" />
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Banner',
  components: {
    LeftOutlined,
    RightOutlined,
  },
  data() {
    return {
      index: 0,
      item: [
        { position: 0, class: 'middle' },
        { position: 1, class: 'right' },
        { position: 2, class: 'right-out' },
        { position: 3, class: 'left-out' },
        { position: 4, class: 'left' },
      ],
      show: [],
      // data: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      data: [
        { imgUrl: '../src/assets/image/a (1).png', No: 1 },
        { imgUrl: '../src/assets/image/a (2).png', No: 2 },
        { imgUrl: '../src/assets/image/a (3).png', No: 3 },
        { imgUrl: '../src/assets/image/a (4).png', No: 4 },
        { imgUrl: '../src/assets/image/a (5).png', No: 5 },
        { imgUrl: '../src/assets/image/a (6).png', No: 6 },
        { imgUrl: '../src/assets/image/a (7).png', No: 7 },
        { imgUrl: '../src/assets/image/a (8).png', No: 8 },
        { imgUrl: '../src/assets/image/a (9).png', No: 9 },
        { imgUrl: '../src/assets/image/a (10).png', No: 10 },
      ],
      // points: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      interval: null,
      controlButton: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      for (let i = 0; i < 4; i++) {
        this.show.push(this.data[i])
      }
      // this.show = this.data.slice(0, 5)
      this.show.push(this.data[this.data.length - 1])
      this.initPrev()
      this.initNext()
      this.autoExe(true)
    },
    leave() {
      this.controlButton = false
      this.autoExe()
    },
    enter() {
      this.controlButton = true
      this.stopExe()
    },
    // 定时轮播
    autoExe() {
      const this_ = this
      function exeNext() {
        this_.next()
      }
      if (this.interval == null) {
        this.interval = setInterval(exeNext, 3000)
      }
    },
    // 停止轮播
    stopExe() {
      clearInterval(this.interval)
      this.interval = null
    },
    initPrev() {
      let NoM = ''
      let positionM = 0
      let NoL = ''
      let positionL = 0
      let positionLO = 0

      for (let i = 0; i < 5; i++) {
        if (this.item[i].class === 'middle') {
          positionM = this.item[i].position
          NoM = this.show[positionM].No
        } else if (this.item[i].class === 'left') {
          positionL = this.item[i].position
          NoL = this.show[positionL].No
        } else if (this.item[i].class === 'left-out' || this.item[i].class === 'left-out-no') {
          positionLO = this.item[i].position
        }
      }
      if (NoL < NoM && NoL === this.data[0].No) {
        this.show[positionLO] = this.data[this.data.length - 1]
      } else {
        for (const [index, dataItem] of this.data.entries()) {
          if (dataItem.No === NoL) {
            this.show[positionLO] = this.data[index - 1]
            break
          }
        }
      }
    },
    initNext() {
      let NoM = ''
      let positionM = 0
      let NoR = ''
      let positionR = 0
      let positionRO = 0

      for (let i = 0; i < 5; i++) {
        if (this.item[i].class === 'middle') {
          positionM = this.item[i].position
          NoM = this.show[positionM].No
        } else if (this.item[i].class === 'right') {
          positionR = this.item[i].position
          NoR = this.show[positionR].No
        } else if (this.item[i].class === 'right-out' || this.item[i].class === 'right-out-no') {
          positionRO = this.item[i].position
        }
      }
      if (NoR > NoM && NoR === this.data[this.data.length - 1].No) {
        this.show[positionRO] = this.data[0]
      } else {
        for (const [index, dataItem] of this.data.entries()) {
          if (dataItem.No === NoR) {
            this.show[positionRO] = this.data[index + 1]
            break
          }
        }
      }
    },
    prev() {
      this.initPrev()
      for (let i = 0; i < 5; i++) {
        if (this.item[i].class === 'right-out') {
          this.item[i].class = 'right-out-no'
        } else if (this.item[i].class === 'left-out-no') {
          this.item[i].class = 'left-out'
        }
      }
      const tran:string = this.item[0].class
      this.item[0].class = this.item[1].class
      this.item[1].class = this.item[2].class
      this.item[2].class = this.item[3].class
      this.item[3].class = this.item[4].class
      this.item[4].class = tran
      if (this.index === 0) {
        this.index = this.data.length - 1
      } else {
        this.index--
      }
    },
    next() {
      this.initNext()
      for (let i = 0; i < 5; i++) {
        if (this.item[i].class === 'left-out') {
          this.item[i].class = 'left-out-no'
        } else if (this.item[i].class === 'right-out-no') {
          this.item[i].class = 'right-out'
        }
      }
      const tran:string = this.item[0].class
      this.item[0].class = this.item[4].class
      this.item[4].class = this.item[3].class
      this.item[3].class = this.item[2].class
      this.item[2].class = this.item[1].class
      this.item[1].class = tran
      if (this.index === this.data.length - 1) {
        this.index = 0
      } else {
        this.index++
      }
    },
  },
})
</script>

<style scoped>
@import '../style/animations.css';
.container{
  width: 800px;
  height: 250px;
  position: relative;
  marginLeft: 300px;
  /*background: #999999;*/
}
.left-out{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translate(-50%,-50%);
  display: none;
}
.left-out-no{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  opacity: 0.01;
}
.left{
  transition: 0.4s;
  z-index: 0;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);

}
.middle{
  transition: 0.4s;
  width: 540px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 1;
}
.right{
  transition: 0.4s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  right: 50px;
  left: 318px;
  transform: translateY(-50%);
  z-index: 0;
}
.right-out-no{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  right: 50px;
  left: 318px;
  transform: translateY(-50%);
  opacity: 0.01;
}
.right-out{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  right: 50px;
  left: 318px;
  transform: translate(50%,-50%);
  display: none;
}

.prevIcon{
  padding: 30px 5px;
  color: #FFFFFF;
  background: rgba(217, 215, 215, 0.5);
  position: absolute;
  font-size: 22px;
  top: 50%;
  left: 65px;
  transform: translate(0%,-50%);
  z-index: 2;
}
.nextIcon{
  padding: 30px 5px;
  color: #FFFFFF;
  background: rgba(217, 215, 215, 0.5);
  position: absolute;
  font-size: 22px;
  top: 50%;
  right: 65px;
  transform: translate(0%,-50%);
  z-index: 2;
}
.points{
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%,-80%);
}
.point{
  display: inline-block;
  width: 5px;
  height: 5px;
  margin: 0 2px;
  background: #d0cece;
  border-radius: 50%;
  transition: 0.1s;
}
.point-L{
  transition: 0.3s;
  display: inline-block;
  width: 15px;
  height: 5px;
  margin: 0 5px;
  background: var(--primary-color);
  border-radius: 25%;
}
</style>
