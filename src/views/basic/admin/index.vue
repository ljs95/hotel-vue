<template>
  <div v-loading="loading" class="app-container">
    <div>
      <el-input v-model.trim="where.username" style="width: 200px" placeholder="账号" />
      <el-input v-model.trim="where.nickname" style="width: 200px" placeholder="昵称" />
      <el-select v-model="where.enabled" style="width: 200px" placeholder="启/禁用">
        <el-option label="启用" value="true" />
        <el-option label="禁用" value="false" />
      </el-select>
      <el-button type="success" @click="loadTable"> 查询</el-button>
      <el-button v-permission="['/basic/admin/create']" type="primary" @click="handleCreate"> 添加用户</el-button>
    </div>
    <div>
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
          label="角色"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.roles.length === 1">
              {{ scope.row.roles[0].alias }}
            </span>
            <span v-else>
              {{ scope.row.roles[0].alias }}, ...
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="头像"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.userImg" width="50px" height="50px">
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.enabled"> 启用 </p>
            <p v-else> 禁用
            </p>
            <p />
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['/basic/admin/enabled'])"
          label="启/禁用操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.enabled" size="mini" type="danger" @click="updateEnable(scope.row)"> 禁用
            </el-button>
            <el-button v-else size="mini" type="success" @click="updateEnable(scope.row)"> 启用</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['/basic/admin/update', '/basic/admin/delete'])"
          label="操作"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['/basic/admin/update']"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['/basic/admin/delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :current.sync="listQuery.current" :size.sync="listQuery.size" :total="total" @load="loadTable" />
      <el-dialog title="用户信息" :visible.sync="showEdit" :close-on-click-modal="false">
        <admin-edit ref="adminEdit" :is-create="isCreate" @success="successEdit" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Public/Pagination'
import AdminEdit from './components/AdminEdit'

export default {
  name: 'Admin',
  components: {
    AdminEdit,
    Pagination
  },
  data() {
    return {
      tableData: [],
      total: 0,
      listQuery: {
        current: 1,
        size: 10
      },
      where: {
        username: null,
        nickname: null,
        enabled: null
      },
      enabledList: [],
      loading: false,
      showEdit: false,
      isCreate: true
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    // 加载table数据
    async loadTable() {
      this.loading = true
      const { data } = await this.postRequest(`/basic/admin/table`, {
        current: this.listQuery.current,
        size: this.listQuery.size,
        username: this.where.username,
        nickname: this.where.nickname,
        enabled: this.where.enabled
      })
      this.tableData = data.data
      this.total = data.count
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
        const data = await this.postRequest('/basic/admin/enabled', { id: row.id, enabled: !row.enabled })

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
        const data = await this.deleteRequest(`/basic/admin/delete/${row.id}`)
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
