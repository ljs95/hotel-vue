<template>
  <div>
    <el-form ref="ruleForm" v-loading="loading" :model="form" :rules="rules" label-width="60px">
      <el-form-item label="房间" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item label="房型" prop="typeId">
        <el-select v-model="form.typeId" style="width: 100%" placeholder="房型">
          <el-option
            v-for="item in roomTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" style="width: 100%" placeholder="状态">
          <el-option
            v-for="(name, key) in statusList"
            :key="key"
            :label="name"
            :value="Number(key)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="楼层" prop="floor">
        <el-input-number v-model="form.floor" :min="1" :max="10" label="楼层" />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :offset="20">
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'RoomEdit',
  // eslint-disable-next-line vue/require-prop-types
  props: ['isCreate', 'roomTypeList', 'statusList'],
  data() {
    return {
      form: {
        id: null,
        name: null,
        typeId: null,
        status: null,
        floor: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入房间名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择房型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  watch: {
    isCreate: function(val) {
      if (val) {
        this.$refs.ruleForm.resetFields()
      }
    }
  },
  methods: {
    // 加载管理员信息
    async loadInfo(id) {
      try {
        this.loading = true
        const { data } = await this.getRequest(`/room/room/find/${id}`)
        this.form.id = data.id
        this.form.name = data.name
        this.form.typeId = data.typeId
        this.form.floor = data.floor
        this.form.status = data.status
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async submitForm() {
      try {
        await this.$refs.ruleForm.validate()
        this.loading = true

        if (this.isCreate) {
          // 创建用户
          const { msg } = await this.putRequest('/room/room/create', this.form)
          this.$message({ message: msg, type: 'success' })
        } else {
          // 更新用户
          const { msg } = await this.postRequest(`/room/room/update/${this.form.id}`, this.form)
          this.$message({ message: msg, type: 'success' })
        }

        this.loading = false
        this.$emit('success')
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
