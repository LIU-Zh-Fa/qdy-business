<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
    <h3 class="el-login-top">打印商户中心</h3>
      <h3 class="title">商户登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item> -->
      <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
      <p class="xy">登录即同意<span @click="openAgreB = true">《用户协议》</span>和<span @click="openPrivacyB = true">《隐私政策》</span></p>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <a href="https://beian.miit.gov.cn/" target="_blank">去干嘛版权所有 © 2020-2021 鲁ICP备2021006417号-1</a>
    </div>
    <el-dialog
        :visible.sync="openAgreB"
        width="70%">
        <arge></arge>
        <span slot="footer" class="dialog-footer">
            <el-button @click="openAgreB=false">取 消</el-button>
            <el-button type="primary" @click="openAgreB=false">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      :visible.sync="openPrivacyB"
      width="70%">
      <privacy></privacy>
      <span slot="footer" class="dialog-footer">
          <el-button @click="openPrivacyB=false">取 消</el-button>
          <el-button type="primary" @click="openPrivacyB=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getCodeImg } from "@/api/login";
  import Cookies from "js-cookie";
  import { encrypt, decrypt } from '@/utils/jsencrypt'
import arge from './Arge'
import privacy from './Privacy'
  export default {
    name: "Login",
    components:{
      privacy,arge
    },
    data() {
      return {
        codeUrl: "",
        cookiePassword: "",
        openAgreB:false,
        openPrivacyB:false,
        loginForm: {
          username: "",
          password: "",
          rememberMe: false,
          code: "",
          uuid: "",
          type: "password"
        },
        loginRules: {
          username: [
            { required: true, trigger: "blur", message: "用户名不能为空" }
          ],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" }
          ],
          //code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
        },
        loading: false,
        redirect: undefined
      };
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    created() {
      //this.getCode();
      //this.getCookie();
    },
    methods: {
      openAgre(){

      },
      openPrivacy(){

      },
      getCode() {
        getCodeImg().then(res => {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        });
      },
      getCookie() {
        const username = Cookies.get("username");
        const password = Cookies.get("password");
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            // if (this.loginForm.rememberMe) {
            //   Cookies.set("username", this.loginForm.username, { expires: 30 });
            //   Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            //   Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
            // } else {
            //   Cookies.remove("username");
            //   Cookies.remove("password");
            //   Cookies.remove('rememberMe');
            // }
            // this.$store
            //   .dispatch("Login", this.loginForm)
            //   .then(() => {
            //     this.$router.push({ path: this.redirect || "/" });
            //   })
            //   .catch(() => {
            //     this.loading = false;
            //     this.getCode();
            //   });
            this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || "/" });
              //this.loading.close();
              this.loading = false;
              
            }).catch(() => {
              //this.loading.close()
              this.loading = false;
            });
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
.login ::v-deep .el-dialog__body{
  height: 400px;
  overflow-y: scroll;
}
</style>
<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/image/login-background.jpg");
    background-size: 100% 100%;
  }
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }
  .xy{
    font-size: 12px;
    span{
      color: #1890ff;
      cursor: pointer;
    }
  }
  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 300px;
    padding: 25px 25px 5px 25px;
    position: relative;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .el-login-top{
    position: absolute;
    top: -120px;
    width: 250px;
    text-align: center;
    font-size: 36px;
    color: #555;
  }
  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #666;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .login-code-img {
    height: 38px;
  }
</style>
