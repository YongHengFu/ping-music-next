<template>
  <div ref="searchDialog" class="search-dialog">
    <div>
      <div v-if="historySearchList.length>0">
        <span>搜索历史</span>
        <span style="float: right;cursor: pointer" @click="clearHistorySearch">清空</span>
        <div class="history-search">
          <span
            v-for="item of historySearchList"
            :key="item"
            class="history-search-item"
            @click="goToSearch(item)"
          >{{ item }}</span>
        </div>
      </div>
      <span v-if="hotSearchList.length>0">热门搜索</span>
      <div class="hot-search">
        <span
          v-for="(item,index) of hotSearchList"
          :key="item"
          @click="goToSearch(item.first)"
        >{{index}}. {{ item.first }}</span>
      </div>
    </div>
    <!--    <div v-else>-->
    <!--      <span>热门搜索</span>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {getHotSearch, searchBestMatch} from '@/api/music'

export default defineComponent({
  name: 'SearchDialog',
  props: {
    searchKeyword: String
  },
  setup(props, ctx) {
    const router = useRouter()
    const searchDialog = ref()
    const historySearchList = ref([])
    const hotSearchList = ref([])
    const searchSuggestList = ref(<any>[])

    const getHistorySearchList = () => {
      const historySearchStr = localStorage.getItem('historySearch')
      if (historySearchStr !== null) {
        historySearchList.value = JSON.parse(historySearchStr)
      }
    }

    const clearHistorySearch = () => {
      historySearchList.value = []
      localStorage.setItem('historySearch', JSON.stringify(historySearchList.value))
    }

    const goToSearch = (item:string) => {
      ctx.emit('search', item)
    }

    const getHotSearchList = () => {
      getHotSearch().then((res:any) => {
        if (res.code === 200) {
          hotSearchList.value = res?.result?.hots
        }
      })
    }

    const getSearchSuggestData = () => {
      const param = {
        keywords: props?.searchKeyword
      }
      searchBestMatch(param).then((res:any) => {
        if (res.code === 200) {
          const result = res.result
          if (result?.orders?.length > 0) {
            searchSuggestList.value.order = result.orders
            const orders = result.orders
            for (const key in orders) {
              if (result[orders[key]]?.length > 0) {
                const first = result[orders[key]][0]
                const item = {
                  id: first?.id,
                  name: first?.name,
                  image: first?.picUrl,
                  subtitle: '',
                  type: -1 // 0:艺人，1：专辑，2：mv，3：歌单
                }
                const nameList = []
                switch (orders[key]) {
                  case 'artist':
                    item.subtitle = '艺人'
                    item.type = 0
                    break
                  case 'album':
                    item.subtitle = '专辑 • ' + first.artist.name
                    item.type = 1
                    break
                  case 'mv':
                    for (const art of first.artists) {
                      nameList.push(art.name)
                    }
                    // item.image = first.cover
                    item.subtitle = 'MV • ' + nameList.join('/')
                    item.type = 2
                    break
                  case 'playlist':
                    // item.image = first.coverImgUrl
                    item.subtitle = '歌单 • ' + first.creator.nickname
                    item.type = 3
                    break
                }
                item.image = item.image + '?param=300y300'
                searchSuggestList.value.push(item)
              }
            }
          }
        }
      })
    }

    onMounted(() => {
      document.onmousedown = (e) => {
        if (searchDialog.value && !searchDialog.value.contains(e.target)) {
          ctx.emit('close')
        }
      }
      getHotSearchList()
      getHistorySearchList()
    })

    return {
      searchDialog,
      historySearchList,
      hotSearchList,
      goToSearch,
      clearHistorySearch
    }
  }
})
</script>

<style scoped>
.search-dialog{
  width: 400px;
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  left: 300px;
  top: 50px;
  z-index: 10;
  background: #FFFFFF;
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 10px 15px;
}
.history-search{
  display: flex;
  flex-wrap: wrap;
}
.history-search-item{
  background: #FFFFFF;
  border: 1px solid #cccccc;
  border-radius: 20px;
  padding: 1px 15px;
  margin: 5px;
  cursor: pointer;
}
.history-search-item:hover{
  border: 1px solid var(--primary-color);
}
.hot-search{
  display: flex;
  flex-direction: column;
}
</style>
