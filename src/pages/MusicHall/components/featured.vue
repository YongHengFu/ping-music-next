<template>
  <div>
    <div style="position: relative;height: 250px">
      <Banner class="banner" />
    </div>
    <div>
      <span class="h2" style="cursor: pointer" @click="changeTab('PlayList')">推荐歌单<RightOutlined style="font-size: 22px;text-align: center" /></span>
      <div class="play-list">
        <MaxCover
          v-for="n of rcmdPlayList.length>(blockNum*2)?blockNum*2:rcmdPlayList.length"
          :key="n"
          :image="rcmdPlayList[n-1]?.picUrl"
          :text="rcmdPlayList[n-1]?.name"
          @open="openList(rcmdPlayList[n-1]?.id)"
          @play="playListAll(rcmdPlayList[n-1]?.id)"
        />
      </div>
    </div>
    <div>
      <span class="h2" style="cursor: pointer" @click="changeTab('PrivateContent')">独家放送<RightOutlined style="font-size: 22px;text-align: center" /></span>
      <div class="private-content-list">
        <div
          v-for="item of privateContentList"
          :key="item.id"
          class="private-content-list-item"
          @click="openMv(item.id)"
        >
          <Image
            :src="item.sPicUrl"
            :type="0"
            :play-icon="true"
            :animation="2"
            class="image"
            style="border-radius: 8px"
            @play="openMv(item.id)"
          />
          <span class="title">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div>
      <span class="h2" style="margin-right: 10px">最新先听 <a><svg-icon class="play-all" name="playAll" @click="playAll" /></a>
      </span>
      <div v-if="rcmdNewSongList.length>0">
        <div v-for="m of 3" :key="m" class="MusicBlock">
          <MusicBlock
            v-for="n of 4"
            :key="n"
            :music="rcmdNewSongList[(n-1)+(m-1)*3]"
            :index="(n-1)+(m-1)*3"
            @play="playSelect(rcmdNewSongList[(n-1)+(m-1)*3])"
          />
        </div>
      </div>
    </div>
    <div>
      <span class="h2">推荐MV<RightOutlined style="font-size: 22px;text-align: center" /></span>
      <div class="mv-list">
        <VideoCover
          v-for="item of rcmdMvList"
          :key="item.id"
          :image="item.picUrl"
          :text="item.name"
          :video-id="item?.id"
          type="mv"
        />
      </div>
      <!--      <div class="mv-list">-->
      <!--        <div-->
      <!--          v-for="item of rcmdMvList"-->
      <!--          :key="item.id"-->
      <!--          class="mv-list-item"-->
      <!--          @click="openMv(item.id)"-->
      <!--        >-->
      <!--          <Image-->
      <!--            :src="item.picUrl+'?param=960y540'"-->
      <!--            :type="0"-->
      <!--            :play-icon="true"-->
      <!--            :animation="2"-->
      <!--            class="image"-->
      <!--            style="border-radius: 8px"-->
      <!--            @play="openMv(item.id)"-->
      <!--          />-->
      <!--          <span class="title">{{ item.name }}</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { RightOutlined } from '@ant-design/icons-vue'
import Banner from '@/components/Banner.vue'
import MaxCover from '@/components/MaxCover.vue'
import MusicBlock from '@/components/MusicBlock.vue'
import VideoCover from '@/components/VideoCover.vue'
import { getPrivateContent, getRcmdMv, getRcmdNewSong, getRcmdPlayList } from '@/api/music'
import { playList } from '@/utils/musicList'
import '@lottiefiles/lottie-player'
import { playAble } from '@/utils/musicList'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'Featured',
  components: {
    RightOutlined,
    Banner,
    MaxCover,
    MusicBlock,
    VideoCover
  },
  setup(props, ctx) {
    const router = useRouter()
    const store = useStore()
    const blockNum = computed(():number => store.state.blockNum)
    const rcmdPlayList = ref(<any>[])
    const rcmdNewSongList = ref(<any>[])
    const rcmdMvList = ref(<any>[])
    const privateContentList = ref(<any>[])

    const playMusicList:any = []
    let playIndex = 0

    const getRcmdPlayListData = async() => {
      const param = { limit: 12 }
      await getRcmdPlayList(param).then((res:any) => {
        if (res.code === 200) {
          rcmdPlayList.value = res.result
        }
      })
    }

    const getRcmdNewSongData = async() => {
      const param = { limit: 30 }
      await getRcmdNewSong(param).then((res:any) => {
        if (res.code === 200) {
          setMusicList(res.result)
        }
      })
    }

    const getRcmdMvData = async() => {
      await getRcmdMv().then((res:any) => {
        if (res.code === 200) {
          rcmdMvList.value = res.result
        }
      })
    }

    const getPrivateContentData = async() => {
      await getPrivateContent().then((res:any) => {
        if (res.code === 200) {
          privateContentList.value = res.result
        }
      })
    }

    const setMusicList = (list:any) => {
      const songList = []
      for (const [index, item] of list.entries()) {
        const song:any = {
          index: index,
          id: item.song.id,
          name: item.song.name,
          artist: item.song.artists,
          album: item.song.album,
          mvId: item.song.mvid,
          duration: item.song.duration / 1000,
          publishTime: item.song.publishTime,
          privileges: item.song.privilege,
          fee: item.song.fee,
          noCopyrightRcmd: item.song.noCopyrightRcmd,
          canPlay: null,
          listId: 'newSong'
        }
        song.canPlay = playAble(song)
        songList.push(song)
        if (song.canPlay.able) {
          song.index = playIndex
          playIndex++
          playMusicList.push(song)
        }
      }
      rcmdNewSongList.value = songList
    }

    const openList = (id:string) => {
      router.push('/playList/' + id)
    }

    const openMv = (id:string) => {
      router.push('/videoPlayer/mv' + '/' + id)
    }

    const playListAll = (id:string) => {
      playList(id)
    }

    const playAll = () => {
      if (playMusicList.length > 0) {
        // isPlayAll = true
        store.commit('setCurrMusic', playMusicList[0])
        store.commit('setMusicList', playMusicList)
      }
    }

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
        for (const item of playMusicList) {
          if (item.id === music.id) {
            store.commit('setCurrMusic', item)
            store.commit('setMusicList', playMusicList)
            return
          }
        }
      } else {
        message.error(music.canPlay.msg)
      }
    }

    const changeTab = (tabName:string) => {
      ctx.emit('change', tabName)
    }

    onMounted(() => {
      getRcmdPlayListData()
      getRcmdNewSongData()
      getRcmdMvData()
      getPrivateContentData()
    })

    return {
      blockNum,
      rcmdPlayList,
      rcmdNewSongList,
      rcmdMvList,
      privateContentList,
      openList,
      openMv,
      playListAll,
      playAll,
      playSelect,
      changeTab
    }
  }
})
</script>

<style scoped>
.banner{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.play-all{
  font-size: 24px;
  color: var(--primary-color);
  cursor: pointer;
}
.play-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.MusicBlock{
  width: var(--page-width);
  display: flex;
  justify-content: space-between;
}
.mv-list{
  display: grid;
  grid-template-columns: repeat(4, calc((var(--page-width) - 60px) / 4));
  grid-template-rows: repeat(1, calc(((var(--page-width) - 60px) / 4) * (9 / 16) + 20px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.mv-list-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}
.mv-list-item .title{
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}

.private-content-list{
  display: grid;
  grid-template-columns: repeat(3, calc((var(--page-width) - 40px) / 3));
  grid-template-rows: repeat(1, calc(((var(--page-width) - 40px) / 3) * (18 / 30) + 15px));
  grid-gap: 20px 20px;
  margin: 15px 0;
}
.private-content-list-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
.private-content-list-item .title{
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
</style>
