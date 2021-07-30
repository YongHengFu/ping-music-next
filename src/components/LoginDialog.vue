<template>
  <div class="mask">
    <div class="dialog">
      <div style="width: 100%;margin-bottom: 40px">
        <svg-icon name="close" style="float: right;color: #000c17;font-size: 20px " @click="closeDialog" />
      </div>
      <div class="head">
        <span style="font-size: 22px;font-weight: bolder;text-align: center">登录网易云账号</span>
      </div>
      <div v-if="model" class="qr-code">
        <Image :src="QRCodeImg" style="width: 100%" />
        <div v-if="QRState!==801&&!QRLoading" class="qr-mask">
          <div v-show="QRState===800" style="margin: auto;display: flex;flex-direction: column;align-items: center">
            <span style="color: #FFFFFF">二维码已失效</span>
            <button class="refresh-button" @click="getQRCode">
              刷新 <svg-icon name="refresh" style="font-size: 13px;" />
            </button>
          </div>
          <span v-show="QRState===802" style="margin: auto;text-align: center;color: #FFFFFF">扫描成功<br>请在手机上授权登录</span>
        </div>
        <lottie-player
          v-if="QRLoading"
          autoplay
          loop
          mode="bounce"
          :src="QRCodeLoading"
          class="qr-loading"
        />
      </div>
      <div v-else class="form">
        <div class="form-input">
          <svg-icon name="account" style="color: inherit" />
          <input ref="account" placeholder="手机 / 邮箱">
        </div>
        <div class="form-input">
          <svg-icon name="lock" />
          <input ref="password" placeholder="密码" type="password">
        </div>
        <button class="login-button" @click="login">
          <span v-if="!logging">登录</span>
          <span v-else class="logging">• • •</span>
        </button>
      </div>
      <span style="color: #aaaaaa;margin-top: 10px;font-size: 10px">{{ model?'使用网易云音乐APP进行扫码登录':'密码会经过MD5加密后再传输到服务器' }}</span>
      <span class="discolour" style="margin-top: 40px" @click="switchModel">{{ model?'账号密码':'手机扫码' }}登录 ></span>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { getQRCodeKey, getQRCodeData, getQRCodeState, getAccountInfo, loginByPhone, loginByEmail } from '@/api/user'
import Cookie from 'js-cookie'
import '@lottiefiles/lottie-player'
import QRCodeLoading from '@/assets/lottie/qrcode.json'
import { message } from 'ant-design-vue'
import MD5 from 'js-md5'
export default defineComponent({
  name: 'LoginDialog',
  setup() {
    const store = useStore()
    const model = ref(true) // true:扫码登录 false:账号密码登录
    const QRCodeImg = ref('')
    const QRState = ref(801) // 800为二维码过期,801为等待扫码,802为待确认,803为授权登录成功(803状态码下会返回cookies)
    const QRLoading = ref(true)
    const account = ref()
    const password = ref()
    const logging = ref(false)
    let QRKey = ''
    let isInvalid = false // true:停止获取二维码状态
    onMounted(() => {
      getQRCode()
    })

    const getQRCode = async() => {
      QRCodeImg.value = ''
      QRLoading.value = true
      QRState.value = 801
      QRKey = await getQRKey()
      QRCodeImg.value = await getQRCodeImg(QRKey)
      QRLoading.value = false
    }

    const getQRKey = () => {
      const param = {
        timestamp: new Date().getTime()
      }
      return getQRCodeKey(param).then(async(res: any) => {
        if (res.code === 200) {
          return res.data.unikey
        }
      })
    }

    const getQRCodeImg = (key: string) => {
      const param = {
        key: key,
        qrimg: 'true',
        timestamp: new Date().getTime()
      }
      return getQRCodeData(param).then((res: any) => {
        if (res.code === 200) {
          checkQRCodeState(param.key)
          isInvalid = false
          return res.data.qrimg
        }
      })
    }

    const checkQRCodeState = (key: string) => {
      const param = {
        key: key,
        timestamp: new Date().getTime()
      }
      param.timestamp = new Date().getTime()
      getQRCodeState(param).then((res:any) => {
        QRState.value = res.code
        if (res.code !== 800) {
          if (res.code !== 803) {
            setTimeout(() => {
              if (!isInvalid) {
                checkQRCodeState(param.key)
              }
            }, 1500)
          } else {
            isInvalid = true
            loginSuccess(res)
          }
        }
      })
    }

    const switchModel = () => {
      model.value = !model.value
      if (model.value) {
        isInvalid = false
        checkQRCodeState(QRKey)
      } else {
        isInvalid = true
      }
    }

    const login = async() => {
      logging.value = true
      const acc = account.value.value
      let pass = password.value.value
      const model = accountCheck(acc, pass) // 0：手机号登录； 1：邮箱号登录
      if (model !== -1) {
        pass = MD5(pass)

        if (model === 0) {
          const param = {
            phone: acc,
            password: '',
            md5_password: pass
          }
          await loginByPhone(param).then((res:any) => {
            if (res.code === 200) {
              loginSuccess(res)
            } else {
              message.error(res.msg)
            }
            logging.value = false
          })
        } else {
          const param = {
            email: acc,
            password: '',
            md5_password: pass
          }
          await loginByEmail(param).then((res:any) => {
            if (res.code === 200) {
              loginSuccess(res)
            } else {
              message.error(res.msg)
            }
            logging.value = false
          })
        }
      }
    }

    const loginSuccess = async(result:any) => {
      localStorage.setItem('cookie', result.cookie)
      setCookies(result.cookie)
      let res = result
      if (!result.account) {
        await getAccountInfo().then((result:any) => {
          if (result.code === 200 && result.account) {
            res = result
          }
        })
      }
      store.commit('setLoginState', true)
      localStorage.setItem('userName', res.profile.userName)
      localStorage.setItem('usid', res.profile.userId)
      localStorage.setItem('nickName', res.profile.nickname)
      localStorage.setItem('avatarUrl', res.profile.avatarUrl)
      closeDialog()
      message.success('哈喽!~' + res.profile.nickname)
    }

    const setCookies = (cookieStr:string) => {
      const cookies = cookieStr.split(';;')
      cookies.map(cookie => {
        document.cookie = cookie
      })
    }

    const accountCheck = (account: string, password: string) => {
      if (account !== '' && password !== '') {
        const phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (!phone.test(account)) {
          const email = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
          if (!email.test(account)) {
            message.error('请输入正确的手机号或邮箱号')
            return -1
          } else {
            return 1
          }
        } else {
          return 0
        }
      } else {
        message.error('账号密码不能为空')
        return -1
      }
    }

    // const saveCookie = (cookie: string) => {
    //   const cookies = cookie.split(';')
    //   const list = ['_csrf', 'NMTID', 'MUSIC_U']
    //   for (const item of cookies) {
    //     for (const val of list) {
    //       let index = item.indexOf(val)
    //       if (index !== -1) {
    //         index = item.indexOf('=')
    //         const name = item.slice(0, index)
    //         const value = item.slice(index + 1)
    //         Cookie.set(name, value)
    //         break
    //       }
    //     }
    //   }
    // }

    const closeDialog = () => {
      isInvalid = true
      store.commit('setShowDialog', -1)
    }

    return {
      model,
      QRCodeImg,
      QRState,
      QRCodeLoading,
      QRLoading,
      account,
      password,
      logging,
      getQRCode,
      closeDialog,
      switchModel,
      login
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
  padding: 20px;
}
.head{

}
.qr-code{
  position: relative;
  border: #cccccc 1px dashed;
  margin-top: 30px;
  width: 300px;
  height: 300px;
/*  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;*/
}
.qr-mask{
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.9;
  background: #5f5f5f;
}
.qr-loading{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.refresh-button{
  border: none;
  outline: none;
  cursor: pointer;
  background: #FFFFFF;
}
.refresh-button:active{
  background: #d0d0d0;
}
.form{
  margin-top: 30px;
  padding-top: 20px;
  width: 300px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-input{
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  background: #f5f5f7;
  margin: 15px 0;
  padding: 8px 10px;
  border-radius: 6px;
}
input{
  font-size: 20px;
  outline: none;
  border: none;
  background: none;
  margin-left: 8px;
  font-weight: 600;
}
input:focus{
  color: var(--primary-color);
}
.login-button{
  height: 45px;
  width: 100%;
  font-size: 20px;
  font-weight: bolder;
  margin-top: 50px;
  border-radius: 6px;
  border: none;
  padding: 6px 10px;
  color: var(--primary-color);
  background: var(--light-color);
  cursor: pointer;
}

.logging{
  animation: logging 1s infinite  alternate;
}
@keyframes logging {
  form{
    opacity: 1;
  }
  to{
    opacity: 0.2;
  }
}

::-webkit-input-placeholder {
  color: #aaaaaa;
}
::-moz-placeholder{
  color: #aaaaaa;
}
</style>
