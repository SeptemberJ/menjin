<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
<script>
import {MySha1} from './util/utils'
export default {
  name: 'App',
  created () {
    this.getAccessToken()
  },
  methods: {
    ConfigFn (JsapiTicket, AppId) {
      var mytimestamp = (Date.parse(new Date())) / 1000
      var mynonceStr = MySha1(String(mytimestamp)).substring(0, 16)
      var mysignature = 'jsapi_ticket=' + JsapiTicket + '&noncestr=' + mynonceStr + '&timestamp=' + mytimestamp + '&url=' + window.location.href.split("#")[0]
      wx.config({
        beta: true,
        debug: false,
        appId: AppId,
        timestamp: mytimestamp,
        nonceStr: mynonceStr,
        signature: MySha1(mysignature),
        jsApiList: [
          'scanQRCode',
          'chooseImage'
        ]
      })
      wx.error(function (res) {
        console.log('config失败---')
      })
      wx.ready(function () {
        console.log('ConfigFn ok')
      })
    },
    getPZ (ticket) {
      this.Http.get('/getWeixin', {id: 1}
      ).then(res => {
        this.ConfigFn(ticket, res.data.wxinfo.appid)
      }).catch((error) => {
        console.log(error)
      })
    },
    getAccessToken () {
      this.Http.get('/getAccessToken', {}
      ).then(res => {
        this.getTicket(res.data.accessToken)
      }).catch((error) => {
        console.log(error)
      })
    },
    getTicket (acessToken) {
      this.Http.get('/getJSApiTicket', {acess_token: acessToken},
      ).then(res => {
        this.getPZ(res.data.ticket)
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
