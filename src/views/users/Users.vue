<template>
  <div class="users">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchData">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="role"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editUser(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteUser"></el-button>
            <!-- 文字提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 10]"
        :page-size="queryInfo.pagesize"
        layout="sizes, prev, pager, next, jumper"
        :total="10">
      </el-pagination>
    </el-card>
    <!-- 添加用户按钮对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">
      <!-- 主体form -->
      <el-form ref="addFormRef" :rules="addRules" :model="addForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenum">
          <el-input v-model="addForm.phonenum"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息按钮对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <!-- 主体form -->
      <el-form ref="editFormRef" :rules="editRules" :model="eidtForm" label-width="70px">
        <el-form-item label="用户名" >
          <el-input :value="eidtForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="eidtForm.email" :value="eidtForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenum">
          <el-input v-model="eidtForm.phonenum" :value="eidtForm.phonenum"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%" @close="setRoleDialogVisibleClose">
      <span>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role}}</p>
        <span>分配新角色：</span>
        <el-select v-model="selectNewRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleListL"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getUserList } from 'network/users'
  export default {
    name: "Users",
    data () {
      var checkEmail = (rule, value, cb) => {
        const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"); 
        if(reg.test(value)){
          return cb()
        }
        cb(new Error("请输入合法邮箱"))
      }

      var checkMobile = (rule, value, cb) => {
        const reg =  new RegExp(/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/);
        if(reg.test(value)){
            return cb()
          }
        cb(new Error("手机号格式错误"))
      }
      return {
        userList: [
          // {
          //   id: '1',
          //   username: '小谢',
          //   email: '2496547264@qq.com',
          //   role: '超级管理员',
          //   state: true
          // },
          // {
          //   id: '2',
          //   username: '小黄',
          //   email: 'safasf@qq.com',
          //   role: '超级管理员',
          //   state: false
          // },
          // {
          //   id: '3',
          //   username: '小明',
          //   email: 'safasf@qq.com',
          //   role: '超级管理员',
          //   state: true
          // },
          // {
          //   id: '4',
          //   username: '小红',
          //   email: 'safasf@qq.com',
          //   role: '超级管理员',
          //   state: false
          // },
          // {
          //   id: '5',
          //   username: '小绿',
          //   email: 'safasf@qq.com',
          //   role: '超级管理员',
          //   state: true
          // }
        ],
        queryInfo: {
          //当前页数
          pagenum: 1,
          //每页条数
          pagesize: 2
        },
        roleListL: [
          {
            id: 30,
            roleName: '主管'
          },
          {
            id: 31,
            roleName: '测试人员'
          },
          {
            id: 32,
            roleName: '测试人员2'
          },
          {
            id: 33,
            roleName: '内部员工'
          }
        ],
        searchData: '',
        addDialogVisible: false,
        editDialogVisible: false,
        setRoleDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          phonenum: ''
        },
        addRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          phonenum: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        eidtForm: {
          username: '',
          email: '',
          phonenum: ''
        },
        editRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          phonenum: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        userInfo: {},
        selectNewRoleId: ''
      }
    },
    methods: {
      _getUserList(){
        getUserList().then(res => {
          this.userList = res.data.data
        })
      },
      handleSizeChange(val) {
        this.queryInfo.pageSize = val
        console.log(val)
        this._getUserList()
      },
      handleCurrentChange(val) {
        this.queryInfo.pageNum = val
        this._getUserList()
      },
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      addConfirm() {
        this.$refs.addFormRef.validate(valid => {
          if(!valid) return
          this.addDialogVisible = false
        })
      },
      editUser(userInfo) {
        console.log(userInfo)
        this.eidtForm.username = userInfo.username
        this.eidtForm.email = userInfo.email
        this.eidtForm.phonenum = userInfo.mobile
        this.editDialogVisible = true
      },
      editConfirm() {
        this.$refs.editFormRef.validate(valid => {
          if(!valid) return
          this.editDialogVisible = false
        })
      },
       deleteUser() {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
      showSetRoleDialog(userInfo) {
        console.log(userInfo)
        this.userInfo = userInfo
        this.setRoleDialogVisible = true
      },
      setRoleDialogConfirm() {
        if(!this.selectNewRoleId) {
          return this.$message.error('请选择要分配的角色！')
        }
        this.$message.success('更新角色成功！')
        this.setRoleDialogVisible = false
      },
      setRoleDialogVisibleClose() {
        this.selectNewRoleId = ''
        this.userInfo = {}
      }
    },
    mounted() {
      this._getUserList()
    }
  }
</script>
<style scoped>
</style>