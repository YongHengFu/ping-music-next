<template>
  <div class="mask">
    <div class="dialog">
      <div style="width: 100%;margin-bottom: 60px">
        <svg-icon name="close" style="float: right;color: #000c17;font-size: 20px " @click="closeDialog" />
      </div>
      <div class="head">
        <span style="font-size: 22px;font-weight: bolder;text-align: center">登录网易云账号</span>
      </div>
      <div v-if="model===0" class="qr-code">
        <img :src="QRCodeImg">
      </div>
      <div v-else class="form">
        <input class="forn-input" placeholder="手机号">
        <input class="forn-input" placeholder="密码">
        <button>登录</button>
      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { getQRCodeKey, getQRCode, getQRCodeState } from '@/api/user.ts'
import Cookie from 'js-cookie'
export default defineComponent({
  name: 'LoginDialog',
  setup() {
    const store = useStore()
    const model = ref(0) // 0:扫码登录 1：账号密码登录
    const QRCodeImg = ref('')
    let QRKey = ref('')
    onMounted(async() => {
      QRKey = await getQRKey()
      QRCodeImg.value = await getQRCodeImg(QRKey)
    })

    const getQRKey = () => {
      return getQRCodeKey().then(async(res) => {
        if (res.code === 200) {
          return res.data.unikey
        }
      })
    }

    const getQRCodeImg = (key) => {
      const param = {
        key: key,
        qrimg: 'true',
        timestamp: new Date().getTime()
      }
      return getQRCode(param).then((res) => {
        if (res.code === 200) {
          checkQRCodeState(param)
          return res.data.qrimg
        }
      })
    }

    const checkQRCodeState = (key) => {
      const param = key
      param.timestamp = new Date().getTime()
      getQRCodeState(param).then((res) => {
        if (res.code !== 800) {
          if (res.code !== 803) {
            setTimeout(() => {
              checkQRCodeState(param)
            }, 1000)
          } else {
            saveCookie(res.cookie)
            console.log(res.cookie)
          }
        }
      })
    }

    const saveCookie = (cookie) => {
      const cookies = cookie.split(';')
      const list = ['_csrf', 'NMTID', 'MUSIC_U']
      for (const item of cookies) {
        for (const val of list) {
          let index = item.indexOf(val)
          if (index !== -1) {
            index = item.indexOf('=')
            const name = item.slice(0, index)
            const value = item.slice(index + 1)
            Cookie.set(name, value)
            break
          }
        }
      }
    }

    const closeDialog = () => {
      store.commit('setShowLoginDialog', false)
    }

    return {
      model,
      QRCodeImg,
      closeDialog
    }
  }
})
</script>

<style scoped>
.mask{
  display: flex;
}
.dialog{
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #FFFFFF;
  width: 500px;
  height: 550px;
  padding: 10px;
}
.head{

}
</style>
