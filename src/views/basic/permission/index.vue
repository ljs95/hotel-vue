<template>
  <div v-loading="loading" class="app-container">
    <el-form :inline="true" class="query-form" size="mini">
      <el-form-item>
        <el-button type="success" icon="search" @click="loadData">刷新</el-button>
        <el-button type="primary" @click.native="handleForm(null, null, 'add')">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node, data }" style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
        <span>
          <span :title="data.url">{{ node.label }} ({{ data.url }})</span>
        </span>
        <span>
          <el-button style="font-size: 12px;" type="text" @click="handleForm(node, data, 'add')">添加子菜单</el-button>
          <el-button style="font-size: 12px;" type="text" @click="handleForm(node, data, 'edit')">编辑</el-button>
          <el-button style="font-size: 12px;" type="text" @click="handleDel(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog
      :title="formMap[formName]"
      :visible.sync="showForm"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :model="formData" :rules="formRule" label-width="80px">
        <el-form-item v-show="false" prop="id">
          <el-input v-model.trim="formData.id" auto-complete="off" />
        </el-form-item>
        <el-form-item label="父级菜单" prop="pid">
          <el-cascader
            :value="formData.pid"
            style="width: 100%"
            :options="selectParentData"
            :props="{ multiple: false, checkStrictly: true, value: 'id', label: 'name'}"
            clearable
            @change="handlerPidChange"
          />
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-input v-model.trim="formData.url" auto-complete="off" />
        </el-form-item>
        <el-form-item label="菜单名" prop="name">
          <el-input v-model.trim="formData.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="启用" prop="enabled">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
        <el-form-item label="排序号码" prop="listOrder">
          <el-input v-model.number="formData.listOrder" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Permission',
  data() {
    return {
      treeData: [],
      selectParentData: [],
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showForm: false,
      formData: {
        id: null,
        pid: 0,
        url: null,
        name: null,
        enabled: true,
        listOrder: 0
      },
      formRule: {
        url: [{ required: true, message: '请输入url', trigger: 'blur' }],
        name: [{ required: true, message: '请输入权限名', trigger: 'blur' }],
        listOrder: [{ required: true, message: '请输入排序号码', trigger: 'blur' }]
      },
      formName: null,
      formMap: {
        add: '新增',
        edit: '编辑'
      },
      pidNode: null
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载table数据
    async loadData() {
      this.loading = true
      try {
        const { data } = await this.getRequest('/basic/permission/tree')
        this.treeData = data
        this.selectParentData = [{ id: 0, name: '' }].concat(this.treeData)
      } finally {
        this.loading = false
      }
    },
    // 显示表单
    handleForm(node, data, formName) {
      this.formName = formName
      this.showForm = true
      if (formName === 'edit') {
        this.formData = Object.assign({}, data)
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (data !== null) {
            this.formData.pid = data.id
            this.formData.url = data.url
            this.formData.listOrder = data.listOrder
          }
        })
      }

      // 清空验证信息表单
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
    },
    async handleDel(node, data) {
      try {
        await this.$confirm('确定要删除该权限吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
        this.loading = true
        const { msg } = await this.deleteRequest(`/basic/permission/delete/${data.id}`)

        this.$message({ message: msg, type: 'success' })
        this.loadData()

        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handlerPidChange(data) {
      this.formData.pid = data[data.length - 1]
    },
    async submitForm() {
      try {
        await this.$refs['dataForm'].validate()
        this.loading = true

        if (this.formName === 'add') {
          const { msg } = await this.putRequest('/basic/permission/create', this.formData)
          this.$message({ message: msg, type: 'success' })
        } else {
          const { msg } = await this.postRequest('/basic/permission/update', this.formData)
          this.$message({ message: msg, type: 'success' })
        }

        this.loadData()
        this.showForm = false
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
