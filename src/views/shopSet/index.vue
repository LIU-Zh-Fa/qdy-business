<template>
  <div class="app-container">
    <div class="tit">接单设置</div>
    <div>
      <div>
        <el-radio-group v-model="state">
          <el-radio label="1">自动接单</el-radio>
          <el-radio label="2">手动接单</el-radio>
          <el-radio label="3">休息中</el-radio>
        </el-radio-group>
      </div>
      <el-button type="primary" v-loading="btna" @click="updateBusinessState">保存</el-button>
    </div>
    <div class="tit">营业时间设置</div>
    <div>
      <div>
        <el-time-picker
          is-range
          v-model="timeRang"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </div>
      <el-button type="primary" v-loading="btnb" @click="updateBusinessHours">保存</el-button>
    </div>
    <div class="tit">微信公众号是否接收消息推送</div>
    <div>
      <div>
        <el-switch
          v-model="push"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </div>
      <el-button type="primary" v-loading="btnc" @click="updateIsWeChatPush">保存</el-button>
    </div>
  </div>
</template>

<script>
import { updateIsWeChatPush, updateBusinessState, updateBusinessHours } from "@/api/shopSet";
import { mapState } from 'vuex'
import { getUserInfo } from "@/api/user";
import moment from 'moment'
export default {
  name: "price",
  data() {
    return {
      state: '',
      push: false,
      timeRang: [new Date('1976-01-01 00:00:00'),new Date('1976-01-01 00:00:00')],
      btna: false,
      btnb: false,
      btnc: false
    };
  },
  created() {
    getUserInfo().then((res) => {
      this.state = res.data.state
      this.timeRang = [new Date('1976-01-01 '+res.data.startdate),new Date('1976-01-01 '+res.data.enddate)]
      this.push = res.data.ispush == '1' ? true : false
    });
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    })
  },
  methods: {
    updateIsWeChatPush(){
      this.btnc = true
      let params = {isPush : this.push ? '1' : '2'}
      updateIsWeChatPush(params).then(res=>{
        this.btnc = false
        if(res.code == 200){
          this.$message.success("设置成功")
          getUserInfo().then((res) => {
            this.$store.dispatch("setUserInfo", res.data)
          });
        }
      })
    },
    updateBusinessState(){
      this.btna = true
      let params = {state : this.state}
      updateBusinessState(params).then(res=>{
        this.btna = false
        if(res.code == 200){
          this.$message.success("设置成功")
          getUserInfo().then((res) => {
            this.$store.dispatch("setUserInfo", res.data)
          });
        }
      })
    },
    updateBusinessHours(){
      this.btnb = true
      let params = {startTime: moment(this.timeRang[0]).format('HH:mm:ss'), endTime: moment(this.timeRang[1]).format('HH:mm:ss')}
      updateBusinessHours(params).then(res=>{
        this.btnb = false
        if(res.code == 200){
          this.$message.success("设置成功")
          getUserInfo().then((res) => {
            this.$store.dispatch("setUserInfo", res.data)
          });
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.tit{
  height: 48px;
  line-height: 48px;
  background: #f8f8f8;
  font-size: 16px;
  margin: 8px 0;
}
.tit + div{
  margin: 24px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.tit + div>div{
  width: 400px;
}
button{

}
</style>