<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体card -->
    <el-card class="box-card">
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeItem - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addRuleFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 标签页 -->
        <el-tabs
          tab-position="left"
          v-model="activeItem"
          @tab-click="tabClick"
          :before-leave="switchTab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cate"
                :options="cateList"
                :props="cateProp"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item, i) in attrList" :key="i" :label="item.attr_name">
              <el-checkbox
                v-for="(cb, i2) in item.attr_vals"
                :key="i2"
                v-model="item.attr_vals"
                :label="cb"
                border
              ></el-checkbox>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item, i) in attrList" :key="i" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本框 -->
            <quill-editor v-model="addForm.goods_content" />
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getCategories, getGoodsAttr } from "network/goods";
export default {
  name: "GoodsAdd",
  data() {
    return {
      activeItem: "0",
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cate: [],
        goods_content: ""
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cate: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      cateProp: {
        expandTrigger: "hover",
        value: "cate_id",
        label: "cate_name",
        children: "children"
      },
      cateList: [],
      attrList: []
    };
  },
  methods: {
    tabClick() {
      if (this.activeItem === "1") {
        this._getGoodsAttr();
      }
    },
    _getCategories() {
      getCategories().then(res => {
        this.cateList = res.data.data;
      });
    },
    _getGoodsAttr() {
      getGoodsAttr().then(res => {
        const data = res.data.data;
        data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(" ") : [];
        });
        this.attrList = data;
      });
    },
    handleChange() {},
    switchTab(activeTab, oldTab) {
      if (oldTab == "0" && this.addForm.goods_cate.length === 0) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    add() {
      this.$refs.addRuleFormRef.validate(valid => {
        if(!valid) {
          return this.$message.error('请输入必填的商品信息')
        }
      })
    }
  },
  mounted() {
    this._getCategories();
  }
};
</script>
<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.addBtn {
  margin-top: 15px;
}
</style>