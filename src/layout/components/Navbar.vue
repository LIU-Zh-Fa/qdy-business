<template>
  <div class="navbar">
    <!-- 伸缩按钮 -->
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- 面包屑 -->
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      :isShow="breadcrumb"
    />
    <!-- 右侧菜单 -->
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- 全屏 -->
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
        <!-- 布局大小 -->
        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <!-- 语言选择 -->
        <!-- <LangSelect class="right-menu-item hover-effect" /> -->
      </template>
        <div @click="goWait" style="cursor: pointer;">
          <el-badge :value="number" class="item" style="margin-right: 30px;top:6px">
            <span class="unaccept" style="font-size: 12px">待接单</span>
          </el-badge>
        </div>
      <!-- 头像下拉 -->
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="person">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="updatePass"
            >修改密码</el-dropdown-item
          >
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="个人中心"
      :visible.sync="open"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="姓名：">
          <span>{{ form.merchantname }}</span>
        </el-form-item>
        <el-form-item label="手机：">
          <span>{{ form.phonenum }}</span>
        </el-form-item>
        <el-form-item label="地址：">
          <span>{{ form.province + "" + form.city + "" + form.address }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="passOpen"
      width="30%"
      :before-close="handlePassClose"
    >
      <el-form
        ref="passform"
        :model="passform"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="原密码：" prop="oldPass">
          <el-input
            placeholder="请输入原密码"
            v-model="passform.oldPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input
            placeholder="请输入新密码"
            v-model="passform.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="passwordt">
          <el-input
            placeholder="请再次输入密码"
            v-model="passform.passwordt"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePassClose">取 消</el-button>
        <el-button type="primary" :loading="btnpassloading" @click="savePass"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <socket ref="socket"></socket>
  </div>
</template>

<script>
import { getUserInfo, savePass } from "@/api/user";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import LangSelect from "@/components/LangSelect";
import socket from '@/views/socket'
import { getCount } from "@/api/orderList";
import { calcDate } from "@/utils/date";
import { validatenull } from '@/utils/validate'
import website from '@/config/website'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    LangSelect,
    socket
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passform.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: "",
      number: 0,
      open: false,
      passOpen: false,
      btnpassloading: false,
      passform: {
        oldPass: "",
        password: "",
        passwordt: "",
      },
      btnloading: false,
      form: {
        province: "",
        city: "",
        address: "",
        phonenum: "",
        merchantname: "",
      },
      rules: {
        oldPass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        passwordt: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.ebus.$on("waitingAcceptNum",(num)=>{
      console.log(num)
      this.number = num
    })
    getUserInfo().then((res) => {
      this.form = res.data;
      this.$store.dispatch("setUserInfo", res.data)
      this.$refs.socket.initWebSocket()
      let queryParams = {
        state: 'waiting_accept'
      }
      getCount(queryParams).then(
        response => {
          this.number = response.data;
        }
      );
    });
  },
  mounted() {
    //实时检测刷新token
    this.refreshToken()
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", 'last_refresh_token_time']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    breadcrumb() {
      return this.$store.state.settings.showBreadcrumb;
    },
  },
  methods: {
        //10分钟检测一次token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const date = calcDate(
          this.last_refresh_token_time,
          new Date().getTime()
        );
        if (validatenull(date)) return;
        const token = this.$store.state.user.token
        if (token && date.seconds >= website.tokenTime && !this.refreshLock) {
          this.refreshLock = true;
          this.$store
            .dispatch("RefreshToken")
            .then(() => {
              this.refreshLock = false;
            })
            .catch(() => {
              this.refreshLock = false;
            });
        }
      }, 1000 * 60 * 10 );
    },
    goWait(){
      console.log(123)
      if(this.$route.path == "/order/waitingAccept"){
          this.ebus.$emit("waitingAcceptRefresh")
      }else{
          this.$router.push("/order/waitingAccept")
      }
    },
    savePass() {
      this.$refs.passform.validate((valid) => {
          if (valid) {
          this.btnpassloading = true;
          savePass(this.passform)
            .then((res) => {
              this.btnpassloading = false;
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改密码成功",
                });
                this.handlePassClose();
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                });
              }
            })
            .catch((e) => {
              this.btnpassloading = false;
              this.$message({
                type: "error",
                message: "修改密码失败",
              });
              this.handlePassClose();
            });
          }
      })
    },
    updatePass() {
      this.passOpen = true;
    },
    person() {
      if (!this.form.id) {
        getUserInfo().then((res) => {
          this.form = res.data;
          this.open = true;
        });
      } else {
        this.open = true;
      }
    },
    handlePassClose() {
      this.passOpen = false;
      this.btnpassloading = false;
      this.passform = {
        oldPass: "",
        password: "",
        passwordt: "",
      };
      this.$refs.passform.resetFields();
    },
    handleClose() {
      this.open = false;
      this.btnloading = false;
      this.form = {
        province: "",
        city: "",
        address: "",
        phonenum: "",
        merchantname: "",
      };
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          // location.href = '/';
          this.$router.push({ path: "/login" });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.unaccept:hover{
  color: #97a8be;
}
.navbar::v-deep .el-badge__content.is-fixed{
  transform: translateY(0) translateX(100%);
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
