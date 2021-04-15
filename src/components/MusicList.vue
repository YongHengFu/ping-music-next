<template>
  <div>
    <table style="width: 100%;" cellpadding="10px">
      <tr style="color: #898787">
<!--        <td style="max-width: 18px" />-->
        <td style="width: 90%">
          <table style="width: 100%;table-layout:fixed;">
            <tr>
              <td>歌曲</td>
              <td>歌手</td>
              <td>专辑</td>
            </tr>
          </table>
        </td>
        <td style="width: 10%">时长</td>
      </tr>
      <!--      <div style="height: 10px" />-->
      <tr
        v-for="(item,index) of data"
        :key="item.id"
        class="row"
        :style="{background: index===selectIndex?'#efefef':''}"
        @click="selectIndex=index"
      >
<!--        <td style="max-width: 18px"><svg-icon name="love" style="color: #cccccc" /></td>-->
        <td style="width: 90%">
          <table style="width: 100%;table-layout:fixed;">
            <tr>
              <td>
                <div class="clo">
                  <span class="text name">
                    <svg-icon name="love" style="color: #cccccc;margin-right: 15px" />{{ item.name }}</span>
                  <div class="icons" :style="index===selectIndex?'display: flex;justify-content: space-between;align-items: center;':''">
                    <svg-icon class="icon" :name="index===currIndex?'listPause':'listPlay'" />
                    <svg-icon class="icon" name="add" />
                    <svg-icon class="icon" name="more" />
                  </div>
                </div>
              </td>
              <td>
                <div class="clo">
                  <span class="text">
                    <template
                      v-for="(item2,index2) of item.artist"
                    >{{ item2.name }}{{ index2===item.artist.length-1? '' : '/' }}</template>
                  </span>
                </div>
              </td>
              <td>
                <div class="clo">
                  <span class="text">{{ item.album.name }}</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
        <td style="width: 10%"><span>{{ item.duration }}</span></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HistoryPlay',
  components: { },
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      selectIndex: -1
    }
  }
})
</script>

<style scoped>
.row{
  font-size: 15px;
  color: #000000;
}
.row:hover{
  background: #efefef;
}
.clo{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.icons{
  display: none;
  color: #575757;
  width: 100px;
  height: 23px;
  font-size: 18px;
  margin-right: 10px;
}

.row:hover .icons{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
</style>
