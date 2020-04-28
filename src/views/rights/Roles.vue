<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <!-- 表格 -->
      <el-table
        :data="roleList"
        stripe
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', 'vcenter',i1 == 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.authName">
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag closable @close="rightDelete">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <el-row :class="[i2 == (item1.children.length-1) ? '' : 'bdbottom', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.authName">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="rightDelete">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" 
                    :key="item3.authName" 
                    closable
                    @close="rightDelete" 
                    type="warning">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="roleName"
          label="权限名称"
          >
        </el-table-column>
        <el-table-column
          prop="describe"
          label="角色描述"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editClick(scope.row)"><i class="el-icon-edit"></i><span>编辑</span></el-button>
            <el-button size="mini" type="danger" @click="deleteRole"><i class="el-icon-delete"></i><span>删除</span></el-button>
            <el-button size="mini" type="warning" @click="showSetDialog(scope.row)"><i class="el-icon-setting"></i><span>分配权限</span></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">
      <!-- main -->
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="addForm.describe"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%" >
      <!-- main -->
      <el-form ref="editFormRef" :model="eidtForm" :rules="addRules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="eidtForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="eidtForm.describe"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightsDialogClose">
      <span>
        <el-tree 
         :data="rightList"
         :props="rightProps"
         show-checkbox
         default-expand-all 
         node-key="id" 
         :default-expanded-keys="idKeys">
        </el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getRoles, getRights } from 'network/rights'
  export default {
    name: "Roles",
    data () {
      return {
        roleList: [],
        rightList: [],
        idKeys: [],
        addDialogVisible:false,
        addForm: {
          name: '',
          describe: ''
        },
        eidtForm:{
          name: '',
          describe: ''
        },
        addRules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          describe: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
          ],
        },
        editDialogVisible: false,
        setRightDialogVisible: false,
        rightProps: {
          children: 'children',
          label: 'authName'
        }
      }
    },
    methods: {
      //获取角色列表
      _getRoles() {
        getRoles().then(res => {
          this.roleList = res.data.data
        })
      },

      //获取所有角色权限
      _getRights() {
        getRights().then(res => {
          this.rightList = res.data.data
        })
      },

      //获取当前用户的三级权限
      getSelectRightIds(node, arr) {
        //如果此节点不存在children属性则为三级节点存入数组中
        if(!node.children) {
          return arr.push(node.id)
        }
        //当节点为一二级时，递归获取三级权限
        node.children.forEach(item => {
          return this.getSelectRightIds(item, arr)
        })
      },
      addConfirm() {
        this.$refs.addFormRef.validate(valid => {
          if(!valid) return
          this.addDialogVisible = false
        })
      },
      editConfirm() {
        this.$refs.editFormRef.validate(valid => {
          if(!valid) return
          this.editDialogVisible = false
        })
      },
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      editClick(roleInfo) {
        this.eidtForm.name = roleInfo.roleName
        this.eidtForm.describe = roleInfo.describe
        this.editDialogVisible = true
      },
      deleteRole() {
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
      rightDelete() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
      showSetDialog(node) {
        this._getRights()
        this.getSelectRightIds(node, this.idKeys)
        console.log(this.idKeys)
        this.setRightDialogVisible = true
      },
      setRightsDialogClose() {
        this.idKeys = []
      }
    },
    mounted() {
      this._getRoles()
    }
  }
</script>
<style scoped>
  .el-tag{
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .el-col{

  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>