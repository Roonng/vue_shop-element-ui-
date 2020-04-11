<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/img/login/login.png" alt="登录logio">
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" class="login_form" :model="formData" :rules="rules" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="formData.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" prefix-icon="el-icon-edit" type="password"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: "Login",
    data () {
      return {
        formData: {
          username: 'xiaoxie',
          password: '123456'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs.loginFormRef.validate(valid => {
          if(valid) {
            this.$message({
              message: '登录成功！',
              type: 'success'
            })
            this.$router.push('/home')
          }
        })
      },
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields()
      },
    },
  }
</script>
<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form{
    position: absolute;
    width: 100%;
    bottom: 0px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>