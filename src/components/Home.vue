<template>
  <el-container class="wrap">
    <!-- 头部区域 -->
    <el-header>
      <div class="top-left clearfix">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container class="content">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px': '250px'">
        <div class="toggle-button" @click="toggleCollapse">
          <span>|||</span>
        </div>
        <!-- 导航菜单 -->
        <el-menu :collapse-transition="false" :collapse="isCollapse" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened>
          <!-- 1级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 2级菜单 -->
            <el-menu-item :index="child.id + ''" v-for="child in item.children" :key="child.id">
              <i class="el-icon-menu"></i>
              <span>{{child.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      icons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.wrap {
  height: 100%;
  .el-header {
    line-height: 60px;
    background-color: #373d41;
    position: relative;
    .top-left {
      span {
        float: left;
        color: #fff;
        font-size: 20px;
      }
    }
    .el-button {
      position: absolute;
      right: 10px;
      height: 40px;
      top: calc(50% - 20px);
    }
  }
  .content {
    .el-aside {
      background-color: #333744;
      .toggle-button {
        cursor: pointer;
        height: 24px;
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 5px;
      }
      .el-menu {
        border-right: none;
      }
    }
    .el-main {
      background-color: #eaedf1;
      i {
        margin-right: 10px;
      }
    }
  }
}

</style>
