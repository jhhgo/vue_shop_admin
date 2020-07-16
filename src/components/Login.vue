<template>
  <div class="login_container">
      <div class="login_box">
          <!-- 头像区 -->
          <div class="avatar_box">
              <img src="../assets/logo.png" alt="">
          </div>
          <!-- 表单区 -->
          <el-form label-width="0px" class="login_form">
              <!-- 用户名 -->
              <el-form-item>
                  <el-input></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item>
                  <el-input></el-input>
              </el-form-item>
              <!-- 按钮组 -->
              <el-form-item class="btns">
                  <el-button type="primary">登陆</el-button>
                  <el-button type="info">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.login_container {
    height: 100%;
    background-color: #2b4b6b;
    position: relative;
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: calc(50% - 150px);
        left: calc(50% - 225px);
        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: calc(50% - 65px);
            transform: translateY(-50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .login_form {
            position: absolute;
            width: 100%;
            padding: 0 20px;
            bottom: 0;
            box-sizing: border-box;
            .btns {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>
