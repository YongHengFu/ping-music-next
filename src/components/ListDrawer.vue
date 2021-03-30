<template>
  <div style="user-select: none">
    <a-drawer
      placement="right"
      :closable="false"
      :visible="isShowDrawer"
      :get-container="false"
      :mask="false"
      width="400"
      :drawer-style="{'background': '#fafafa'}"
      :wrap-style="{ position: 'absolute'}"
    >
      <div style="margin: 20px">
        <span class="h2">播放清单</span>
        <div style="color: #454545;margin-top: 5px;display: flex;align-items: center;justify-content: space-between">
          <span>{{ detailList.length }}首歌曲</span>
          <div style="font-size: 16px">
            <svg-icon name="batch" style="margin-right: 10px"/>
            <svg-icon name="trash" />
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) of detailList"
        :key="item.id"
        class="container"
        :style="index===selectIndex?'background: #efefef':''"
        @click="selectItem(index)"
        @dblclick="switchMusic(index)"
      >
        <div class="info" :style="index===selectIndex?'width: 60%':''">
          <div style="display: flex;flex-direction: row;align-items: center">
            <span class="musicName" :style="index===currIndex?'color: var(--primary-color)':''">{{ item.name }}</span>
            <svg-icon
              name="SQ"
              style="font-size: 28px;height:16px;color: #1DCF9F;min-width: 28px;margin-left: 5px"
            />
          </div>
          <div style="display: flex;flex-direction: row;justify-content: space-between">
            <span class="artistName" :style="index===currIndex?'color: var(--primary-color)':''">
              <template
                v-for="(item2,index2) of item.artist"
              >{{ item2.name }}{{ index2===item.artist.length-1?'':'/' }}</template>
            </span>
            <span class="duration" :style="index===selectIndex?'display:none':''">{{ dtFormat(item.duration) }}</span>
          </div>
        </div>
        <div class="icons" :style="index===selectIndex?'width: 40%;display: flex;justify-content: flex-end;':''">
          <svg-icon class="icon" :name="index===currIndex?'listPause':'listPlay'" />
          <svg-icon class="icon" name="love-line" />
          <svg-icon class="icon" name="more" />
        </div>

      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ListDrawer',
  props: {
    isShowDrawer: {
      type: Boolean
    }
  },
  data() {
    return {
      selectIndex: -1
    }
  },
  computed: {
    detailList() {
      return this.$store.state.detailList
    },
    currIndex() {
      return this.$store.state.currIndex
    }
  },
  methods: {
    dtFormat(dt) {
      const dtM = dt / 60
      const dtS = dt % 60
      let dtMinute: string = ''
      let dtSeconds: string = ''
      if (dtM < 10) {
        dtMinute = `0${dtM}`
      } else {
        dtMinute = `${dtM}`
      }
      if (dtS < 10) {
        dtSeconds = `0${dtS}`
      } else {
        dtSeconds = `${dtS}`
      }

      dtMinute = dtMinute.substr(0, 2)
      dtSeconds = dtSeconds.substr(0, 2)

      return `${dtMinute}:${dtSeconds}`
    },
    selectItem(index) {
      this.selectIndex = index
    },
    switchMusic(index) {
      if (this.currIndex !== index) {
        this.$store.commit('setCurrIndex', index)
      }
    }
  }
})
</script>

<style scoped>
::v-deep .ant-drawer-body{
  padding: 20px 0;
}
.container{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
}
.info{
  display: flex;
  flex-direction: column;
  width: 100%;
}
.icons{
  display: none;
  color: #a7a7a7;
}
.duration{
  color: #b3b2b2;
}
.icon{
  margin: 0 5px;
  font-size: 22px;
}
.container:hover{
  background: #efefef;
}
.container:hover .info{
  width: 60%;
}
.container:hover .icons{
  width: 40%;
  display: flex;
  justify-content: flex-end;
}
.container:hover .duration{
  width: 0;
  display: none;
}
.musicName {
  font-size: 16px;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
.artistName {
  font-size: 14px;
  color: #8e8e8e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
</style>
