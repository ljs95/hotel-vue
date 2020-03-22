<template>
  <div>
    <el-form ref="ruleForm" v-loading="loading" :model="role" :rules="rules" label-width="60px">
      <el-form-item label="角色" prop="name">
        <el-input v-model.trim="role.name" v-loading="role_loading" :disabled="!isCreate" @change="existRole" />
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model.trim="role.alias" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="role.description" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RoleEdit',
  // eslint-disable-next-line vue/require-prop-types
  props: ['isCreate'],
  data() {
    return {
      role: {
        id: null,
        name: null,
        alias: null,
        description: null
      },
      rules: {
        name: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入角色别名', trigger: 'blur' },
          { max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
        ],
        description: [
          { max: 128, message: '长度在 128 个字符内', trigger: 'blur' }
        ]
      },
      loading: false,
      exist: false,
      role_loading: false
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
    async loadInfo(id) {
      try {
        this.loading = true
        const { code, data } = await this.getRequest(`/basic.role/find/${id}`)
        this.loading = false
        if (code === 0 && this.isCreate === false) {
          this.role.id = data.id
          this.role.name = data.name
          this.role.alias = data.alias
          this.role.description = data.description
        }
      } catch (e) {
        this.loading = false
      }
    },
    // 查询角色是否已存在
    async existRole() {
      this.role_loading = true
      try {
        const { data } = await this.postRequest('/basic.role/existRole', { name: this.role.name })
        this.exist = data
        if (data) {
          this.$message({ message: '角色已存在', type: 'error' })
        } else {
          this.$message({ message: '角色可用', type: 'success' })
        }

        this.role_loading = false
      } catch (e) {
        this.role_loading = false
      }
    },
    async submitForm() {
      if (this.exist && this.isCreate === true) {
        this.$message({ message: '角色已存在', type: 'error' })
        return false
      }

      if (this.role_loading) {
        this.$message({ message: '正在查询角色是否存在，请稍等...', type: 'waring' })
        return false
      }

      try {
        await this.$refs.ruleForm.validate()
        this.loading = true

        if (this.isCreate) {
          // 创建角色
          const { msg } = await this.putRequest('/basic.role/create', this.role)
          this.$message({ message: msg, type: 'success' })
        } else {
          // 更新角色
          const { msg } = await this.postRequest(`/basic.role/update/${this.role.id}`, this.role)
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
