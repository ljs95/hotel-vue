<template>
  <div v-loading="loading" class="app-container">
    <div>
      <el-select v-model="where.typeId" placeholder="房型">
        <el-option value="" />
        <el-option
          v-for="item in roomTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="success" @click="loadTable">查询</el-button>
      <el-button v-permission="['/room/spec/create']" type="primary" @click="handleCreate">添加房间</el-button>
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
          label="规格"
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
          label="押金"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.price.deposit | priceFenToYuan}} 元
          </template>
        </el-table-column>
        <el-table-column
          label="全日房价格"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.price.day | priceFenToYuan}} 元
          </template>
        </el-table-column>
        <el-table-column
          label="全日房续时价格"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.price.dayContinueHour | priceFenToYuan}} 元
          </template>
        </el-table-column>
        <el-table-column
          label="钟点房价格"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.price.hour | priceFenToYuan}} 元
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['/room/spec/update', '/room/spec/delete'])"
          label="操作"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['/room/spec/update']"
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['/room/spec/delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :current.sync="listQuery.current" :size.sync="listQuery.size" :total="total" @load="loadTable" />
      <el-dialog title="房型规格" :visible.sync="showEdit" width="500px" :close-on-click-modal="false">
        <room-spec-edit ref="RoomSpecEdit" :room-type-list="roomTypeList" :is-create="isCreate" @success="successEdit" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RoomSpecEdit from './components/RoomSpecEdit'
import Pagination from '@/components/Public/Pagination'

export default {
  name: 'RoomSpec',
  components: {
    RoomSpecEdit,
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
        typeId: null
      },
      roomTypeList: [],
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
      const { data } = await this.getRequest('/room/spec/index')
      this.roomTypeList = data.roomTypeList
    },
    // 加载table数据
    async loadTable() {
      this.loading = true
      const { data } = await this.postRequest(`/room/spec/table`, {
        current: this.listQuery.current,
        size: this.listQuery.size,
        typeId: this.where.typeId
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
        this.$refs.RoomSpecEdit.loadInfo(row.id)
      })
    },
    async handleDelete(row) {
      try {
        await this.$confirm('是否要删除该房型规格', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })

        this.loading = true
        const data = await this.deleteRequest(`/room/spec/delete/${row.id}`)
        this.loading = false

        this.$message({ message: data.msg, type: 'success' })
        this.loadTable()
      } catch (e) {
        this.loading = false
      }
    },
    successEdit() {
      this.showEdit = false
      this.loadTable()
    }
  }
}
</script>

<style scoped>

</style>
