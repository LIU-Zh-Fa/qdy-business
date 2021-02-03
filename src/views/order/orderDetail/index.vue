<template>
  <div class="app-container">
      <div class="baseInfo">
          <el-row>
              <el-col :span="12"><span>订单号：</span>{{orderId}}</el-col>
              <el-col :span="12"><span>用户昵称：</span>{{userName}}</el-col>
          </el-row>
      </div>
      <div class="fileList">
          <div class="tablecss" v-for="(item,index) in orderList" :key="index">
            <div class="imgname">
              <img v-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='7z'" src="../../../assets/image/7z.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='csv'" src="../../../assets/image/CSV.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='doc' || item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='docx'" src="../../../assets/image/doc.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='eps'" src="../../../assets/image/eps.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='gif'" src="../../../assets/image/gif.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='mov'" src="../../../assets/image/MOV.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='mp4'" src="../../../assets/image/MP4.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='pdf'" src="../../../assets/image/pdf.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='rar'" src="../../../assets/image/rar.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='txt'" src="../../../assets/image/txt.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='jpg'" src="../../../assets/image/wenjiangeshi_jpg.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='png'" src="../../../assets/image/wenjiangeshi_png.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='ppt' || item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='pptx'" src="../../../assets/image/wenjiangeshi_ppt.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='psd'" src="../../../assets/image/wenjiangeshi_psd.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='svg'" src="../../../assets/image/wenjiangeshi_svg.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='xls' || item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='xlsx'" src="../../../assets/image/xls.png" alt="">
              <img v-else-if="item.originalfilename.split('.')[item.originalfilename.split('.').length-1]=='zip'" src="../../../assets/image/zip.png" alt="">
              <img v-else src="../../../assets/image/unknow.png" alt="">
              <p>{{item.originalfilename}}</p>
            </div>
            <a :href="download+'?uuid='+item.fileuuid" :download="item.originalfilename">下载</a>
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
        </div>
      </div>
  </div>
</template>

<script>
import { orderDetail,orderAmountSave } from "@/api/orderList";
import {  exportDataByBlob } from '@/utils/domUtil'
export default {
  name: "orderdetail",
  data() {
    return {
        id: '',
        download: '',
        orderId: '',
        userName: '',
        num: 0,
        nubBool: false,
        orderList:[],
    };
  },
  created() {
    this.id = this.$route.params.id;
    orderDetail({orderId: this.id}).then(res=>{
        console.log(res)
        this.orderId = res.data.SysOrder.id;
        this.userName = res.data.SysOrder.username
        this.orderList = res.data.SysFile
    })
  },
  mounted(){
    this.download = process.env.VUE_APP_BASE_API + '/cb/download'
  },
  methods: {
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
    click(id, fileName){

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
        width: 40px;
        height: 50px;
      }
      > p{
        margin-left: 12px;
        color: #606266;
      }
    }
    > a{
      line-height: 50px;
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