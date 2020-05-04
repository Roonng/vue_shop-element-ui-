<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片 -->
    <el-card class="box-card">
      <!-- 搜索输入框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchCon">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getGoodsList } from "network/goods";
export default {
  name: "GoodsList",
  data() {
    return {
      goodsList: [],
      searchCon: ""
    };
  },
  methods: {
    _getGoodsList() {
      getGoodsList().then(res => {
        console.log(res);
        this.goodsList = res.data.data;
      });
    },
    deleteGoods() {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addGoods() {
      this.$router.push('/goods/add')
    }
  },
  mounted() {
    this._getGoodsList();
  }
};
</script>
<style scoped>
</style>