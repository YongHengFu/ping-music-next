<template />

<script>
import { defineComponent, computed, watch, ref } from 'vue'
import { Howl, Howler } from 'howler'
export default {
  name: 'Player2',
  setup() {
    debugger
    const sound = new Howl({
      src: ['https://music.163.com/song/media/outer/url?id=1811459887.mp3'],
      html5: true
    })

    sound.play()
    return {

    }
  }
}
</script>

<style scoped>

</style>
