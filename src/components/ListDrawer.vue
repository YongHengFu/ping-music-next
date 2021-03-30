<template>
  <div>
    <a-drawer
      placement="right"
      :closable="false"
      :visible="isShowDrawer"
      :get-container="false"
      :mask="false"
      width="300"
      :drawer-style="{'background': '#fafafa'}"
      :wrap-style="{ position: 'absolute' }"
    >
      <div
        v-for="item of detailList"
        :key="item.id"
        style="display: flex;flex-direction: row; align-items: center;justify-content: space-between;margin-bottom: 10px"
      >
        <div style="display: flex;flex-direction: column">
          <span>{{ item.name }}</span>
          <div>
            <span
              v-for="(item2,index2) of detailList.artist"
              :key="item2.id"
            >{{ item2.name }}{{index2===detailList.artist.length-1?'':'/'}}</span>
          </div>
        </div>
        <span style="">{{ dtFormat(item.duration) }}</span>
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
      type: Boolean,
    },
  },
  computed: {
    detailList() {
      return this.$store.state.detailList
    },
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
  },
})
</script>

<style scoped>
::v-deep .ant-drawer-right.ant-drawer-open .ant-drawer-content-wrapper{
  box-shadow: -1px 0 8px rgba(99, 99, 99, 0.15);
}
</style>
