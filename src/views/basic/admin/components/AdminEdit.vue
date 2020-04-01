<template>
  <div>
    <el-form ref="ruleForm" v-loading="loading" :model="admin" :rules="rules" label-width="60px">
      <el-form-item label="账号" prop="username">
        <el-input v-model.trim="admin.username" :disabled="!isCreate" autocomplete="new-password" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="admin.password" type="password" autocomplete="new-password" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model.trim="admin.nickname" />
      </el-form-item>
      <el-form-item label="启用" prop="enabled">
        <el-switch v-model="admin.enabled" />
      </el-form-item>
      <el-form-item label="头像" prop="userImg">
        <el-upload
          class="avatar-uploader"
          action=""
          :before-upload="beforeUpload"
          :http-request="uploadFile"
          :show-file-list="false"
        >
          <img v-if="admin.userImg" :src="admin.userImg" class="avatar">
          <img v-else src="img/upload.jpg" class="avatar">
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
    const checkPassword = (rule, value, callback) => {
      if (this.isCreate) {
        if (value === null || value === '') {
          callback(new Error('密码不能为空'))
        }
      }
      callback()
    }
    return {
      admin: {
        id: null,
        username: null,
        password: null,
        nickname: null,
        enabled: true,
        userImg: null,
        roleIds: []
      },
      roles: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
        ]
      },
      file: null,
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
  mounted() {
    this.getRequest('/basic/role/all')
      .then((data) => {
        this.roles = data.data
      })
  },
  methods: {
    // 加载管理员信息
    async loadInfo(id) {
      try {
        this.loading = true
        const { data } = await this.getRequest(`/basic/admin/find/${id}`)
        this.admin.id = data.id
        this.admin.username = data.username
        this.admin.password = null
        this.admin.nickname = data.nickname
        this.admin.enabled = data.enabled
        this.admin.userImg = data.userImg
        this.admin.roleIds = data.roleIds

        this.loading = false
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
      formData.append('file', this.file)
      this.loading = true
      try {
        const { data } = await this.customRequest('/upload/upload', {
          method: 'post',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        this.loading = false
        this.admin.userImg = data
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
          const { msg } = await this.putRequest('/basic/admin/create', this.admin)
          this.$message({ message: msg, type: 'success' })
        } else {
          // 更新用户
          const { msg } = await this.postRequest(`/basic/admin/update`, this.admin)
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
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
