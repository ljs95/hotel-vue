<template>
  <div v-loading="loading" class="app-container">
    <div>
      <el-input v-model.trim="where.name" style="width: 200px" placeholder="角色" />
      <el-input v-model.trim="where.alias" style="width: 200px" placeholder="别名" />
      <el-button type="success" @click="loadTable"> 查询 </el-button>
      <el-button v-permission="['/basic/role/create']" type="primary" @click="handleCreate"> 添加角色 </el-button>
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
          prop="name"
          label="角色"
          width="200"
          align="center"
        />
        <el-table-column
          prop="alias"
          label="角色别名"
          width="200"
          align="center"
        />
        <el-table-column
          label="角色描述"
          width="250"
          align="center"
        >
          <template v-if="scope.row.remark !== null" slot-scope="scope">
            {{ scope.row.remark | remarkFormat }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['/basic/role/update', '/basic/role/delete', '/basic/role/editPermission'])"
          label="操作"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['/basic/role/update']"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['/basic/role/editPermission']"
              size="mini"
              type="primary"
              @click="assignPermission(scope.row)"
            >分配权限
            </el-button>
            <el-button
              v-permission="['/basic/role/delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :current.sync="listQuery.current" :size.sync="listQuery.size" :total="total" @load="loadTable" />

      <el-dialog title="角色信息" :visible.sync="showEdit" :close-on-click-modal="false">
        <role-edit ref="roleEdit" :is-create="isCreate" @success="successEdit" />
      </el-dialog>

      <el-drawer
        title="角色权限分配"
        :visible.sync="showPermission"
        direction="rtl"
        size="30%"
      >
        <div>
          <el-tree
            ref="permission"
            v-loading="treeLoading"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          />
          <div style="margin-top: 10px">
            <el-button style="margin-left: 5px" class="button-class" @click="showPermission = false">取 消</el-button>
            <el-button v-loading="permissionLoading" class="button-class" type="primary" @click="submitPermission">提 交</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
    <div />
  </div>
</template>

<script>

import Pagination from '@/components/Public/Pagination'
import RoleEdit from './components/RoleEdit'
export default {
  name: 'Role',
  filters: {
    remarkFormat: function(desc) {
      if (desc.length > 8) {
        return desc.substring(0, 8) + '...'
      } else {
        return desc
      }
    }
  },
  components: {
    RoleEdit,
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
        name: null,
        alias: null
      },
      loading: false,
      treeLoading: false,
      showEdit: false,
      isCreate: true,
      showPermission: false,
      permissionLoading: false,
      treeData: [],
      permissionIds: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permissionRoleId: null // 修改权限的角色id
    }
  },
  mounted() {
    this.loadTable()
    this.loadPermission()
  },
  methods: {
    // 加载table数据
    async loadTable() {
      this.loading = true
      try {
        const { data } = await this.postRequest('/basic/role/table',
          {
            current: this.listQuery.current,
            size: this.listQuery.size,
            name: this.where.name,
            alias: this.where.alias
          })

        this.tableData = data.data
        this.total = data.count
      } finally {
        this.loading = false
      }
    },
    async loadPermission() {
      const { data } = await this.getRequest('/basic/role/permissionTree')
      this.treeData = data
    },
    handleCreate() {
      this.isCreate = true
      this.showEdit = true
    },
    async handleEdit(row) {
      this.showEdit = true
      this.isCreate = false
      this.$nextTick(() => {
        this.$refs.roleEdit.loadInfo(row.id)
      })
    },
    // 打开分配权限页面
    async assignPermission(row) {
      this.showPermission = true
      this.permissionRoleId = row.id

      try {
        this.treeLoading = true
        const { data } = await this.getRequest(`/basic/role/permissions/${row.id}`)

        // 默认选中的权限id列表
        const checkedIds = []
        data.forEach((item) => {
          checkedIds.push(item.id)
        })

        this.$refs.permission.setCheckedKeys(checkedIds)
      } finally {
        this.treeLoading = false
      }
    },
    // 删除角色
    async handleDelete(row) {
      try {
        await this.$confirm('是否要删除该角色', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })

        this.loading = true
        const data = await this.deleteRequest(`/basic/role/delete/${row.id}`)
        this.loading = false

        this.$message({ message: data.msg, type: 'success' })
        this.loadTable()
      } catch (e) {
        this.loading = false
      }
    },
    // 角色更新后的回调方法
    successEdit() {
      this.showEdit = false
      this.loadTable()
    },
    async submitPermission() {
      const permissionIds = this.$refs['permission'].getCheckedKeys()
      this.permissionLoading = true
      try {
        const { msg } = await this.postRequest('/basic/role/editPermission', {
          id: this.permissionRoleId,
          permissionIds: permissionIds
        })
        this.$message({ message: msg, type: 'success' })
        this.permissionLoading = false
        this.showPermission = false
        this.loadTable()
      } catch (e) {
        this.permissionLoading = false
      }
    }
  }
}
</script>

<style scoped>
  .button-class {
    width: 45%;
  }
</style>
