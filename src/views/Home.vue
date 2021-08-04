<template>
  <el-container class="home-container">
    <el-header height="100px">
      <div class="logo_info">
        <img src="@/assets/images/y15.jpg" alt="logo" />
        <span>Mall management system</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#3a3d46"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          router
        >
          <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="'/'+i.path" v-for="i in item.children" :key="i.id">
                <i class="el-icon-menu"></i>
                {{i.authName}}
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import { reqBannerList, getMenu } from "@/api";
export default {
  data() {
    return{
      menuList: [],
      iconsObj:{
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message("退出成功");
    },
    async getMenuList() {
      // const data = await this.$http.post('/abi/good')
      const res = await getMenu();
      // console.log(data);
      if(res.meta.status !== 200) return this.$message('获取导航栏失败')
      this.menuList = res.data
    },
  },
  created() {
    this.getMenuList()
  },
  components: {},
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #343435;
  align-items: center;
  .logo_info {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 150px;
      height: 70px;
    }
    span {
      color: white;
      font-size: 35px;
      margin-left: 30px;
      font-family:'Times New Roman', Times, serif;
    }
  }
}

.el-aside {
  background-color: #3a3d46;
  .el-menu{
    border-right: none;
  }
  .iconfont {
    margin-right: 10px;
  }
}

.el-main {
  background-color: #e9eef3;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>