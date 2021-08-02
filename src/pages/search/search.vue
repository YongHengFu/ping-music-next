<template>
  <div class="page-search">
    <span class="h1">关于"{{ keywords }}"搜索结果</span>
    <div>
      <span class="h2">最佳匹配</span>
      <div class="best-match">
        <div v-for="item of bestMatch" :key="item.id" class="best-match-item" @click="open(item.type,item.id)">
          <Image :src="item.image" :typr="1" radius="8px" class="image" :style="item.type===2?'width: 178px':''" />
          <div class="info">
            <span class="text" style="font-size: 18px;font-weight: bolder">{{ item.name }}</span>
            <span class="text">{{ item.subtitle }}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <span class="h2">专辑</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="album-list">
        <MaxCover
          v-for="n of searchResults?.album?.albums?.length>(blockNum*2)?blockNum*2:searchResults?.album?.albums?.length"
          :key="n"
          :image="searchResults.album?.albums[n-1]?.picUrl"
          :text="searchResults.album?.albums[n-1]?.name"
          @open="open(1,searchResults.album?.albums[n-1]?.id)"
          @play="playAll(1,searchResults.album?.albums[n-1]?.id)"
        />
      </div>
    </div>
    <div>
      <span class="h2">艺人</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="simi-list">
        <ArtistCover
          v-for="n of searchResults?.artist?.artists?.length>(blockNum*2)?blockNum*2:searchResults?.artist?.artists?.length"
          :key="n"
          :image="searchResults?.artist?.artists[n-1]?.picUrl"
          :text="searchResults?.artist?.artists[n-1]?.name"
          :artist-id="searchResults?.artist?.artists[n-1]?.id"
        />
      </div>
    </div>
    <div>
      <span class="h2">歌单</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="album-list">
        <MaxCover
          v-for="n of searchResults?.playList?.playLists?.length>(blockNum*2)?blockNum*2:searchResults?.playList?.playLists?.length"
          :key="n"
          :image="searchResults.playList?.playLists[n-1]?.coverImgUrl"
          :text="searchResults.playList?.playLists[n-1]?.name"
          @open="open(3,searchResults.playList?.playLists[n-1]?.id)"
          @play="playAll(3,searchResults.playList?.playLists[n-1]?.id)"
        />
      </div>
    </div>
    <div>
      <span class="h2">视频</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="mv-list">
        <VideoCover
          v-for="n of searchResults?.video?.videos?.length>4?4:searchResults?.video?.videos?.length"
          :key="n"
          :image="searchResults?.video?.videos[n-1]?.coverUrl"
          :text="searchResults?.video?.videos[n-1]?.title"
          :video-id="searchResults?.video?.videos[n-1]?.vid"
          :type="searchResults?.video?.videos[n-1]?.type===0?'mv':'video'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MaxCover from '@/components/MaxCover.vue'
import MusicBlock from '@/components/MusicBlock.vue'
import ArtistCover from '@/components/ArtistCover.vue'
import VideoCover from '@/components/VideoCover.vue'
import { searchBestMatch, searchByKeywords } from '@/api/music'
import router from '@/router'
import { playAblume, playList } from '@/utils/musicList'
export default defineComponent({
  name: 'Search',
  components: {
    MusicBlock,
    MaxCover,
    VideoCover,
    ArtistCover
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const blockNum = computed(():number => store.state.blockNum)
    const keywords = route.params.keywords
    const bestMatch = ref(<any>[])
    const searchResults:any = ref({
      song: null,
      artist: null,
      album: null,
      playlist: null,
      video: null
    })

    const getBestMatch = () => {
      const param = {
        keywords: keywords
      }
      searchBestMatch(param).then((res:any) => {
        if (res.code === 200) {
          const result = res.result
          if (result?.orders?.length > 0) {
            bestMatch.value.order = result.orders
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
                    item.image = first.cover
                    item.subtitle = 'MV • ' + nameList.join('/')
                    item.type = 2
                    break
                  case 'playlist':
                    item.image = first.coverImgUrl
                    item.subtitle = '歌单 • ' + first.creator.nickname
                    item.type = 3
                    break
                }
                item.image = item.image + '?param=300y300'
                bestMatch.value.push(item)
              }
            }
          }
        }
      })
    }
    const searchAll = () => {
      const param = {
        keywords: keywords,
        type: 1018
      }
      searchByKeywords(param).then((res:any) => {
        if (res.code === 200) {
          searchResults.value = res.result
        }
      })
    }

    const open = (type:number, id:string) => {
      switch (type) {
        case 0:
          router.push('/artist/' + id)
          break
        case 1:
          router.push('/album/' + id)
          break
        case 2:
          router.push('/artist/' + id)
          break
        case 3:
          router.push('/playlist/' + id)
          break
      }
    }

    const playAll = (type:number, id:string) => {
      if (type === 1) {
        playAblume(id)
      } else {
        playList(id)
      }
    }

    onMounted(() => {
      getBestMatch()
      searchAll()
    })

    return {
      keywords,
      blockNum,
      bestMatch,
      searchResults,
      open,
      playAll
    }
  }
})
</script>

<style scoped>
.page-search{
  width: var(--page-width);
}
.best-match{
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.best-match-item{
  width: 400px;
  height: 100px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  background: #eaeaea;
  border-radius: 8px;
  margin-right: 30px;
  cursor: pointer;
  transition: 0.2s;
}
.best-match-item:hover{
  transform: translateY(-10px);
}
.image{
  width: 100px;
  height: 100px;
  margin-right: 20px;
  object-fit: cover
}
.info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*white-space:nowrap;*/
}
.album-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.mv-list{
  display: grid;
  grid-template-columns: repeat(4, calc((var(--page-width) - 60px) / 4));
  grid-template-rows: repeat(1, calc(((var(--page-width) - 60px) / 4) * (9 / 16) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.simi-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
</style>
