<template>
  <div v-loading="loading" class="app-container">
    <el-button type="success" @click="loadTable"> 刷新表格 </el-button>
    <el-button type="primary" @click="handleCreate"> 添加用户 </el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column
        prop="username"
        label="账号"
        width="200"
        align="center"
      />
      <el-table-column
        prop="nickname"
        label="昵称"
        width="200"
        align="center"
      />
      <el-table-column
        prop="email"
        label="邮箱"
        width="250"
        align="center"
      />
      <el-table-column
        label="头像"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="50px" height="50px">
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.enabled === 1"> 启用 </p>
          <p v-else> 禁用
          </p><p />
        </template>
      </el-table-column>
      <el-table-column
        label="启/禁用操作"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.enabled === 1" size="mini" type="danger" @click="updateEnable(scope.row)"> 禁用
          </el-button>
          <el-button v-else size="mini" type="success" @click="updateEnable(scope.row)"> 启用</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="200"
        align="center"
      >
        <template v-if="scope.row.create_time" slot-scope="scope">
          {{ scope.row.create_time | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px"
      :current-page="listQuery.page"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="用户信息" :visible.sync="showEdit">
      <admin-edit ref="adminEdit" :is-create="isCreate" @success="successEdit" />
    </el-dialog>
  </div>
</template>

<script>
import AdminEdit from './components/AdminEdit'

export default {
  name: 'Admin',
  components: {
    AdminEdit
  },
  data() {
    return {
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      loading: false,
      showEdit: false,
      isCreate: true
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    handleSizeChange(size) {
      this.listQuery.limit = size
      this.loadTable()
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.loadTable()
    },
    // 加载table数据
    async loadTable() {
      this.loading = true
      const { code, data, count } = await this.postRequest('/basic.admin/table',
        { page: this.listQuery.page, limit: this.listQuery.limit })
      if (code === 0) {
        this.tableData = data
        this.total = count
      }
      this.loading = false
    },
    // 更新用户状态
    async updateEnable(row) {
      const msg = row.enabled ? '是否要禁用该用户' : '是否要启用该用户'
      try {
        await this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
        this.loading = true
        const data = await this.postRequest('/basic.admin/enabled', { id: row.id, enabled: !row.enabled })

        this.loading = false
        if (data) {
          this.$message({ message: data.msg, type: 'success' })
          this.loadTable()
        }
      } catch (e) {
        this.loading = false
      }
    },
    handleCreate() {
      this.isCreate = true
      this.showEdit = true
    },
    handleEdit(row) {
      this.showEdit = true
      this.isCreate = false
      this.$nextTick(() => {
        this.$refs.adminEdit.loadInfo(row.id)
      })
    },
    // 删除用户
    async handleDelete(row) {
      try {
        await this.$confirm('是否要删除该用户', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })

        this.loading = true
        const data = await this.deleteRequest(`/basic.admin/delete/${row.id}`)
        this.loading = false

        this.$message({ message: data.msg, type: 'success' })
        this.loadTable()
      } catch (e) {
        this.loading = false
      }
    },
    // 用户更新后的回调方法
    successEdit() {
      this.showEdit = false
      this.loadTable()
    }
  }
}
</script>

<style scoped>

</style>
