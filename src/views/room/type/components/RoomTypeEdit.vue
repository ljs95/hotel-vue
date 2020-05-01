<template>
  <div>
    <el-form ref="ruleForm" v-loading="loading" :model="form" :rules="rules" label-width="60px">
      <el-form-item label="房型" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item label="床位" prop="number">
        <el-input v-model.number="form.number" />
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
  name: 'RoomTypeEdit',
  // eslint-disable-next-line vue/require-prop-types
  props: ['isCreate'],
  data() {
    return {
      form: {
        id: null,
        name: null,
        number: null
      },
      rules: {
        name: [
          { required: true, message: '请输入房型', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请填写床位', trigger: 'blur' }
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
        const { data } = await this.getRequest(`/room/type/find/${id}`)
        this.form.id = data.id
        this.form.name = data.name
        this.form.number = data.number
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
          const { msg } = await this.putRequest('/room/type/create', this.form)
          this.$message({ message: msg, type: 'success' })
        } else {
          // 更新用户
          const { msg } = await this.postRequest(`/room/type/update`, this.form)
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
