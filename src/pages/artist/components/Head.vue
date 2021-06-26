<template>
  <div class="head">
    <div class="cover">
      <Image :src="artist?.cover+'?param=500y500'" :type="0" radius="5px" style="width: 100%" />
    </div>
    <div class="content">
      <div class="info">
        <span class="h1" style="margin-bottom: 0px">{{ artist?.name??'周杰伦' }}</span>
        <button class="discolour like-button"><svg-icon name="love" /></button>
      </div>
      <div>
        <span class="works">{{ artist?.musicSize??100 }}首歌 • {{ artist?.albumSize??25 }}张专辑 • {{ artist?.mvSize??58 }}支MV</span>
      </div>
      <div>
        <span class="description" :title="artist?.briefDesc">{{ artist?.description??'周杰伦（Jay Chou），1979年1月18日出生于台湾省新北市，祖籍福建省泉州市永春县，中国台湾流行乐男歌手、原创音乐人、演员、导演、编剧，毕业于淡江中学。\n2000年发行首张个人专辑《Jay》。2001年发行的专辑《范特西》奠定其融合中西方音乐的风格。2002年举行“The One”世界巡回演唱会。2003年成为美国《时代周刊》封面人物。2004年获得世界音乐大奖中国区最畅销艺人奖。2005年凭借动作片《头文字D》获得台湾电影金马奖、香港电影金像奖最佳新人奖。2006年起连续三年获得世界音乐大奖中国区最畅销艺人奖。2007年自编自导的文艺片《不能说的秘密》获得台湾电影金马奖年度台湾杰出电影奖。\n2008年凭借歌曲《青花瓷》获得第19届金曲奖最佳作曲人奖。2009年入选美国CNN评出的“25位亚洲最具影响力的人物”，同年获得第20届金曲奖最佳国语男歌手奖。2010年入选美国《Fast Company》评出的“全球百大创意人物”。2011年再度获得金曲奖最佳国语男歌手奖，并且第4次获得金曲奖最佳国语专辑奖；同年主演好莱坞电影《青蜂侠》。2012年登福布斯中国名人榜榜首。2014年发行华语乐坛首张数字音乐专辑《哎呦，不错哦》。2019年起举行“嘉年华”世界巡回演唱会。\n演艺事业外，他还涉足商业、设计等领域。2007年成立杰威尔有限公司。2011年担任华硕笔电设计师并入股香港文化传信集团。\n周杰伦热心公益慈善，多次向中国内地灾区捐款捐物。2008年捐款援建希望小学。2014年担任中国禁毒宣传形象大使。' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getArtistInfo } from '@/api/music'

export default defineComponent({
  name: 'Info',
  props: {
    id: String
  },
  setup(props, ctx) {
    const artist = ref({})

    const getArtistIndfoData = () => {
      const param = { id: props?.id }
      getArtistInfo(param).then((res) => {
        if (res?.code === 200) {
          artist.value = res?.data?.artist
        }
      })
    }

    onMounted(() => {
      getArtistIndfoData()
    })

    return {
      artist
    }
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.cover{
  width: 230px;
  border-radius: 15px;
  overflow: hidden;
}
.content{
  width: calc(100% - 300px);
  height: 200px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.works{
  color: #5a5a5a;
  font-weight: bolder;
  font-size: 14px;
}
.description{
  width: 100%;
  font-size: 13px;
  color: #929292;
  padding-right: 40px;
  user-select: none;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}
.like-button{
  margin-top: 5px;
  width: 35px;
  height: 30px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
  margin-left: 40px;
  outline: none;
  font-weight: bolder;
  color: #1a1a1a;
}
</style>
