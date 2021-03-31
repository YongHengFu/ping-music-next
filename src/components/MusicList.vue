<template>
  <div>
    <table>
      <tr>
        <td></td>
        <td>歌曲</td>
        <td>歌手</td>
        <td>专辑</td>
        <td>时长</td>
      </tr>
      <tr v-for="(item,index) of data" :key="item.id">
        <td><svg-icon name="love" /></td>
        <td>{{ item.name }}</td>
        <td>
          <span
            v-for="(item2,index2) of item.artist"
            :key="item2.id"
          >{{ item2.name }}{{ index2===item.artist.length-1? '' : '/' }}</span>
        </td>
        <td>{{item.album.name}}</td>
        <td>{{item.duration}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HistoryPlay',
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {

    }
  }
})
</script>

<style scoped>

</style>
