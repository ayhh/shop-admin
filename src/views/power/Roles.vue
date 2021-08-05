<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"> 添加角色 </el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeTag(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="['bdbottom', 'vcenter', i2 === 0 ? 'bdtop' : '']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeTag(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeTag(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="roleDesc" width="300px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="showSetRightVisible" width="50%" @close="setRightClose">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, removeRoleTag, getRight, setUserPower } from '@/api'
export default {
  data () {
    return {
      roleList: [],
      showSetRightVisible: false,
      rightsList: [],
      treeProps:{
        label: 'authName',
        children: 'children'
      },
      defkeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const res = await getRoles()
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
    },
    async removeTag (role, rightId) {
      const result = await this.$confirm('你是否要删除该标签', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('取消成功')
      const res = await removeRoleTag(role.id, rightId)
      if (res.meta.status !== 200) return this.$message.info('删除失败')
      role.children = res.data
      this.$message.success('删除成功')
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const res = await getRight()
      // console.log(res);
      this.rightsList = res.data
      this.getLeafKeys(role, this.defkeys)
      this.showSetRightVisible = true
    },
    getLeafKeys(node, arr) {
      //先将传进来的结点进行判断是不是叶子结点
      // 如果是，就存进数组，不是 就遍历递归他的孩子
      if(!node.children) return arr.push(node.id)
      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      });
    },
    setRightClose(){
      this.defkeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      // console.log(keys);
      const idStr = keys.join(',')
      const res = await setUserPower(this.roleId, {rids:idStr})
      if(res.meta.status !== 200) return this.$message.error('更新权限失败')
      this.$message.success('更新成功')
      this.getRolesList()
      this.showSetRightVisible = false
    }
  },
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
