import { getRequest } from './api'
import { routerMap } from '@/router'

/**
 * 获取动态路由
 */
export const getRoutes = async() => {
  const { data } = await getRequest(`/basic/role/menu`)
  const routes = formatRoutes(data)

  // 添加404页面
  routes.push({ path: '*', redirect: '/404', hidden: true })

  return routes
}

export const formatRoutes = (routes) => {
  const fmtRoutes = []
  routes.forEach(route => {
    let { path, name, component, title, icon, children } = route

    if (children) {
      children = formatRoutes(children)
    } else {
      children = []
    }

    const fmtRoute = {
      path: path,
      name: name,
      meta: {
        title: title,
        icon: icon
      },
      component: routerMap[component],
      children: children
    }

    fmtRoutes.push(fmtRoute)
  })

  return fmtRoutes
}

export default {
  getRoutes
}
