<template>
  <div>
    <div class="homeWelcome">
      欢迎来到酒店后台管理系统, {{ name }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 楷体;
  color: #409eff;
  padding-top: 50px;
}

</style>
