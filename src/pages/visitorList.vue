<template>
  <div class="VisitorList">
    <van-nav-bar title="申请列表" @click-right="add">
      <van-icon name="add-o" slot="right" size="25px"/>
    </van-nav-bar>
    <!-- <van-collapse v-model="activeNames">
      <van-collapse-item v-for="(item, idx) in applyList" :key="idx" :name="idx">
        <div slot="title">
          <span style="width: 75%;text-align: left;display: inline-block;">来访时间：{{item.fdate}}<van-icon name="qr" @click="seeQR" style="margin-left: 5px;" size="25px" color="#0079f3"/></span>
          <span style="width: 20%;text-align: right;display: inline-block;">{{item.fstatusTxt}}</span>
        </div>
        <div>
          <span style="width: 45%;text-align: left;display:inline-block;">申请人：{{item.fname}}</span>
          <span style="width: 53%;text-align: right;display:inline-block;">电话：{{item.fmobile}}</span>
          <span style="width: 100%;text-align: left;display:block;">来访区域：{{item.fname1}}</span>
          <span style="width: 100%;text-align: left;display:block;">被访人：{{item.username}}</span>
          <span style="width: 100%;text-align: left;display:block;">来访事由：{{item.freason}}</span>
        </div>
      </van-collapse-item>
    </van-collapse> -->
    <van-row v-for="(item, idx) in applyList" :key="idx" :name="idx" style="font-size: 14px;text-align: left;border-bottom: 15px solid #efefef;padding: 10px;background: #ffffff;">
      <van-col span="20" class="MarginT_8">来访时间：{{item.fdate}}</van-col>
      <van-col span="4" class="MarginT_8" style="text-align: right;">{{item.fstatusTxt}}</van-col>

      <van-col span="16" class="">
        <van-row>
          <van-col span="24" class="MarginT_8">申请人：{{item.fname}}</van-col>
          <van-col span="24" class="MarginT_8">电话：{{item.fmobile}}</van-col>
          <van-col span="24" class="MarginT_8">来访区域：{{item.fname1}}</van-col>
          <van-col span="24" class="MarginT_8">被访人：{{item.username}}</van-col>
          <van-col span="24" class="MarginT_8">来访事由：{{item.freason}}</van-col>
        </van-row>
      </van-col>
      <van-col span="8" class="MarginT_8" style="text-align: right;padding-top:10px;padding-right:10px;">
        <div @click="preview(item.descode)">
          <qriously v-if="item.fstatus == 1" :value="item.descode" :size="110"/>
        </div>
      </van-col>
    </van-row>

    <van-popup v-model="showQR">
      <qriously :value="qrcode" :size="220" style="padding: 10px;"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'VisitorList',
  data () {
    return {
      applyList: [],
      showQR: false,
      qrcode: ''
    }
  },
  computed: {
    ...mapState({
      openId: state => state.openId
    })
  },
  created () {
    if (this.openId) {
      this.getApplyList(this.openId)
    } else {
      let AppId = 'wx9c1d6a69814e3842'
      let CODE = this.getUrlParms('code')
      let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppId + '&redirect_uri=' + encodeURIComponent('http://yzx.granity.cn/dist') + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
      if (!CODE) {
        window.location.href = url
      } else {
        this.getOpenId(CODE)
      }
    }
  },
  methods: {
    ...mapActions([
      'updateOpenId'
    ]),
    getOpenId (CODE) {
      this.Http.get('/getOpenid', {code: CODE}
      ).then(res => {
        this.updateOpenId(res.data.openid)
        this.getApplyList(res.data.openid)
      }).catch((error) => {
        console.log(error)
      })
    },
    getUrlParms (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    getApplyList (openid) {
      this.Http.get('/wxFkRecord', {openid: openid}
      ).then(res => {
        this.applyList = res.data.list.map(item => {
          item.fstatusTxt = item.fstatus === '0' ? '未审核' : (item.fstatus === '1' ? '同意' : '不同意')
          return item
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    add () {
      this.$router.push({name: '访客邀请'})
    },
    preview (descode) {
      this.showQR = true
      this.qrcode = descode
    }
  }
}
</script>

<style scoped>
.VisitorList{
  background: #efefef;
}
.MarginT_8{
  margin-top: 8px;
}
</style>
