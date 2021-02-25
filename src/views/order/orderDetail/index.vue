<template>
  <div class="app-container">
      <div class="baseInfo">
          <el-row>
              <el-col :span="8"><span><b>订单编号</b>：</span>{{ordernum}}</el-col>
              <el-col :span="8"><span><b>姓名</b>：</span>{{username}}</el-col>
              <el-col :span="8"><span><b>联系电话</b>：</span>{{phonenum}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span><b>备注</b>：</span>{{remark}}</el-col>
          </el-row>
      </div>
      <div class="fileList">
          <div class="tablecss" v-for="(item,index) in orderList" :key="index">
            <div class="imgname">
              <img v-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='7z'" src="../../../assets/image/7z.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='csv'" src="../../../assets/image/CSV.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='doc' || item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='docx'" src="../../../assets/image/doc.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='eps'" src="../../../assets/image/eps.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='gif'" src="../../../assets/image/gif.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='mov'" src="../../../assets/image/MOV.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='mp4'" src="../../../assets/image/MP4.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='pdf'" src="../../../assets/image/pdf.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='rar'" src="../../../assets/image/rar.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='txt'" src="../../../assets/image/txt.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='jpg'" src="../../../assets/image/wenjiangeshi_jpg.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='png'" src="../../../assets/image/wenjiangeshi_png.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='ppt' || item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='pptx'" src="../../../assets/image/wenjiangeshi_ppt.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='psd'" src="../../../assets/image/wenjiangeshi_psd.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='svg'" src="../../../assets/image/wenjiangeshi_svg.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='xls' || item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='xlsx'" src="../../../assets/image/xls.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1].toLowerCase()=='zip'" src="../../../assets/image/zip.png" alt="">
              <img v-else src="../../../assets/image/unknow.png" alt="">
              <p>{{item.originalfilename}}</p>
            </div>
            <a v-show="candown" :href="download+'?fileId='+item.fileuuid" :download="item.originalfilename">下载</a>
          </div>
      </div>
      <div class="num">
        <p class="price">
          订单金额： 
          <el-input-number 
            :controls="false" 
            :disabled="!nubBool"
            v-model="num" 
            :precision="2" 
            :step="0.1" 
            :min="0">
            </el-input-number>
          <i v-show="!nubBool" class="el-icon-edit-outline editBtn" @click="nubBool = true"></i>
          <svg-icon v-show="nubBool" icon-class="save"  class="saveBtn" @click="orderAmountSave"/>
        </p> 
        <div class="btn">
          <el-button @click="closePage">关闭</el-button>
          <el-button type="primary" @click="downloadAll" v-show="!candown">一键下载</el-button>
        </div>
      </div>
      <el-dialog
        title="请输入取件码"
        :visible.sync="open"
        width="30%"
        :before-close="handleClose">
        <el-input v-model="pickCode" placeholder="请输入取件码"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :loading="btnloading" @click="checkPickCode">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { orderDetail,orderAmountSave, checkPickCode, verification } from "@/api/orderList";
export default {
  name: "orderdetail",
  data() {
    return {
        id: '',
        download: '',
        phonenum: '',
        username: '',
        remark: '',
        num: 0,
        nubBool: false,
        // 是否显示弹出层
        open: false,
        btnloading: false,
        pickCode:'',
        orderList:[],
        status: '',
        candown: false
    };
  },
  created() {
    this.id = this.$route.params.id;
    orderDetail({orderId: this.id}).then(res=>{
        this.phonenum = res.data.SysOrder.phonenum;
        this.username = res.data.SysOrder.username;
        this.remark = res.data.SysOrder.remark;
        this.ordernum = res.data.SysOrder.ordernum
        this.status = res.data.SysOrder.state
        this.orderList = res.data.SysFile
    })
  },
  mounted(){
    this.download = process.env.VUE_APP_BASE_API + '/cb/download'
  },
  methods: {
    checkPickCode(){
        this.btnloading=true
        if(this.status == 'cb_accept_waiting_print'){
          checkPickCode({orderId: this.id, pickCode:this.pickCode}).then(res=>{
              this.btnloading=false
              if(res.code == 200){
                  this.open = false
                  this.candown = true
                  // this.goDetail(this.id)
                  this.orderList.map(item=>{
                    let a = document.createElement('a') // 创建a标签
                    let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
                    e.initEvent('click', false, false) // 初始化事件对象
                    a.href = this.download+'?fileId='+item.fileuuid // 设置下载地址
                    a.download = item.originalfilename // 设置下载文件名
                    a.dispatchEvent(e)
                  })
              }else{
                  this.$message({
                      type: 'error',
                      message: '验证码错误'
                  })
                  return
              }
          }).catch(e=>{
              this.btnloading=false
          })
        }else if(this.status == 'printed'){
          verification({orderId: this.id, pickCode:this.pickCode}).then(res=>{
              this.btnloading=false
              if(res.code == 200){
                  this.open = false
                  this.candown = true
                  // this.goDetail(this.id)
                  this.orderList.map(item=>{
                    let a = document.createElement('a') // 创建a标签
                    let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
                    e.initEvent('click', false, false) // 初始化事件对象
                    a.href = this.download+'?fileId='+item.fileuuid // 设置下载地址
                    a.download = item.originalfilename // 设置下载文件名
                    a.dispatchEvent(e)
                  })
              }else{
                  this.$message({
                      type: 'error',
                      message: '验证码错误'
                  })
                  return
              }
          }).catch(e=>{
              this.btnloading=false
          })
        }
        
    },
    handleClose(){
        this.open = false;
        this.btnloading=false
        this.pickCode = ''
    },
    orderAmountSave(){
      const params={
        id: this.$route.params.id,
        amount: this.num
      }
      orderAmountSave(params).then(res=>{
        if(res.code == 200){
          this.nubBool = false
        }
      })
    },
    closePage(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/order/list" });
    },
    downloadAll(){
      this.open = true
    }
  }
};
</script>
<style lang="scss" scoped>
.baseInfo{
    padding: 20px;
    font-size: 16px;
    color: rgba(0,0,0,0.45);
    span{
        color: rgba(0,0,0,0.85);
        &:nth-child(1){
          display: inline-block;
          width: 80px;
          b{
            display: inline-block;
            width: 64px;
            text-align: justify;
            font-weight: normal;
            height: 24px;
            vertical-align: top;
            &::after {
                display: inline-block;
                width: 100%;
                content: '';
                height: 0;
            }
          }
          
        }
    }
    >div{
      margin-bottom: 12px;
    }
}
.fileList{
  .tablecss{
    width: 90%;
    margin: 0 auto;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 2px 10px 2px rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 12px;
    .imgname{
      display: flex;
      align-items: center;
      > img{
        width: 32px;
        height: 32px;
      }
      > p{
        margin: 0;
        margin-left: 12px;
        color: #606266;
      }
    }
    > a{
      line-height: 32px;
      color: #409EFF;
    }
  }
}
.num{
  padding: 20px;
  .btn{
    margin: 20px 0 0;
    text-align: center;
  }
}
.editBtn{
  color: #409EFF;
  cursor: pointer;
  margin-left: 12px;
  font-size: 24px;
}
.saveBtn{
  color: #487baf;
  cursor: pointer;
  margin-left: 12px;
  font-size: 20px;
}
.price{
  display: flex;
  align-items: center;
}
</style>