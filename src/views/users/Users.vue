<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="6">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getAllUsers(queryInfo)"
          >
            <el-button
              slot="append"
              @click="getAllUsers(queryInfo)"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="12">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户信息表格 -->
      <el-table :data="usersList" stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="名字"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <!-- prop校验规则 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改客户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form
        ref="editFormRef"
        :model="userFromInfo"
        :rules="editFormRules"
        label-width="70px"
        @close="editDialogClose"
      >
        <!-- prop校验规则 -->
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配角色"
      :visible.sync="setRoledialogVisible"
      width="50%"
      @close="setRoleClose"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_ }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, changeUserState, addUser, getUserInfo, editUserInfo, deleUser, setRole, saveRoleInfo } from '@/api';
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        //页数
        pagenum: 1,
        //条数
        pagesize: 2
      },
      usersList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6-15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '邮箱的长度在6-15个字符之间',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '手机号码的长度在6-15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      userFromInfo: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ]
      },
      setRoledialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId:''
    }
  },
  created () {
    this.getAllUsers(this.queryInfo)
  },
  methods: {
    async getAllUsers (queryInfo) {
      const res = await getUsers(queryInfo)
      // console.log(res);
      if (res.meta.status !== 200) return this.$message('获取用户列表失败')
      this.usersList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (NewSize) {
      this.queryInfo.pagesize = NewSize
      this.getAllUsers(this.queryInfo)
    },
    handleCurrentChange (NewSize) {
      this.queryInfo.pagenum = NewSize
      this.getAllUsers(this.queryInfo)
    },
    async userState (userinfo) {
      // console.log(userinfo);
      const res = await changeUserState(userinfo.id, userinfo.mg_state)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success('用户状态更新成功')
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valida => {
        if (!valida) return
        const res = await addUser(this.addForm)
        if (res.meta.status !== 201) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getAllUsers(this.queryInfo)
      })
    },
    async showEditDialog (id) {
      const res = await getUserInfo(id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.userInfo = res.data
      this.editDialogVisible = true
      // console.log(id);
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valida => {
        if (!valida) return
        const res = await editUserInfo(this.userInfo.id, { email: this.userInfo.email, mobile: this.userInfo.mobile })
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        this.editDialogVisible = false
        this.getAllUsers(this.queryInfo)
        this.$message.success('更新用户信息成功')
      })
    },
    async deleUser (id) {
      const res = await this.$confirm('您是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return this.$message.info('已取消删除')
      const data = await deleUser(id)
      if (data.meta.status !== 200) return this.$message.error('删除用户失败')
      this.getAllUsers(this.queryInfo)
      this.$message.success('删除用户成功')
    },
    async setRole (userInfo) {
      this.userInfo = userInfo
      this.setRoledialogVisible = true
      const res = await setRole()
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.rolesList = res.data
    },
    async saveRoleInfo(){
      if (!this.selectedRoleId) {
        this.$message.error('请选择角色')
      }
      const res = await saveRoleInfo(this.userInfo.id, {rid:this.selectedRoleId})
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
      this.getAllUsers(this.queryInfo)
      this.setRoledialogVisible = false
    },
    setRoleClose(){
      this.selectedRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 15px;
}
</style>
