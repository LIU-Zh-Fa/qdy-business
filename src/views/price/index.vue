<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="list">
      <el-table-column label="纸张尺寸" prop="papertype"/>
      <el-table-column label="颜色选择" prop="colour">
          <template slot-scope="scope">
              {{ scope.row.colour=="1"?'黑白':'彩印'}}
          </template>
      </el-table-column>
      <el-table-column label="双面打印" prop="singledouble">
          <template slot-scope="scope">
              {{ scope.row.singledouble=="1"?'单面':'双面'}}
          </template>
      </el-table-column>
      <el-table-column label="单价" prop="price">
          <template slot-scope="scope">
              {{ scope.row.price + '元'}}
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handelEdit(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        title="修改"
        :visible.sync="open"
        width="30%"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="纸张尺寸：">
                <span>{{form.papertype}}</span>
                <!-- <el-input v-model="form.name"></el-input> -->
            </el-form-item>
            <el-form-item label="颜色选择：">
                <span>{{ form.colour=="1"?'黑白':'彩印'}}</span>
            </el-form-item>
            <el-form-item label="双面打印：">
                <span>{{ form.singledouble=="1"?'单面':'双面'}}</span>
            </el-form-item>
            <el-form-item label="单价：">
                <el-input-number type="textarea" v-model="form.price" :precision="2" :step="0.01" :min="0"></el-input-number>
                <span style="margin-left: 10px">元</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :loading="btnloading" @click="savePrice">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, savePrice } from "@/api/price";
export default {
  name: "price",
  data() {
    return {
      btnloading: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      form:{
          papertype:'',
          colour:'',
          id: "",
          price: "",
          singledouble: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      getList().then(
        response => {
          this.list = response.data;
          this.loading = false;
        }
      );
    },
    handelEdit(row){
        this.open = true
        this.form = {...row}
    },
    savePrice(){
        savePrice(this.form).then(res=>{
            if(res.code == 200){
                this.$message({
                    type:'success',
                    message:'修改成功'
                })
                this.getList()
                this.handleClose()
            }else{
                this.$message({
                    type:'error',
                    message: res.message
                })
            }
        })
    },
    handleClose(){
        this.open = false;
        this.btnloading=false
        this.form={
          papertype:'',
          colour:'',
          id: "",
          price: "",
          singledouble: ""
      }
    }
  }
};
</script>