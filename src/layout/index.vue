<template>
  <div>
    <a-layout class="layout">
      <a-layout-sider class="sider">
        <img class="logo" src="@/assets/image/logo.png">
        <div class="menu">
          <div>
            <p class="group">在线音乐</p>
            <p
              v-for="item of menuList('a')"
              :key="item.icon"
              :class="item.index === pageIndex ? 'item-click' : 'item'"
              @click="pageChange(item.index)"
            >
              <component :is="item.icon" style="margin-right: 5px" />
              {{ item.label }}
            </p>
          </div>
          <div>
            <p class="group">我的音乐</p>
            <p
              v-for="item of menuList('b')"
              :key="item.icon"
              :class="item.index === pageIndex ? 'item-click' : 'item'"
              @click="pageChange(item.index)"
            >
              <component :is="item.icon" style="margin-right: 5px" />
              {{ item.label }}
            </p>
          </div>
          <div>
            <p class="group">
              创建的歌单
              <PlusSquareOutlined style="margin-left: 30px" />
            </p>
          </div>
          <div>
            <p class="group">收藏的歌单</p>
          </div>
        </div>
      </a-layout-sider>
      <a-layout style="min-width: 1000px">
        <a-layout-header class="header">
          <a-input-search class="search" />
          <div>
            <a-avatar>
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <span class="discolour" style="margin: 0 10px">登录</span>
            <MailOutlined class="discolour" style="margin: 0 10px 0 15px" />
            <MenuOutlined class="discolour" />
          </div>
        </a-layout-header>
        <a-layout-content id="content" class="content">
          <router-view :key="key" class="view" />
        </a-layout-content>
        <a-layout-footer class="footer">
<!--          <ProgressBar />-->
<!--          <ProgressBar2 />-->
<!--          <div>
            <a-slider
              v-model:value="time"
              :min="0"
              :max="totalDura"
              :step="1"
              :tip-formatter="sliderFormat"
              @afteChange="sliderChange"
            />
          </div>-->
<!--          <div class="control-bar">
            <div class="bar-left">
              <a-avatar shape="square" :size="50">
                <template #icon><PlayCircleOutlined /></template>
              </a-avatar>
              <span style="margin: 0 10px; font-size: 16px">海阔天空</span>
              <span>&#45;&#45;beyond</span>
              <svg-icon
                name="love"
                class="discolour"
                style="font-size: 19px; margin-left: 20px; color: #cccccc"
              />
            </div>
            <div class="bar-center">
              <svg-icon name="loop" class="discolour" style="font-size: 20px" />
              <svg-icon
                name="prev"
                class="discolour prev-button"
                style="font-size: 26px"
              />
              <svg-icon
                :name="state ? 'pause' : 'play'"
                style="font-size: 40px; color: var(&#45;&#45;primary-color)"
                @click="changeState"
              />
              <svg-icon
                name="next"
                class="discolour next-button"
                style="font-size: 26px"
              />
              <svg-icon
                name="volume"
                class="discolour"
                style="font-size: 20px"
              />
            </div>
            <div class="bar-right">
              <span style="margin-right: 10px">{{ currFormat }} / {{ totalFormat }}</span>
              <a-button size="small" style="font-size: 14px">
                HQ
                <UpOutlined style="font-size: 10px" />
              </a-button>
              <svg-icon
                name="lyric"
                class="discolour"
                style="font-size: 19px; margin: 0 10px"
              />
              <svg-icon name="music-list" class="discolour" style="font-size: 22px" />
            </div>
          </div>-->
          <ControlBar />
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import elementResizeDetectorMaker from 'element-resize-detector'
// import ProgressBar2 from '@/components/ProgressBar2.vue'
import ControlBar from '@/components/ControlBar.vue'

import {
  FireOutlined,
  HomeOutlined,
  CustomerServiceOutlined,
  VideoCameraOutlined,
  CrownOutlined,
  HeartOutlined,
  DesktopOutlined,
  CloudDownloadOutlined,
  HistoryOutlined,
  PlusSquareOutlined,
  MailOutlined,
  MenuOutlined,
  UserOutlined,
  PlayCircleOutlined,
  UpOutlined,
} from '@ant-design/icons-vue'

interface item {
  index: number;
  label: string;
  icon: string;
  path: string;
}
//
// interface dataType {
//   state: boolean; // false：暂停  true：播放
//   currentDura: number; // 当前播放进度
//   totalDura: number; // 歌曲总时长
//   pageIndex: number; //
//   itemList: Array<item>;
// }

export default defineComponent({
  name: 'MainLayout',
  components: {
    FireOutlined,
    HomeOutlined,
    CustomerServiceOutlined,
    VideoCameraOutlined,
    CrownOutlined,
    HeartOutlined,
    DesktopOutlined,
    CloudDownloadOutlined,
    HistoryOutlined,
    PlusSquareOutlined,
    MailOutlined,
    MenuOutlined,
    UserOutlined,
    PlayCircleOutlined,
    UpOutlined,
    // ProgressBar2,
    ControlBar,
  },
  data() {
    return {
      timer: null,
      state: false, // false:暂停 true:播放
      // currentDura: 80,
      // totalDura: 232,
      time: 0,
      pageIndex: 0,
      itemList: [
        {
          index: 0,
          label: '推荐',
          icon: 'FireOutlined',
          path: '/0',
        },
        {
          index: 1,
          label: '音乐馆',
          icon: 'CustomerServiceOutlined',
          path: '/1',
        },
        {
          index: 2,
          label: '视频',
          icon: 'VideoCameraOutlined',
          path: '/2',
        },
        {
          index: 3,
          label: '私人FM',
          icon: 'CrownOutlined',
          path: '/3',
        },
        {
          index: 4,
          label: '我喜欢',
          icon: 'HeartOutlined',
          path: '/4',
        },
        {
          index: 5,
          label: '本地歌曲',
          icon: 'DesktopOutlined',
          path: '/5',
        },
        {
          index: 6,
          label: '下载管理',
          icon: 'CloudDownloadOutlined',
          path: '/6',
        },
        {
          index: 7,
          label: '最近播放',
          icon: 'HistoryOutlined',
          path: '/7',
        },
      ],
    }
  },
  computed: {
    menuList() {
      const this_: any = this
      return function(group: string) {
        return this_.itemList.filter((item: item) => {
          switch (group) {
            case 'a':
              return item.index < 4
            case 'b':
              return item.index > 3 && item.index < 8
            default:
              return item.index === 0
          }
        })
      }
    },
    key() {
      return this.$route.path
    },
  },
  mounted() {
    const erd = elementResizeDetectorMaker()
    const this_ = this

    erd.listenTo(document.getElementById('content'), function(element) {
      this_.debounce(function(ele) {
        const width = ele.offsetWidth
        let blockSize = (width / 5) - (width * (40 / 1000))
        blockSize = blockSize > 240 ? 240 : blockSize
        if (width - (blockSize + 20) * 6 > 40) {
          this_.$store.commit('setBlockNum', 6)
          document.documentElement.style.setProperty(`--block-num`, 6)
        } else {
          this_.$store.commit('setBlockNum', 5)
          document.documentElement.style.setProperty(`--block-num`, 5)
        }
        document.documentElement.style.setProperty(`--block-size`, blockSize + 'px')
      }, element)
    })
  },
  methods: {

    debounce(func, element) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(func, 300, element)
    },
    // changeState(): void {
    //   this.state = !this.state
    // },
    // sliderFormat(): string {
    //   return this.currFormat
    // },
    // sliderChange(value: number) {
    //   console.log(value)
    // },
    pageChange(index: number) {
      this.$router.push({ path: '/musicHall' })
      console.log(this.$route.path)
      this.pageIndex = index
    },
  },
})
</script>

<style scoped>
.layout {
  /*min-width: 1000px;*/
  width: 100vw;
  height: 100vh;
}

.layout .sider {
  background: #f6f6f6;
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.layout .header {
  background: #fafafa;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  user-select: none;
}

.layout .content {
  background: #fafafa;
  overflow-x: hidden;
  overflow-y: auto;
}

.view{
  margin: 0px auto;
}

.layout .footer {
  background: #fafafa;
  padding: 10px 2px;
  user-select: none;
}

.sider .logo {
  width: 100px;
  margin-left: 45%;
  transform: translateX(-50%);
}

.menu {
  margin: 20px 10px;
  margin-top: 0;
  font-size: 16px;
}

.group {
  padding-left: 10px;
  color: #999;
  font-size: 15px;
}

.item {
  color: #666;
  font-weight: bold;
  border: #f6f6f6 solid;
  padding: 2px 10px;
}

.item:hover {
  background: #ededed;
  border: #ededed solid;
  border-radius: 5px;
}

.item-click {
  color: #ffffff;
  font-weight: bold;
  border: var(--primary-color) solid;
  background: var(--primary-color);
  border-radius: 5px;
  padding: 2px 10px;
}

.search {
  width: 250px;
  min-width: 150px;
}

.search {
  /* background: #e1e1e1; */
  border-radius: 20px;
  /* box-shadow: none; */
  /* border: 0; */
}

/*.control-bar {*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  justify-content: space-between;*/
/*  align-items: center;*/
/*  padding: 0 20px;*/
/*}*/

/*.bar-left {*/
/*  width: 25%;*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  justify-content: flex-start;*/
/*  align-items: center;*/
/*}*/

/*.bar-center {*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/

/*.bar-right {*/
/*  width: 25%;*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  justify-content: flex-end;*/
/*  align-items: center;*/
/*}*/

.discolour {
  color: rgb(102, 102, 102);
}

.discolour:hover {
  color: var(--primary-color);
}

/*.prev-button {*/
/*  color: #3f3f3f;*/
/*  margin: 0 20px 0 30px;*/
/*}*/

/*.next-button {*/
/*  color: #3f3f3f;*/
/*  margin: 0 30px 0 20px;*/
/*}*/
</style>
