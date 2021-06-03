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
        <!--        <img src="src/assets/image/cover2.jpg" style="width: 100%">-->
        <div v-if="QRState!==801" class="qr-mask">
          <div v-show="QRState===800" style="margin: auto;display: flex;flex-direction: column;align-items: center">
            <span>二维码已失效</span>
            <button class="refresh-button" @click="getQRCode">
              刷新 <svg-icon name="refresh" style="font-size: 13px" />
            </button>
          </div>
          <span v-show="QRState===802" style="margin: auto;text-align: center">扫描成功<br>请在手机上<a>授权登录</a></span>
        </div>
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
import { getQRCodeKey, getQRCodeData, getQRCodeState, getAccountInfo } from '@/api/user.ts'
import Cookie from 'js-cookie'
export default defineComponent({
  name: 'LoginDialog',
  setup() {
    const store = useStore()
    const model = ref(0) // 0:扫码登录 1：账号密码登录
    const QRCodeImg = ref('')
    const QRState = ref(801) // 800为二维码过期,801为等待扫码,802为待确认,803为授权登录成功(803状态码下会返回cookies)
    let QRKey = ref('')
    onMounted(() => {
      getQRCode()
    })

    const getQRCode = async() => {
      QRKey = await getQRKey()
      QRCodeImg.value = await getQRCodeImg(QRKey)
    }

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
      return getQRCodeData(param).then((res) => {
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
        QRState.value = res.code
        if (res.code !== 800) {
          if (res.code !== 803) {
            setTimeout(() => {
              checkQRCodeState(param)
            }, 1000)
          } else {
            saveCookie(res.cookie)
            closeDialog()
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
      getAccountInfo().then((res) => {
        console.log(res)
      })
    }

    const closeDialog = () => {
      store.commit('setShowLoginDialog', false)
    }

    return {
      model,
      QRCodeImg,
      QRState,
      getQRCode,
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
.qr-code{
  position: relative;
}
.qr-mask{
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.9;
  background: #cccccc;
}
.refresh-button{
  border: none;
  outline: none;
  cursor: pointer
}
.refresh-button:active{
  background: #FFFFFF;
}
</style>
