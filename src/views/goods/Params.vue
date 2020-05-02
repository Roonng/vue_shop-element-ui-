<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片 -->
    <el-card class="box-card">
      <!-- 警告提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCateId"
            :options="cateList"
            :props="cateCasProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="paramsList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tagClose(index, scope.row)"
                >{{item}}</el-tag>
                <!-- new tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editClick(scope.row)"
                >编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="static">
          <!-- 添加静态属性按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="attrList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tagClose(index, scope.row)"
                >{{item}}</el-tag>
                <!-- new tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editClick(scope.row)"
                >编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加dialog -->
    <el-dialog
      :title="'添加' + dialogInfo"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <span>
        <el-form ref="addFormRef" :model="addInfo" label-width="80px" :rules="addRules">
          <el-form-item :label="dialogInfo" prop="name">
            <el-input v-model="addInfo.name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改dialog -->
    <el-dialog :title="'修改' + dialogInfo" :visible.sync="editDialogVisible" width="50%">
      <span>
        <el-form ref="editFormRef" :model="editInfo" label-width="80px" :rules="addRules">
          <el-form-item :label="dialogInfo" prop="name">
            <el-input v-model="editInfo.name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCategories, getGoodsAttr } from "network/goods";
export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      selectCateId: [],
      cateCasProps: {
        expandTrigger: "hover",
        value: "cate_id",
        label: "cate_name",
        children: "children"
      },
      activeName: "many",
      paramsList: [],
      attrList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addInfo: {
        name: ""
      },
      editInfo: {
        name: ""
      },
      addRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    _getCategories() {
      getCategories().then(res => {
        this.cateList = res.data.data;
      });
    },
    handleChange(selectId) {
      console.log('------------handleChange')
      this.selectCateId = selectId;
      // this.paramsList = [
      //   {
      //     attr_id: 1,
      //     attr_name: "版式",
      //     attr_vals: "4k曲面屏 人工智能 30核HDR",
      //   },
      //   {
      //     attr_id: 2,
      //     attr_name: "尺码",
      //     attr_vals: "m s x xl xxl",
      //   },
      //   {
      //     attr_id: 3,
      //     attr_name: "颜色",
      //     attr_vals: "红 黄 蓝 绿 青 紫",
      //   }
      // ];
      // this.attrList = [
      //   {
      //     attr_id: 11,
      //     attr_name: "主体-商品名称"
      //   },
      //   {
      //     attr_id: 12,
      //     attr_name: "显示-曲面"
      //   },
      //   {
      //     attr_id: 13,
      //     attr_name: "系统-智能电视"
      //   },
      //   {
      //     attr_id: 14,
      //     attr_name: "外观-挂壁安装"
      //   },
      //   {
      //     attr_id: 15,
      //     attr_name: "功率-整机功率"
      //   }
      // ];
      // this.paramsList.forEach(item => {
      //   item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      //   item.inputVisible = false
      //   item.inputValue = ''
      // })
      
      getGoodsAttr().then(res => {
        const dataList = res.data.data
        dataList.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          item.inputVisible = false
          item.inputValue = ''
        });
        this.paramsList = dataList
        this.attrList = dataList

        // this.paramsList = res.data.data
        // this.paramsList.forEach(item => {
        //   item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //   item.inputVisible = false
        //   item.inputValue = ''
        // })
        // console.log("list:" ,this.paramsList)
      })
    },
    handleClick() {
      console.log(this.activeName);
    },
    addDialogConfirm() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        this.addDialogVisible = false;
      });
    },
    editDialogConfirm() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.editDialogVisible = false;
      });
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editClick(attrInfo) {
      this.editInfo.name = attrInfo.attr_name;
      this.editDialogVisible = true;
    },
    deleteClick() {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
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
    handleInputConfirm(row) {
      row.inputVisible = false
      if(row.inputValue.trim().length > 0) {
        row.attr_vals.push(row.inputValue.trim())
      }
      row.inputValue = ''
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInputRef.$refs.input.focus();
      })
    },
    tagClose(index, row) {
      row.attr_vals.splice(index, 1)
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectCateId.length === 3) {
        return false;
      }
      return true;
    },
    dialogInfo() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  },
  mounted() {
    this._getCategories();
  }
};
</script>
<style scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>