<template>
  <div class="app-container" v-loading="loading">
    <el-tabs type="border-card">
      <el-tab-pane label="全日房">
        <el-row :gutter="20">
          <el-col :span="12">
            <open-day-room ref="openDay" :day-leave-time="hotelConfig.dayLeaveTime" :room-types="roomTypes" />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="钟点房">
        <el-row :gutter="20">
          <el-col :span="12">
            <open-hour-room ref="openHour" :hour-min-time="hotelConfig.hourMinTime" :room-types="roomTypes" />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OpenDayRoom from '@/components/Housing/open/OpenDayRoom'
import OpenHourRoom from '@/components/Housing/open/OpenHourRoom'

export default {
  name: 'Open',
  components: {
    OpenDayRoom,
    OpenHourRoom
  },
  data() {
    return {
      loading: false,
      hotelConfig: {
        dayLeaveTime: 30, // 全日房最大开房天数
        hourMinTime: 2 // 钟点房最少开房天数
      },
      roomTypes: {}
    }
  },
  async mounted() {
    const { data } = await this.getRequest('housing/open_room/index')
    this.roomTypes = data.roomTypes
  },
  methods: {
    async submit(url, openData) {
      try {
        this.loading = true
        const form = Object.assign(openData)
        const { data, msg } = await this.postRequest(url, form)
        this.$confirm(msg, '开房信息', {
          confirmButtonText: '已缴费',
          cancelButtonText: '未缴费',
          closeOnClickModal: false
        }).then(() => {
          this.alreadyPay(data.serial, data.money)
        }).catch(() => {
        }).finally(() => {
          this.loading = false
        })
      } catch (e) {
        this.loading = false
      }
    },
    // 确认缴费
    async alreadyPay(serial, money) {
      const { msg } = await this.postRequest('/housing.payment/payment', {
        billSerial: serial,
        money: money
      })
      this.$message({ message: msg, type: 'success' })
    }
  }
}
</script>

<style scoped>

</style>
