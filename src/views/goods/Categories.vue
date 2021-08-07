<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col
          ><el-button @click="showAddCartDialog" type="primary"
            >添加商品分类</el-button
          ></el-col
        >
      </el-row>
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" type="warning" size="mini"></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
          ></el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCartDialogVisible"
      width="50%"
      @close="addCartDialogClose"
    >
      <el-form ref="addCateFormRef" :rules="addCateFormRules" :model="addCateFrom" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name" >
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectKeys"
            @change="parentCateChanged"
            clearable
            size="mini"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCartDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoriesList, getCateList, addCategories } from '@/api';
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
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
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCartDialogVisible: false,
      addCateFrom: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      parentCateList: [],
      cascaderProps:{
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectKeys: [],
      addCateFormRules:{
        cat_name:[
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const res = await getCategoriesList(this.queryInfo)
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newVaule) {
      this.queryInfo.pagenum = newVaule
      this.getCateList()
    },
    // 如果用户没有选择，那么作为父级分类
    // 父级分类是0，如果不进行监视，不选择的参数将是undefind
    async showAddCartDialog () {
      const res = await getCateList({ type: 2 })
      // console.log(res)
      this.parentCateList = res.data
      this.addCartDialogVisible = true
    },
    // id是商品的id属性，level是商品的分类等级:0，1，2
    parentCateChanged () {
      // console.log(this.selectKeys);
      if(this.selectKeys.length > 0) {
        this.addCateFrom.cat_pid = this.selectKeys[this.selectKeys.length-1]  
        this.addCateFrom.cat_level = this.selectKeys.length

      } else {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
    },
    addCate () {
      // console.log(this.addCateFrom);
      this.$refs.addCateFormRef.validate( async valid => {
        if(!valid) return
        const res = await addCategories(this.addCateFrom)
        // console.log(res);
        if(res.meta.status !== 201) return this.$message.info('添加失败')
        this.getCateList(this.queryInfo)
        this.addCartDialogVisible = false
        this.$message.success('添加成功')
      })
    },
    addCartDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
    }
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 20px;
}

</style>
