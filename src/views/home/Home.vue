<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="~assets/img/home/home_logo.jpg" alt="首页logo">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="flod-button" @click="flodClick">|||</div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#3397FD" 
          unique-opened 
          :collapse="isCollapse"
          :collapse-transition="false" 
          router 
          :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            
            <el-menu-item 
              :index="'/' + childItem.path" 
              v-for="childItem in item.children" 
              :key="childItem.id" @click="saveNavPath('/' + childItem.path)">
              <i class="el-icon-menu"></i>
              <span>{{childItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    name: "Home",
    data () {
      return {
        menuList: [
          {
            id: 125,
            authName: "用户管理",
            // path: "users",
            children: [
              {
                id: 201,
                authName: "用户列表",
                path: "users",
                children: []
              }
            ],
            order: 1
          },{
            id: 103,
            authName: "权限管理",
            path: "rights",
            children: [
              {
                id: 202,
                authName: "角色列表",
                path: "roles",
                children: []
              },{
                id: 203,
                authName: "权限列表",
                path: "rights",
                children: []
              }
            ],
            order: 1
          },{
            id: 101,
            authName: "商品管理",
            path: "goods",
            children: [
              {
                id: 204,
                authName: "商品列表",
                path: "goods",
                children: []
              },{
                id: 205,
                authName: "分类参数",
                path: "goods",
                children: []
              },{
                id: 206,
                authName: "商品分类",
                path: "goods",
                children: []
              }
            ],
            order: 1
          },{
            id: 102,
            authName: "订单管理",
            path: "orders",
            children: [
              {
                id: 207,
                authName: "订单列表",
                path: "orders",
                children: []
              }
            ],
            order: 1
          },{
            id: 145,
            authName: "数据统计",
            path: "reports",
            children: [
              {
                id: 208,
                authName: "数据报表",
                path: "reports",
                children: []
              }
            ],
            order: 1
          }
        ],
        iconList: {
          '125': 'el-icon-user-solid',
          '103': 'el-icon-s-help',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-order',
          '145': 'el-icon-s-platform'
        },
        isCollapse: false,
        activePath: ''
      }
    },
    methods: {
      logout() {
        this.$router.push("/login")
      },
      flodClick() {
        this.isCollapse = !this.isCollapse
      },
      saveNavPath(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      },
    },
    created() {
      this.activePath = window.sessionStorage.getItem('activePath')
    },
  }
</script>
<style lang="less" scoped>
  .home_container{
    height: 100%;
  }
  .el-header{
    background-color: #373B3C;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding-left: 0;
    div{
      display: flex;
      align-items: center;
      img{
        height: 60px;
        width: 60px;
        border-radius: 50%;
      }
      span{
        margin-left: 12px;
      }
    }
  }
  .el-aside{
    background-color: #313743;
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #E9EDF1;
  }
  .flod-button{
    background-color: #475164;
    color: #fff;
    font-size: 10px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
</style>