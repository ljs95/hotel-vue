<template>
  <div>
    <el-form ref="ruleForm" v-loading="loading" :model="admin" :rules="rules" label-width="60px">
      <el-form-item label="账号" prop="username">
        <el-input v-model.trim="admin.username" v-loading="username_loading" :disabled="!isCreate" autocomplete="new-password" @change="existUser" />
      </el-form-item>
      <el-form-item v-if="isCreate" label="密码" prop="password">
        <el-input v-model.trim="admin.password" type="password" autocomplete="new-password" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model.trim="admin.nickname" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="admin.email" />
      </el-form-item>
      <el-form-item label="启用" prop="enabled">
        <el-switch v-model="admin.enabled" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action=""
          :before-upload="beforeUpload"
          :http-request="uploadFile"
          :show-file-list="false"
        >
          <img v-if="admin.avatar" :src="admin.avatar" class="avatar">
          <img v-else src="http://qiniublog.colablog.cn/upload.jpg" class="avatar">
        </el-upload>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select
          v-model="admin.roleIds"
          multiple
          style="width: 100%"
          placeholder="用户角色"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name + '(' + item.alias + ')'"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AdminEdit',
  // eslint-disable-next-line vue/require-prop-types
  props: ['isCreate'],
  data() {
    return {
      admin: {
        id: null,
        username: null,
        password: null,
        nickname: null,
        email: null,
        enabled: 1,
        avatar: null,
        roleIds: []
      },
      roles: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      file: null,
      loading: false,
      exist: false,
      username_loading: false
    }
  },
  watch: {
    isCreate: function(val) {
      if (val) {
        this.$refs.ruleForm.resetFields()
      }
    }
  },
  mounted() {
    this.getRequest('/basic.admin/allRole')
      .then((data) => {
        this.roles = data.data
      })
  },
  methods: {
    // 加载管理员信息
    async loadInfo(id) {
      try {
        this.loading = true
        const { code, data } = await this.getRequest(`/basic.admin/find/${id}`)
        this.loading = false
        if (code === 0 && this.isCreate === false) {
          this.admin.id = data.id
          this.admin.username = data.username
          this.admin.password = null
          this.admin.nickname = data.nickname
          this.admin.email = data.email
          this.admin.enabled = data.enabled
          this.admin.avatar = data.avatar
          this.admin.roleIds = data.roleIds
        }
      } catch (e) {
        this.loading = false
      }
    },
    beforeUpload(file) {
      this.file = file
    },
    // 上传头像
    async uploadFile() {
      const formData = new FormData()
      formData.append('img', this.file)
      this.loading = true
      try {
        const { data } = await this.customRequest('/upload/img', {
          method: 'post',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        this.loading = false
        this.admin.avatar = data
      } catch (e) {
        this.loading = false
      }
    },
    // 查询账号是否已存在
    async existUser() {
      this.username_loading = true
      try {
        const { data } = await this.postRequest('/basic.admin/existUser', { username: this.admin.username })
        this.exist = data
        if (data) {
          this.$message({ message: '账号已存在', type: 'error' })
        } else {
          this.$message({ message: '账号可用', type: 'success' })
        }

        this.username_loading = false
      } catch (e) {
        this.username_loading = false
      }
    },
    async submitForm() {
      if (this.exist && this.isCreate === true) {
        this.$message({ message: '账号已存在', type: 'error' })
        return false
      }

      if (this.username_loading) {
        this.$message({ message: '正在查询账号是否存在，请稍等...', type: 'waring' })
        return false
      }

      try {
        await this.$refs.ruleForm.validate()
        this.loading = true

        if (this.isCreate) {
          // 创建用户
          const { msg } = await this.putRequest('/basic.admin/create', this.admin)
          this.$message({ message: msg, type: 'success' })
        } else {
          // 更新用户
          const { msg } = await this.postRequest(`/basic.admin/update/${this.admin.id}`, this.admin)
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
  .avatar-uploader-icon {
    font-size: 28px;
    color: #485e9d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
