<template>
  <div class="InsertVisitor">
    <van-nav-bar
      title="访客邀请"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <van-field
      v-model="fname"
      clearable
      label="用户名"
      placeholder="请输入用户名"
    />
    <van-field
      v-model="fmobile"
      clearable
      label="电话号码"
      placeholder="请输入电话号码"
    />
    <van-field
      readonly
      clickable
      label="来访日期"
      :value="fdate"
      placeholder="选择日期"
      @click="showPickerFdate = true"
    />
    <van-popup v-model="showPickerFdate" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @cancel="showPickerFdate = false"
        @confirm="confirmFdate"
        @change="change"
      />
    </van-popup>

    <van-field
      readonly
      clickable
      label="到达时间"
      :value="ftimeS"
      placeholder="选择时间"
      @click="showPickerFtimeS = true"
    />
    <van-popup v-model="showPickerFtimeS" position="bottom">
      <van-datetime-picker
        type="time"
        :min-hour="minHour"
        :max-hour="maxHour"
        @cancel="showPickerFtimeS = false"
        @confirm="confirmFtimeS"
        @change="change"
      />
    </van-popup>

    <van-field
      readonly
      clickable
      label="离开时间"
      :value="ftimeE"
      placeholder="选择时间"
      @click="showPickerFtimeE = true"
    />
    <van-popup v-model="showPickerFtimeE" position="bottom">
      <van-datetime-picker
        type="time"
        :min-hour="minHour"
        :max-hour="maxHour"
        @cancel="showPickerFtimeE = false"
        @confirm="confirmFtimeE"
        @change="change"
      />
    </van-popup>

    <van-field
      v-model="freason"
      clearable
      label="来访事由"
      placeholder="请输入来访事由"
    />

    <van-field
      readonly
      clickable
      label="来访区域"
      :value="area"
      placeholder="选择区域"
      @click="showPickerArea = true"
    />
    <van-popup v-model="showPickerArea" position="bottom">
      <van-picker
        show-toolbar
        title="来访区域"
        :columns="columnsTxt"
        @cancel="showPickerArea = false"
        @confirm="confirmArea"
        @change="change"
      />
    </van-popup>

    <van-field
      v-model="username"
      clearable
      label="被访人"
      placeholder="请输入被访人"
    />

    <van-field
      v-model="userPhone"
      clearable
      label="被访人电话"
      placeholder="请输入被访人电话"
    />

    <van-button style="margin-top: 20px;" :loading="loading" type="danger" @click="apply">申 请</van-button>
  </div>
</template>

<script>
import {formatTime} from '../util/utils'
import { Toast } from 'vant'
import { mapState } from 'vuex'
export default {
  name: 'InsertVisitor',
  data () {
    return {
      loading: false,
      showPickerFdate: false,
      showPickerFtimeS: false,
      showPickerFtimeE: false,
      showPickerArea: false,
      minDate: new Date(),
      currentDate: new Date(),
      minHour: 6,
      maxHour: 23,
      columnsTxt: [],
      columns: [],
      fname: '',
      fmobile: '',
      fdate: '',
      ftimeS: '',
      ftimeE: '',
      freason: '',
      area: '',
      areaId: '',
      fcode: '',
      username: '',
      userPhone: ''
    }
  },
  computed: {
    ...mapState({
      openId: state => state.openId
    })
  },
  created () {
    this.getAreaList()
  },
  methods: {
    back () {
      this.$router.push({name: '申请列表'})
    },
    confirmFdate (value) {
      this.fdate = formatTime(value)
      this.showPickerFdate = false
    },
    confirmFtimeS (value) {
      this.ftimeS = value
      this.showPickerFtimeS = false
    },
    confirmFtimeE (value) {
      this.ftimeE = value
      this.showPickerFtimeE = false
    },
    confirmArea (value) {
      this.area = value
      this.showPickerArea = false
      let curArea = this.columns.filter(this.checkArea)[0]
      this.areaId = curArea.id
      this.fcode = curArea.fcode
    },
    change (value) {
      // console.log(value)
    },
    checkArea (area) {
      return area.fname === this.area
    },
    getAreaList () {
      this.Http.get('/project', {id: '8a8080866be4efd9016be56fc4a10003'}
      ).then(res => {
        res.data.projectdetalilist.map(item => {
          this.columnsTxt.push(item.fname)
          this.columns.push(item)
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    apply () {
      if (!this.userPhone || !this.username || !this.fname || !this.fmobile || !this.fdate || !this.ftimeS || !this.freason || !this.area) {
        Toast.fail('请将信息填写完整！')
        return false
      }
      this.submit()
      // if () {
      //   Toast.fail('离开时间不能早于到达时间！')
      //   return false
      // }
    },
    submit () {
      this.loading = true
      let obj = {
        openid: this.openId,
        userid: this.userPhone,
        username: this.username,
        fname: this.fname,
        fmobile: this.fmobile,
        fdate: this.fdate + ' ' + this.ftimeS,
        fdate2: this.ftimeE,
        freason: this.freason,
        project_detail_id: this.areaId,
        project_id: '8a8080866be4efd9016be56fc4a10003',
        fcode: this.fcode
      }
      this.Http.post('/invitewx', obj
      ).then(res => {
        switch (res.data.result) {
          case '1':
            Toast.fail('提交成功！')
            this.back()
            break
          default:
            Toast.fail(res.data.message + '!')
            this.loading = false
        }
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
