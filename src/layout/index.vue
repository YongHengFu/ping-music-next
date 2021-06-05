<template>
  <div>
    <Layout class="layout">
      <LayoutSider class="sider">
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
      </LayoutSider>
      <Layout style="min-width: 1000px">
        <LayoutHeader class="header">
          <InputSearch class="search" />
          <div>
            <img :src="userAvatar" style="width: 30px;border-radius: 50%">
            <span class="discolour" style="margin: 0 10px" @click="showLoginDialog">{{ nickName }}</span>
            <MailOutlined class="discolour" style="margin: 0 10px 0 15px" />
            <MenuOutlined class="discolour" />
          </div>
        </LayoutHeader>
        <LayoutContent id="content" class="content">
          <Loading />
          <!--          <div style="width: 100%;height: 100%;overflow-y: scroll">-->
          <!--            <router-view :key="key" class="view" />-->
          <!--          </div>-->
          <div style="width: 100%;height: 100%;overflow-y: scroll">
            <router-view v-slot="{ Component }" :key="key" class="view">
              <transition>
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </div>

          <ListDrawer :is-show-drawer="isShowDrawer" @closeDrawer="isShowDrawer=false" />
        </LayoutContent>
        <LayoutFooter class="footer">
          <ControlBar @showDrawer="showDrawer" />
        </LayoutFooter>
      </Layout>
    </Layout>
  </div>
</template>

<script lang="ts">

import { defineComponent, computed, watch, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Layout, Input, Avatar } from 'ant-design-vue'
import elementResizeDetectorMaker from 'element-resize-detector'
import Loading from '@/components/Loading.vue'
import ControlBar from '@/components/ControlBar.vue'
import ListDrawer from '@/components/ListDrawer.vue'
import { getAccountInfo } from '@/api/user'
import { message } from 'ant-design-vue'

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
  UpOutlined
} from '@ant-design/icons-vue'

interface item {
  index: number;
  label: string;
  icon: string;
  path: string;
}

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
    Layout: Layout,
    LayoutHeader: Layout.Header,
    LayoutSider: Layout.Sider,
    LayoutContent: Layout.Content,
    LayoutFooter: Layout.Footer,
    InputSearch: Input.Search,
    Avatar: Avatar,
    ControlBar,
    ListDrawer,
    Loading
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const pageIndex = ref(0)
    const isShowDrawer = ref(false)
    const userAvatar = ref('')
    const nickName = ref('未登录')
    const itemList = [
      {
        index: 0,
        label: '推荐',
        icon: 'FireOutlined',
        path: '/recommend'
      },
      {
        index: 1,
        label: '音乐馆',
        icon: 'CustomerServiceOutlined',
        path: '/musicHall'
      },
      {
        index: 2,
        label: '视频',
        icon: 'VideoCameraOutlined',
        path: '/2'
      },
      {
        index: 3,
        label: '私人FM',
        icon: 'CrownOutlined',
        path: '/3'
      },
      {
        index: 4,
        label: '我喜欢',
        icon: 'HeartOutlined',
        path: '/4'
      },
      {
        index: 5,
        label: '本地歌曲',
        icon: 'DesktopOutlined',
        path: '/5'
        // path: '/playList'
      },
      {
        index: 6,
        label: '下载管理',
        icon: 'CloudDownloadOutlined',
        path: '/6'
      },
      {
        index: 7,
        label: '最近播放',
        icon: 'HistoryOutlined',
        path: '/historyPlay'
      }
    ]
    // eslint-disable-next-line no-undef
    let timer: (NodeJS.Timeout | null) = null

    const menuList = computed(() => {
      return function(group: string) {
        return itemList.filter((item: item) => {
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
    })

    const key = computed(() => route.path)

    const loginState = computed(() => store.state.loginState)

    const refreshLogin = computed(() => store.state.refreshLogin)

    watch(loginState, () => {
      userAvatar.value = <string>localStorage.getItem('avatarUrl')
      nickName.value = <string>localStorage.getItem('nickName')
      if (!loginState.value) {
        localStorage.removeItem('cookie')
        message.error('登录失效，请重新登录!')
      }
    })

    watch(refreshLogin, () => {
      refreshLoginState()
    })

    onMounted(() => {
      localStorage.removeItem('lastTime')
      refreshLoginState()

      indexByRouter(route.path)

      const erd = elementResizeDetectorMaker()

      erd.listenTo(document.getElementById('content'), function(element: any) {
        debounce(function(ele: { offsetWidth: number }) {
          const width = ele.offsetWidth
          let blockSize = (width / 5) - (width * (40 / 1000))
          blockSize = blockSize > 240 ? 240 : blockSize
          if (width - (blockSize + 20) * 6 > 40) {
            store.commit('setBlockNum', 6)
            document.documentElement.style.setProperty(`--block-num`, 6 + '')
          } else {
            store.commit('setBlockNum', 5)
            document.documentElement.style.setProperty(`--block-num`, 5 + '')
          }
          document.documentElement.style.setProperty(`--block-size`, blockSize + 'px')
        }, element)
      })
    })

    const debounce = (func: { (ele: { offsetWidth: number }): void; (...args: any[]): void }, element: any) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(func, 300, element)
    }

    const pageChange = (index: number) => {
      router.push({ path: itemList[index].path })
      pageIndex.value = index
    }
    const indexByRouter = (path:string) => {
      for (const [index, item] of itemList.entries()) {
        if (item.path === path) {
          pageIndex.value = index
          return index
        }
      }
    }
    const showDrawer = () => {
      isShowDrawer.value = !isShowDrawer.value
    }

    const showLoginDialog = () => {
      store.commit('setShowLoginDialog', true)
    }

    const refreshLoginState = () => {
      getAccountInfo().then((res:any) => {
        if (res.code === 200) {
          if (!res.account) {
            logout()
          } else {
            store.commit('setLoginState', true)
          }
        }
      })
    }

    const logout = () => {
      store.commit('setLoginState', false)
      localStorage.setItem('userName', '')
      localStorage.setItem('usid', '')
      localStorage.setItem('nickName', '未登录')
      localStorage.setItem('avatarUrl', '')
    }

    return {
      pageIndex,
      isShowDrawer,
      itemList,
      menuList,
      key,
      userAvatar,
      nickName,
      pageChange,
      showDrawer,
      showLoginDialog
    }
  }
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
  overflow: hidden;
}

.view{
  margin: 0px auto;
}

.layout .footer {
  background: #fafafa;
  padding: 10px 2px;
  user-select: none;
  padding: 0 2px 10px 2px;
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
</style>
