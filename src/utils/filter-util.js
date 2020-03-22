import Vue from 'vue'

/**
 * 格式化时间
 */
Vue.filter('formatDateTime', function formatDateTime(value) {
  const date = new Date(value * 1000)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  const hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  if (month < 10) {
    month = '0' + month
  }

  if (day < 10) {
    day = '0' + day
  }

  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (seconds < 10) {
    seconds = '0' + seconds
  }

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
})

/**
 * 价格分转元
 */
Vue.filter('priceFenToYuan', function priceFenToYuan(value) {
  return value / 100
})
