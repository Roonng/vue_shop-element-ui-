<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片 -->
    <el-card class="box-card">
      <!-- 搜索输入框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="searchCon" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === 1">未付款</el-tag>
            <el-tag type="primary" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="getLoca"></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="100"
      ></el-pagination>
    </el-card>

    <!-- 物流信息dialog -->
    <el-dialog title="物流信息" :visible.sync="localVisible" width="50%">
      <span>
        <!-- 时间线 -->
        <el-timeline reverse>
          <el-timeline-item
            v-for="(activity, index) in logisticsList"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList, getLogistics } from "network/order";
export default {
  name: "Order",
  data() {
    return {
      orderList: [],
      logisticsList: [],
      searchCon: "",
      localVisible: false
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    _getOrderList() {
      getOrderList().then(res => {
        this.orderList = res.data.data;
      });
    },
    _getLogistics() {
      getLogistics().then(res => {
        this.logisticsList = res.data.data;
      });
    },
    getLoca() {
      this.localVisible = true;
      this._getLogistics();
    }
  },
  mounted() {
    this._getOrderList();
  }
};
</script>
<style scoped>
</style>