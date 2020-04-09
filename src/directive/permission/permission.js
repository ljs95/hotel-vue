import checkPermission from '@/utils/permission'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = checkPermission(value)

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['/basic/admin/create', '/basic/admin/update']"`)
    }
  }
}
