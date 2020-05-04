<template>
  <div>
    <el-form ref="ruleForm" v-loading="loading" :model="form" :rules="rules" label-width="120px">
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
      <el-form-item label="押金" :precision="1" prop="price.deposit">
        <el-input-number v-model="form.price.deposit" :min="1" /> <strong>元</strong>
      </el-form-item>
      <el-form-item label="全日房价格" :precision="1" prop="price.day">
        <el-input-number v-model="form.price.day" :min="1" /> <strong>元</strong>
      </el-form-item>
      <el-form-item label="全日房续时价格" :precision="1" prop="price.dayContinueHour">
        <el-input-number v-model="form.price.dayContinueHour" :min="1" /> <strong>元</strong>
      </el-form-item>
      <el-form-item label="钟点房价格" :precision="1" prop="price.hour">
        <el-input-number v-model="form.price.hour" :min="1" /> <strong>元</strong>
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
  name: 'RoomSpecEdit',
  // eslint-disable-next-line vue/require-prop-types
  props: ['isCreate', 'roomTypeList'],
  data() {
    return {
      form: {
        id: null,
        name: null,
        typeId: null,
        price: {
          deposit: 100,
          day: 100,
          dayContinueHour: 10,
          hour: 10
        }
      },
      rules: {
        name: [
          { required: true, message: '请填写房型规格名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择房型', trigger: 'blur' }
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
    async loadInfo(id) {
      try {
        this.loading = true
        const { data } = await this.getRequest(`/room/spec/find/${id}`)
        this.form.id = data.id
        this.form.name = data.name
        this.form.typeId = data.typeId
        this.form.price.deposit = data.price.deposit / 100
        this.form.price.day = data.price.day / 100
        this.form.price.dayContinueHour = data.price.dayContinueHour / 100
        this.form.price.hour = data.price.hour / 100
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
          // 创建
          const { msg } = await this.putRequest('/room/spec/create', this.form)
          this.$message({ message: msg, type: 'success' })
        } else {
          // 更新
          const { msg } = await this.postRequest(`/room/spec/update/${this.form.id}`, this.form)
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
