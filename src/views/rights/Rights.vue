<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table
        :data="rightList"
        stripe
        border
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="name"
          label="权限名称"
          >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          >
        </el-table-column>

        <el-table-column
          prop="level"
          label="权限等级"
          >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 1">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 2" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: "Rights",
    data () {
      return {
        rightList: [
          {
            name: '商品管理',
            path: 'goods',
            level: 1
          },{
            name: '订单管理',
            path: 'orders',
            level: 1
          },{
            name: '权限管理',
            path: 'goods',
            level: 1
          },{
            name: '商品列表',
            path: 'goods',
            level: 2
          },{
            name: '添加商品',
            path: 'goods',
            level: 3
          },{
            name: '订单列表',
            path: 'goods',
            level: 2
          }
        ]
      }
    }
  }
</script>
<style scoped>
</style>