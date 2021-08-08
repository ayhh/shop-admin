<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入商品名称" v-model="queryinfo.query" clearable @clear="getGoodsList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" stripe="">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          width="100px"
          align="center"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          width="100px"
          align="center"
          prop="goods_number"
        ></el-table-column>
        <el-table-column label="创建时间" width="170px">
          <template>
            {{ nowDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { goodsList, deleGoods } from '@/api';
export default {
  data () {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const res = await goodsList(this.queryinfo)
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取商品数据失败')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newValue) {
      this.queryinfo.pagesize = newValue
      this.getGoodsList()
    },
    handleCurrentChange (newValue) {
      this.queryinfo.pagenum = newValue
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm('您是否要删除该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      }
      const res = await deleGoods(id)
      if(res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    goAddGoods() {
      this.$router.push('/goods/add')
    }
  },
  computed: {
    nowDate () {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 30px;
}
</style>
