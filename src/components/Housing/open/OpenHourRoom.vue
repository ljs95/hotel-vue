<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="开房时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="timestamp"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="入住小时" prop="time">
        <el-input-number v-model="form.time" :min="hourMinTime" label="入住小时" />
      </el-form-item>
      <el-form-item label="房型">
        <el-select
          v-model="typeId"
          placeholder="房型"
          style="width: 100%"
          @change="getRooms"
        >
          <el-option
            v-for="item in roomTypes"
            :key="item.id"
            :label="item.name + ' (床位:' + item.number + ')'"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房间" prop="roomId">
        <el-select
          v-model="form.roomId"
          v-loading="loadingRoom"
          style="width: 100%"
          placeholder="房间"
        >
          <el-option
            v-for="item in rooms"
            :key="item.id"
            :label="'房间：' + item.name + ' (楼层：' + item.floor + ')'"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-button type="success" @click="submit">开房</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'OpenHourRoom',
  // eslint-disable-next-line vue/require-prop-types
  props: ['hourMinTime', 'roomTypes'],
  data() {
    return {
      loadingRoom: false,
      form: {
        startTime: null,
        time: 0,
        roomId: null
      },
      rules: {
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
          { type: 'number', message: '请输入整数' }
        ],
        roomId: [
          { required: true, message: '请选择房间', trigger: 'blur' },
          { type: 'number', message: '请输入整数' }
        ]
      },
      typeId: null,
      rooms: []
    }
  },
  methods: {
    // 获取没有时间冲突的房间
    async getRooms() {
      try {
        this.loadingRoom = true
        const { data } = await this.getRequest(`/housing/open_room/rooms`, {
          typeId: this.typeId
        })
        this.rooms = data
        this.loadingRoom = false
      } catch (e) {
        this.loadingRoom = false
      }
    },
    // 提交的数据
    async submit() {
      try {
        await this.$refs.ruleForm.validate()
        const { msg } = await this.postRequest('/housing/open_room/openHour', this.form)
        this.$message({ message: msg, type: 'success' })
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style scoped>

</style>
