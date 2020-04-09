import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    // 超级管理员
    if (roles.includes('root')) {
      return true
    }

    const permissionUrls = store.getters && store.getters.permissions
    const hasPermission = value.some(url => {
      return permissionUrls.includes(url)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-if="checkPermission(['/basic/admin/create', '/basic/admin/update'])"`)
    return false
  }
}
