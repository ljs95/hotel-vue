<template>
  <el-pagination
    style="margin-top: 10px"
    :current-page.sync="currentPage"
    :page-size.sync="currentSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number
    },
    current: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.current
      },
      set(val) {
        this.$emit('update:current', val)
      }
    },
    currentSize: {
      get() {
        return this.size
      },
      set(val) {
        this.$emit('update:size', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('load', {current: this.currentSize, size: val})
    },
    handleCurrentChange(val) {
      this.$emit('load', {current: val, size: this.currentPage})
    }
  }
}
</script>

<style scoped>

</style>
