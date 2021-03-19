<template>
  <div>
    <div v-if="show.length>0" class="container" @mouseleave="leave" @mouseenter="enter">
      <LeftCircleFilled v-if="controlButton" class="prevIcon" @click="prev" />
      <RightCircleFilled v-if="controlButton" class="nextIcon" @click="next" />
      <div v-for="n of 5" :key="n" :class="item[n-1].class" >
        <a-image :src="show[n-1].pic" style="border-radius: 5px;" />
      </div>
      <div class="points">
        <div v-for="(item,ind) of banners" :key="item" :class="ind===index?'point-L':'point'" />
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons-vue'
import { getBanner } from '@/api/music.ts'

export default defineComponent({
  name: 'Banner',
  components: {
    LeftCircleFilled,
    RightCircleFilled,
  },
  props: {

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
      banners: [],
      interval: null,
      controlButton: false,
    }
  },
  created() {
    this.getBannerData()
  },
  mounted() {
    if (this.banners.length > 0) {
      this.init()
    }
  },
  methods: {
    getBannerData() {
      getBanner().then((res) => {
        if (res.code === 200) {
          this.banners = res.banners
        }
      })
    },
    init() {
      for (let i = 0; i < this.banners.length; i++) {
        this.banners[i].No = i
      }
      this.show = this.banners.slice(0, 5)
      this.show.push(this.banners[this.banners.length - 1])
      this.initPrev()
      this.initNext()
      this.autoExe()
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
      if (NoL < NoM && NoL === this.banners[0].No) {
        this.show[positionLO] = this.banners[this.banners.length - 1]
      } else {
        for (const [index, dataItem] of this.banners.entries()) {
          if (dataItem.No === NoL) {
            this.show[positionLO] = this.banners[index - 1]
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
      if (NoR > NoM && NoR === this.banners[this.banners.length - 1].No) {
        this.show[positionRO] = this.banners[0]
      } else {
        for (const [index, dataItem] of this.banners.entries()) {
          if (dataItem.No === NoR) {
            this.show[positionRO] = this.banners[index + 1]
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
        this.index = this.banners.length - 1
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
      if (this.index === this.banners.length - 1) {
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
  color: rgba(163, 161, 161, 0.8);
  position: absolute;
  font-size: 30px;
  top: 50%;
  left: 65px;
  transform: translate(0%,-50%);
  z-index: 2;
}
.nextIcon{
  color: rgba(163, 161, 161, 0.8);
  position: absolute;
  font-size: 30px;
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
