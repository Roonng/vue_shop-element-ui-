<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体card -->
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
      <!-- 树形表格 -->
      <tree-table
        class="treeTable" 
        :data="cateList" 
        :columns="Catecolumns" 
        :selection-type="false" 
        :expand-type="false" 
        show-index 
        index-text="" 
        border 
        :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cate_deleted === true" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cate_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cate_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteCate">删除</el-button>
        </template>

      </tree-table>
      <!-- 修改dialog -->
      <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form ref="eidtFormRef" :model="cateForm" :rules="editRules" label-width="80px">
          <el-form-item label="分类名称" prop="catename">
            <el-input v-model="cateForm.catename"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加dialog -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%" @close="editDialogClose">
        <el-form ref="addFormRef" :model="addCateForm" :rules="addRules" label-width="80px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addCateForm.name"></el-input>
          </el-form-item>
          
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectCateId"
              :options="parentsList"
              :props="parentCate"
              @change="handleChange" clearable change-on-select>
              
            </el-cascader>
          </el-form-item>
         

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page="1"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, prev, pager, next, jumper"
          :total="4">
        </el-pagination>
      </div>
    </el-card>
    
  </div>
</template>
<script>
  import { getCategories } from 'network/goods'
  export default {
    name: "GoodsCate",
    data () {
      return {
        cateList: [],
        Catecolumns: [
          {
            label: '分类名称',
            prop: 'cate_name',
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },{
            label: '操作',
            type: 'template',
            template: 'operation'
          }
        ],
        editDialogVisible: false,
        addDialogVisible: false,
        cateForm: {
          catename: ''
        },
        addCateForm: {
          name: '',
          parentCate: ''
        },
        editRules: {
          catename: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ]
        },
        addRules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        parentsList: [
          {
            cate_id: 1,
            cate_name: '家电',
            children: [
              {
                cate_id: 11,
                cate_name: '电视',
              },{
                cate_id: 12,
                cate_name: '沙发',
              },{
                cate_id: 13,
                cate_name: '游戏机',
              }
            ]
          },{
            cate_id: 2,
            cate_name: '生活用品',
            children: [
              {
                cate_id: 21,
                cate_name: '牙刷',
              },{
                cate_id: 22,
                cate_name: '毛巾',
              },{
                cate_id: 23,
                cate_name: '衣服',
              }
            ]
          }
        ],
        selectCateId: '',
        parentCate: {
          label: 'cate_name',
          value: 'cate_id',
          children: 'children',
          expandTrigger: 'hover',
        }
      }
    },
    methods: {
      //获取商品分类数据
      _getCategories() {
        getCategories().then(res => {
          this.cateList = res.data.data
        })
      },
      editCate(cateInfo) {
        this.cateForm.catename = cateInfo.cate_name
        this.editDialogVisible = true
      },
      editDialogConfirm() {
        this.$refs.eidtFormRef.validate(valid => {
          if(!valid){
            return 
          }
          this.editDialogVisible = false
        })
      },
      addDialogConfirm() {
        this.addDialogVisible = false
      },
      deleteCate() {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleChange(newValue) {
        console.log(newValue)
      },
      editDialogClose() {
        this.$refs.addFormRef.resetFields()
        this.selectCateId = []
      }
    },
    mounted() {
      this._getCategories()
    }
  }
</script>
<style scoped>
  .treeTable{
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>