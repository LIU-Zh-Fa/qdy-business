<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="searchForm">
      <el-row>
        <el-col :span="5">
          <el-form-item label="取件码" prop="pickCode">
            <el-input
              v-model="queryParams.pickCode"
              placeholder="请输入取件码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号" prop="phonenum">
            <el-input
              v-model="queryParams.phonenum"
              placeholder="请输入手机号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh-right" size="mini" @click="handleRefresh">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="list">
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="下单时间" prop="creattime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creattime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编码" prop="ordernum" />
      <el-table-column label="姓名" prop="username" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="手机号" prop="phonenum"/>
      <el-table-column label="订单状态" align="center" width="100">
        <template slot-scope="scope">
          {{ (statusOptions.filter(item=>item.value == scope.row.state)[0] || {label:''}).label}}
        </template>
      </el-table-column>
      <el-table-column label="文件总数" prop="totalsum" />
      <el-table-column label="取件时间" align="center" prop="updatetime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatetime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="amount" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.state == 'cb_accept_waiting_print'"
            type="text"
            icon="el-icon-printer"
            @click="goDetail(scope.row.id)"
          >去打印</el-button>
          <el-button
            size="mini"
            v-if="scope.row.state == 'cb_accept_waiting_print'"
            type="text"
            icon="el-icon-circle-close"
            @click="handleCancel(scope.row)"
          >取消订单</el-button>
          <el-button
            size="mini"
            v-if="scope.row.state == 'waiting_accept'"
            type="text"
            icon="el-icon-circle-check"
            @click="handleAccept(scope.row)"
          >去接单</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="goDetail(scope.row.id)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
        title="订单预览"
        :visible.sync="openAccept"
        width="30%"
        :before-close="handleClose">
        <div v-loading="acceptBtn">
          <div class="orderInfo">
            <p><span><b>姓名</b>：</span><span>{{username}}</span></p>
            <p><span><b>联系电话</b>：</span><span>{{phonenum}}</span></p>
            <p><span><b>备注</b>：</span><span>{{remark}}</span></p>
          </div>
          <div class="fileList">
              <div class="tablecss" v-for="(item,index) in orderList" :key="index">
                  <p>{{item.originalfilename}}</p>
              </div>
          </div>
          <div class="dialog-footer" style="text-align:center">
              <el-button @click="refuse">拒 绝</el-button>
              <el-button type="primary" @click="accept">接 单</el-button>
          </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, orderDetail, accept, refuse, cancel } from "@/api/orderList";
import { statusOptions } from './constants/index'
export default {
  name: "orderlist",
  data() {
    return {
      btnloading: false,
      statusOptions,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      list: [],
      pickCode: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        state: 'waiting_accept',
        pickCode: '',
        phonenum: ''
      },
      openAccept: false,
      acceptBtn: false,
      orderList: [],
      remark: ''
    };
  },
  created() {
    this.getList();
    this.ebus.$on("waitingAcceptRefresh",()=>{
      this.handleRefresh()
    })
  },
  methods: {
    /**  */
    getList() {
      this.loading = true;
      getList(this.queryParams).then(
        response => {
          this.list = response.data.list;
          this.total = response.data.total;
          this.loading = false;
          this.ebus.$emit("waitingAcceptNum",this.total)
        }
      );
    },
    handleRefresh(){
      this.queryParams ={
        pageNum: 1,
        pageSize: 10,
        state: 'waiting_accept',
        pickCode: '',
        phonenum: ''
      }
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleDetail(row){
        this.open = true;
        this.detailId = row.id
    },
    handleAccept(row){
        this.openAccept = true;
        this.acceptId = row.id
        this.acceptBtn = true
        orderDetail({orderId: row.id}).then(res=>{
          this.remark = res.data.SysOrder.remark
          this.orderList = res.data.SysFile
          this.acceptBtn = false
        })
    },
    goDetail(id){
        this.$router.push({path:'/order/detail/'+id})
    },
    handleClose(){
      this.openAccept = false;
      this.acceptBtn = false
      this.orderList = []
    },
    handleCancel(row){
      this.$confirm("确定取消该订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        cancel({orderId: row.id}).then(res=>{
          if(res.code == 200){
            this.$message.success("取消订单成功")
            this.handleQuery()
          }else{
            this.$message.fail(res.msg)
          }
        })
      });
    },
    refuse(){
      this.acceptBtn = true
      refuse({orderId: this.acceptId}).then(res=>{
        if(res.code == 200){
          this.$message.success("拒绝接单成功")
          this.handleQuery()
          this.acceptBtn = false
          this.handleClose()
        }else{
          this.acceptBtn = false
          this.$message.fail(res.msg)
        }
      })
    },
    accept(){
      this.acceptBtn = true
      accept({orderId: this.acceptId}).then(res=>{
        if(res.code == 200){
          this.$message.success("接单成功")
          this.handleQuery()
          this.acceptBtn = false
          this.handleClose()
        }else{
          this.acceptBtn = false
          this.$message.fail(res.msg)
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.fileList{
  padding-bottom: 30px;
  .tablecss{
    width: 90%;
    margin: 0 auto;
    background: #fff;
    color: #606266;
    p{
      margin: 5px 0;
    }
  }
}
.orderInfo{
  margin-bottom: 12px;
  p{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0;
    span{
      &:nth-child(1){
        color: #aaa;
        display: inline-block;
        width: 80px;
        b{
          display: inline-block;
          text-align: justify;
          width: 64px;
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
      &:nth-child(2){
        flex: 1;
      }
    }
  }
}
</style>