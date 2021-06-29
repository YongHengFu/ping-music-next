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
              v-show="item.index!==0||loginState"
              :key="item.icon"
              :class="currPath===item.path ? 'item-click' : 'item'"
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
              v-show="(item.index!==4&&item.index!==6)||loginState"
              :key="item.icon"
              :class="currPath===item.path ? 'item-click' : 'item'"
              @click="pageChange(item.index)"
            >
              <component :is="item.icon" style="margin-right: 5px" />
              {{ item.label }}
            </p>
          </div>
          <div v-if="loginState">
            <div class="group">
              <span>创建的歌单</span>
              <div>
                <PlusSquareOutlined style="margin-right: 10px" />
                <svg-icon :name="isShowCreate?'up':'down'" style="font-size: 12px;cursor: pointer" @click="isShowCreate=!isShowCreate" />
              </div>
            </div>
            <div v-show="isShowCreate">
              <p
                v-for="item of playListCreate"
                :key="item.id"
                :class="currPath===('/playList/'+item.id) ? 'listItem-click' : 'listItem'"
                @click="openPlayList(item.id)"
              >
                {{ item.name }}
              </p>
            </div>
          </div>
          <div v-if="loginState" style="margin-top: 25px">
            <div class="group">
              <span>收藏的歌单</span>
              <svg-icon :name="isShowCollect?'up':'down'" style="font-size: 12px;cursor: pointer" @click="isShowCollect=!isShowCollect" />
            </div>
            <div v-show="isShowCollect">
              <p
                v-for="item of playListCollect"
                :key="item.id"
                :class="currPath===('/playList/'+item.id) ? 'listItem-click' : 'listItem'"
                @click="openPlayList(item.id)"
              >
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </LayoutSider>
      <Layout style="min-width: 1000px">
        <LayoutHeader class="header">
          <div>
            <svg-icon name="left" style="margin-right: 30px;cursor: pointer" @click="routePrev" />
            <svg-icon name="right" style="cursor: pointer" @click="routeNext" />
            <InputSearch class="search" />
          </div>
          <div>
            <Image :src="userAvatar" :type="1" radius="50%" style="width: 30px;" />
            <span class="discolour" style="margin: 0 10px" @click="showDialog">
              {{ nickName }}
              <svg-icon name="down" style="font-size: 11px" /></span>
            <MailOutlined class="discolour" style="margin: 0 10px 0 15px" />
            <MenuOutlined class="discolour" />
          </div>
        </LayoutHeader>
        <LayoutContent id="content" class="content">
          <Loading />
          <div style="width: 100%;height: 100%;overflow-y: scroll">
            <router-view v-slot="{ Component }" class="view">
              <transition name="switch-route" mode="out-in">
                <keep-alive :exclude="['album', 'artist']">
                  <component :is="Component" :key="key" />
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

import { defineComponent, computed, watch, ref, toRef, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Layout, Input, Avatar } from 'ant-design-vue'
import Loading from '@/components/Loading.vue'
import ControlBar from '@/components/ControlBar.vue'
import ListDrawer from '@/components/ListDrawer.vue'
import { getAccountInfo, getUserPlayList } from '@/api/user'
import { message } from 'ant-design-vue'
import { debounce } from '@/utils/frequency'

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
import { getLikeList } from '@/api/music'

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
        path: '/videoPlayer/10896407'
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
        path: '/myLike'
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
        label: '音乐云盘',
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

    const playListCreate = ref(<any>[])
    const playListCollect = ref(<any>[])
    const isShowCreate = ref(true)
    const isShowCollect = ref(true)
    const currPath = toRef(route, 'fullPath')

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
      if (loginState.value) {
        const usid = <string>localStorage.getItem('usid')
        getLikeData(usid)
        getPlayList(usid)
      } else {
        localStorage.removeItem('cookie')
        playListCreate.value = []
        localStorage.removeItem('playListCreate')
        playListCollect.value = []
        localStorage.removeItem('playListCollect')
        store.commit('setLikeList', [])
      }
    })

    watch(refreshLogin, () => {
      refreshLoginState()
    })

    const pageChange = (index: number) => {
      router.push({ path: itemList[index].path })
    }

    const showDrawer = () => {
      isShowDrawer.value = !isShowDrawer.value
    }

    const showDialog = () => {
      if (loginState.value) {
        store.commit('setShowDialog', 1)
      } else {
        store.commit('setShowDialog', 0)
      }
    }

    const refreshLoginState = () => {
      getAccountInfo().then((res:any) => {
        if (res.code === 200) {
          if (!res.account) {
            logout()
            message.error('登录失效，请重新登录!')
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

    const getPlayList = (usid:string) => {
      const param = { uid: usid }
      getUserPlayList(param).then((res:any) => {
        if (res.code === 200) {
          for (const [index, item] of res.playlist.entries()) {
            const listItem = {
              name: item.name,
              id: item.id,
              image: item.coverImgUrl
            }
            if (item.creator.userId === Number(usid)) {
              if (index === 0) {
                localStorage.setItem('myLikeMusicId', listItem.id)
              }
              playListCreate.value.push(listItem)
            } else {
              playListCollect.value.push(listItem)
            }
          }
          localStorage.setItem('playListCreate', JSON.stringify(playListCreate.value))
          localStorage.setItem('playListCollect', JSON.stringify(playListCollect.value))
        }
      })
    }

    const openPlayList = (id:string) => {
      router.push('/playList/' + id)
    }

    const getLikeData = (usid:string) => {
      const param = { uid: usid }
      getLikeList(param).then((res:any) => {
        if (res.code === 200) {
          store.commit('setLikeList', res.ids)
        }
      })
    }

    const routePrev = () => {
      router.go(-1)
    }

    const routeNext = () => {
      router.go(1)
    }

    const resetSize = debounce(() => {
      const content = document.getElementById('content')
      if (content) {
        const width = content.offsetWidth || 0
        let blockNum = 6
        let blockSize = (width / 8)
        blockSize = blockSize > 240 ? 240 : blockSize
        if (blockSize < 160) {
          blockSize = (width / 6)
          blockSize = blockSize > 240 ? 240 : blockSize
          blockNum = 5
        }
        store.commit('setBlockNum', blockNum)
        document.documentElement.style.setProperty(`--block-num`, blockNum + '')
        document.documentElement.style.setProperty(`--block-size`, blockSize + 'px')
        document.documentElement.style.setProperty(`--page-width`, (blockNum * (blockSize + 20) - 20) + 'px')
      }
    }, 300)

    onMounted(() => {
      refreshLoginState()
      resetSize()
      window.onresize = () => {
        resetSize()
      }
    })

    return {
      route,
      isShowDrawer,
      itemList,
      menuList,
      key,
      userAvatar,
      nickName,
      playListCreate,
      playListCollect,
      isShowCreate,
      isShowCollect,
      currPath,
      loginState,
      pageChange,
      showDrawer,
      showDialog,
      openPlayList,
      routePrev,
      routeNext
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
  position: relative;
}

.view{
  margin: 0px auto;
}

.layout .footer {
  background: #fafafa;
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
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  color: #666;
  font-weight: bold;
  padding: 2px 10px;
  cursor: pointer;
}

.item:hover {
  background: #ededed;
  border-radius: 5px;
}

.item-click {
  color: #ffffff;
  font-weight: bold;
  background: var(--primary-color);
  border-radius: 5px;
  padding: 2px 10px;
}

.search {
  width: 250px;
  min-width: 150px;
  margin-left: 50px;
}

.search {
  border-radius: 20px;
}

.listItem{
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display: block;
  padding: 5px 10px;
  margin: 5px 0;
  font-weight: 500;
  color: #000;
  cursor: pointer;
}
.listItem-click {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display: block;
  padding: 5px 10px;
  margin: 5px 0;
  color: #ffffff;
  font-weight: bold;
  background: var(--primary-color);
  border-radius: 5px;
}
.listItem:hover{
  border-radius: 5px;
  background: #ededed;
}

.switch-route-leave-active,
.switch-route-enter-active {
  transition: all .5s;
}

.switch-route-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.switch-route-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
