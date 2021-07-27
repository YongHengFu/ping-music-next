<template>
  <div
    v-if="(searchKeyword.length===0&&(historySearchList.length>0||hotSearchList.length>0))
      ||(searchKeyword.length>0&&Object.keys(searchSuggest).length>0)"
    ref="searchDialog"
    class="search-dialog"
  >
    <div v-if="searchKeyword.length==0">
      <div v-if="historySearchList.length>0" style="margin: 10px 15px">
        <span>搜索历史</span>
        <span style="float: right;cursor: pointer" class="clear" @click="clearHistorySearch"><svg-icon name="trash" /></span>
        <div class="history-search">
          <span
            v-for="item of historySearchList"
            :key="item"
            class="history-search-item"
            @click="goToSearch(item)"
          >{{ item }}</span>
        </div>
      </div>
      <span v-if="hotSearchList.length>0" style="display:block;margin: 15px 0 5px 15px;">热门搜索</span>
      <div class="hot-search">
        <div
          v-for="(item,index) of hotSearchList"
          :key="item.searchWord"
          class="hot-search-item"
          @click="goToSearch(item.searchWord)"
        >
          <span class="index" :style="index<3?'color:red':''">{{ index }}</span>
          <div>
            <div>
              <span class="keyword">{{ item.searchWord }}</span>
              <svg-icon v-if="index<3" name="fire-fill" style="color: red;font-size: 14px;margin-left: 5px" />
              <span class="score">{{ item.score }}</span>
            </div>
            <div>
              <span class="content">{{ item.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="search-suggest">
      <span style="padding: 5px;color: #000000;font-weight: 500">猜您想找：</span>
      <div v-if="searchSuggest?.songs?.length>0" class="search-suggest-item">
        <span class="title">歌曲</span>
        <span v-for="item of searchSuggest.songs" :key="item.id" class="content" @click="playMusic(item.id)">{{ item.name }}-
          <span v-for="(item2,index2) of item.artists" :key="item2.id">
            {{ item2.name }}{{ index2===item.artists.length-1?'':'/' }}
          </span>
        </span>
      </div>

      <div v-if="searchSuggest?.artists?.length>0" class="search-suggest-item">
        <span class="title">歌手</span>
        <span v-for="item of searchSuggest.artists" :key="item.id" class="content" @click="goToArtist(item.id)">{{ item.name }}
        </span>
      </div>

      <div v-if="searchSuggest?.albums?.length>0" class="search-suggest-item">
        <span class="title">专辑</span>
        <span v-for="item of searchSuggest.albums" :key="item.id" class="content" @click="goToAlbum(item.id)">{{ item.name }}-{{ item.artist.name }}
        </span>
      </div>

      <div v-if="searchSuggest?.playlists?.length>0" class="search-suggest-item">
        <span class="title">歌单</span>
        <span v-for="item of searchSuggest.playlists" :key="item.id" class="content" @click="goToPlaylist(item.id)">{{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getHotSearch, getSearchSuggest } from '@/api/music'
import { playSingle } from '@/utils/musicList'

export default defineComponent({
  name: 'SearchDialog',
  props: {
    searchKeyword: String
  },
  setup(props, ctx) {
    const router = useRouter()
    const searchDialog = ref()
    const historySearchList = ref([])
    const hotSearchList = ref(<any>[])
    const searchSuggest = ref({})

    watch(props, () => {
      if (props?.searchKeyword && props.searchKeyword.length > 0) {
        getSearchSuggestData()
      }
    })

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

    const playMusic = (id:string) => {
      ctx.emit('close')
      playSingle(id)
    }
    const goToArtist = (id:string) => {
      ctx.emit('close')
      router.push('/artist/' + id)
    }
    const goToAlbum = (id:string) => {
      ctx.emit('close')
      router.push('/album/' + id)
    }
    const goToPlaylist = (id:string) => {
      ctx.emit('close')
      router.push('/playlist/' + id)
    }

    const getHotSearchList = () => {
      getHotSearch().then((res:any) => {
        if (res.code === 200) {
          hotSearchList.value = res.data
        }
      })
    }

    const getSearchSuggestData = () => {
      const param = {
        keywords: props?.searchKeyword
      }
      getSearchSuggest(param).then((res:any) => {
        if (res.code === 200) {
          searchSuggest.value = res.result
        }
      })
    }

    onMounted(() => {
      document.onmousedown = (e) => {
        if (searchDialog.value && !searchDialog.value.contains(e.target)) {
          ctx.emit('close')
        }
      }
      if (props?.searchKeyword && props.searchKeyword.length > 0) {
        getSearchSuggestData()
      }
      getHotSearchList()
      getHistorySearchList()
    })

    return {
      searchDialog,
      historySearchList,
      hotSearchList,
      searchSuggest,
      goToSearch,
      clearHistorySearch,
      playMusic,
      goToArtist,
      goToAlbum,
      goToPlaylist
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
}
.history-search{
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
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
.hot-search-item{
  display: flex;
  align-items: center;
  padding: 5px 0;
  cursor: pointer;
}
.hot-search-item:hover{
  background: #eeeeee;
}
.hot-search-item .index{
  width: 20px;
  margin: 0 15px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #C4C4C4;
}
.hot-search-item .keyword{
  font-size: 15px;
  color: #000000;
}
.hot-search-item .score{
  margin-left: 10px;
  font-size: 10px;
  color: #a1a1a1;
}
.hot-search-item .content{
  font-size: 12px;
  color: #a1a1a1;
}

.search-suggest{
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}
.search-suggest-item{
  display: flex;
  flex-direction: column;
}
.search-suggest-item .title{
  padding-left: 10px;
  background: #F5F5F7;
}
.search-suggest-item .content{
  padding: 3px 0;
  padding-left: 25px;
  cursor: pointer;
}
.search-suggest-item .content:hover{
  background: #eeeeee;
}
</style>
