<template>
  <div v-loading="loading" class="app-container">
    <div>
      <el-select v-model="where.typeId" placeholder="房型">
        <el-option value=""/>
        <el-option
          v-for="item in roomTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="where.status" placeholder="状态">
        <el-option value=""/>
        <el-option
          v-for="(name, key) in statusList"
          :key="key"
          :label="name"
          :value="key"
        />
      </el-select>
      <el-button type="success" @click="loadTable">查询</el-button>
      <el-button v-permission="['/room/type/create']" type="primary" @click="handleCreate">添加房间</el-button>
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
          label="房间"
          width="200"
          align="center"
        />
        <el-table-column
          prop="roomType.name"
          label="房型"
          width="100"
          align="center"
        />
        <el-table-column
          prop="floor"
          label="楼层"
          width="100"
          align="center"
        />
        <el-table-column
          prop="statusDesc"
          label="状态"
          width="100"
          align="center"
        />
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
      <el-pagination
        style="margin-top: 10px"
        :current-page="listQuery.current"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog title="房间" :visible.sync="showEdit" width="500px" :close-on-click-modal="false">
        <room-edit ref="RoomEdit" :room-type-list="roomTypeList" :status-list="statusList" :is-create="isCreate" @success="successEdit" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RoomEdit from './components/RoomEdit'

export default {
  name: 'Room',
  components: {
    RoomEdit
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
        typeId: null,
        status: null
      },
      roomTypeList: [],
      statusList: [],
      loading: false,
      showEdit: false,
      isCreate: true
    }
  },
  mounted() {
    this.init()
    this.loadTable()
  },
  methods: {
    async init() {
      const { data } = await this.getRequest('/room/room/index')
      this.roomTypeList = data.roomTypeList
      this.statusList = data.statusList
    },
    handleSizeChange(size) {
      this.listQuery.size = size
      this.loadTable()
    },
    handleCurrentChange(current) {
      this.listQuery.current = current
      this.loadTable()
    },
    // 加载table数据
    async loadTable() {
      this.loading = true
      const { data } = await this.postRequest(`/room/room/table`, {
        current: this.listQuery.current,
        size: this.listQuery.size,
        typeId: this.where.typeId,
        status: this.where.status
      })
      this.tableData = data.data
      this.total = data.count
      this.loading = false
    },
    handleCreate() {
      this.isCreate = true
      this.showEdit = true
    },
    handleEdit(row) {
      this.showEdit = true
      this.isCreate = false
      this.$nextTick(() => {
        this.$refs.RoomEdit.loadInfo(row.id)
      })
    },
    // 删除房间
    async handleDelete(row) {
      try {
        await this.$confirm('是否要删除该房间', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })

        this.loading = true
        const data = await this.deleteRequest(`/room/room/delete/${row.id}`)
        this.loading = false

        this.$message({ message: data.msg, type: 'success' })
        this.loadTable()
      } catch (e) {
        this.loading = false
      }
    },
    // 房间更新后的回调方法
    successEdit() {
      this.showEdit = false
      this.loadTable()
    }
  }
}
</script>

<style scoped>

</style>
